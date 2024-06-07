import OpenAI from "openai";
import { config } from "dotenv";
import { createReadStream } from "fs";
import { logDebug, logError, logInfo, logSuccess } from "./logger";
import { ApiContext } from "../models/context";
import { Column } from "../models/column";
import { PlayerStats } from "../models/player-stats";

config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	project: process.env.OPENAI_PROJECT,
});

export async function startSession(pdfFilePath: string): Promise<ApiContext> {
	logInfo("Creating assistant");
	const assistant = await openai.beta.assistants.create({
		name: "PDF Analyzer",
		instructions: `
			You will be given PDF files containing 
			tables with statistics about a Canadian football game. 
			Your job is to reformat the statistics in to CSV as requested.
		`,
		tools: [{ type: "file_search" }],
		model: "gpt-4o",
	});

	logInfo("Creating thread");
	const thread = await openai.beta.threads.create();

	logInfo("Uploading PDF");
	const pdf = createReadStream(pdfFilePath);
	const file = await openai.files.create({
		file: pdf,
		purpose: "assistants",
	});

	logSuccess("Session started");
	return { thread, assistant, file };
}

export async function getStats(inputs: {
	threadId: string;
	assistantId: string;
	fileId: string;
	tableName: string;
	columns: Column[];
}): Promise<PlayerStats[]> {
	logInfo(`Analyzing ${inputs.tableName}`);
	await openai.beta.threads.messages.create(inputs.threadId, {
		role: "user",
		content: buildPrompt(inputs.tableName, inputs.columns),
		attachments: [
			{
				file_id: inputs.fileId,
				tools: [{ type: "file_search" }],
			},
		],
	});

	logInfo("Creating run");
	const run = await openai.beta.threads.runs.createAndPoll(inputs.threadId, {
		assistant_id: inputs.assistantId,
	});

	logInfo("Passing stats retrieved");
	logDebug(`Used prompt tokens: ${run.usage?.prompt_tokens ?? "--"}`);
	logDebug(`Used completion tokens: ${run.usage?.completion_tokens ?? "--"}`);

	if (run.status === "completed") {
		logSuccess("Run was successful");
		const messages = await openai.beta.threads.messages.list(run.thread_id);
		if (messages.data.length === 0) {
			throw new Error("No messages returned");
		}
		const response = messages.data[0]; // First message should be the response
		const text = getOutputText(response);
		logDebug("Raw response:");
		logDebug(text);

		const stats = parseResponse(text, inputs.columns);
		return stats;
	} else {
		throw new Error(`Run failed. Status: ${run.status}`);
	}
}

function buildPrompt(tableName: string, columns: Column[]): string {
	return `
		Please summarize the individual player statistics from the 
		following columns in the ${tableName} tables:
		Name, Team, PlayerNumber, ${columns.map((col) => col.name).join(", ")}

		There should be two tables, one for each team.
		I want you to combine all players from both teams in the output.
		Summarize the data in CSV format.
		Wrap strings in quotes and separate columns with tabs.

		This is the format for each column:
		- Name: string
		- Team: string
		- PlayerNumber: number
		${columns.map((col) => `- ${col.name}: ${col.type}`).join("\n")}

		Player names should be in the format "LAST First".
		Do not include any other output aside from the CSV rows,
		including the triple quotes indicating the start end end of the csv block.
		Do not include any column headers, just the data. Make sure the columns
		are in the same order as I gave you.
	`.replace(/\t+/g, "");
}

function parseResponse(response: string, columns: Column[]): PlayerStats[] {
	const rows = response.split("\n");
	const output: PlayerStats[] = [];
	for (const row of rows) {
		const [name, team, number, ...values] = row.split("\t");
		if (values.length !== columns.length) {
			// FIXME: Return error
			logError(`Unexpected number of columns: ${values.length}`);
			logError(`Raw row: ${row}`);
			continue;
		}

		const stats: Record<string, string> = {};
		for (let i = 0; i < columns.length; i++) {
			stats[columns[i].name] = values[i];
		}

		output.push({
			name: stripQuotes(name),
			number: parseInt(number, 10),
			team: stripQuotes(team),
			stats,
		});
	}
	return output;
}

function stripQuotes(text: string): string {
	return text.replace(/"/g, "");
}

function getOutputText(message: OpenAI.Beta.Threads.Message): string {
	for (const block of message.content) {
		if (block.type === "text") {
			return block.text.value;
		}
	}
	return "";
}
