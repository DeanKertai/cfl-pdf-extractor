import { PlayerStats } from "../models/player-stats";
import { getStats } from "../lib/openai";
import { ApiContext } from "../models/context";

export async function getCombinedStats(ctx: ApiContext): Promise<PlayerStats[]> {
	const passing = await getPassingStats(ctx);
	const rushing = await getRushingStats(ctx);
	const receiving = await getReceivingStats(ctx);
	const turnovers = await getTurnoverStats(ctx);
	const kickers = await getKickerStats(ctx);
	const defense = await getDefenseStats(ctx);
	const interceptions = await getInterceptionStats(ctx);

	return combinePlayers([
		...passing,
		...rushing,
		...receiving,
		...turnovers,
		...kickers,
		...defense,
		...interceptions,
	]);
}

function combinePlayers(stats: PlayerStats[]): PlayerStats[] {
	const playerMap = new Map<string, PlayerStats>();
	stats.forEach((stat) => {
		const key = stat.name;
		if (playerMap.has(key)) {
			const existing = playerMap.get(key);
			playerMap.set(key, {
				...existing,
				...stat,
			});
		} else {
			playerMap.set(key, stat);
		}
	});
	return Array.from(playerMap.values());
}

async function getPassingStats(ctx: ApiContext): Promise<PlayerStats[]> {
	return await getStats({
		assistantId: ctx.assistant.id,
		fileId: ctx.file.id,
		threadId: ctx.thread.id,
		tableName: "PASSING",
		columns: [
			{ name: "ATT", type: "number" },
			{ name: "COM", type: "number" },
			{ name: "YDS", type: "number" },
			{ name: "INT", type: "number" },
			{ name: "TD", type: "number" },
		],
	});
}

async function getRushingStats(ctx: ApiContext): Promise<PlayerStats[]> {
	return await getStats({
		assistantId: ctx.assistant.id,
		fileId: ctx.file.id,
		threadId: ctx.thread.id,
		tableName: "RUSHING",
		columns: [
			{ name: "ATT", type: "number" },
			{ name: "YDS", type: "number" },
			{ name: "TD", type: "number" },
		],
	});
}

async function getReceivingStats(ctx: ApiContext): Promise<PlayerStats[]> {
	return await getStats({
		assistantId: ctx.assistant.id,
		fileId: ctx.file.id,
		threadId: ctx.thread.id,
		tableName: "RECEIVING",
		columns: [
			{ name: "TAR", type: "number" },
			{ name: "NO", type: "number" },
			{ name: "YDS", type: "number" },
			{ name: "TD", type: "number" },
		],
	});
}

async function getTurnoverStats(ctx: ApiContext): Promise<PlayerStats[]> {
	return await getStats({
		assistantId: ctx.assistant.id,
		fileId: ctx.file.id,
		threadId: ctx.thread.id,
		tableName: "TEAM LOSSES & FUMBLES",
		columns: [
			{ name: "QS", type: "number" },
			{ name: "OTH", type: "number" },
			{ name: "FUM", type: "number" },
		],
	});
}

async function getKickerStats(ctx: ApiContext): Promise<PlayerStats[]> {
	return await getStats({
		assistantId: ctx.assistant.id,
		fileId: ctx.file.id,
		threadId: ctx.thread.id,
		tableName: "FIELD GOALS & CONVERTS",
		columns: [
			{ name: "FGA", type: "number" },
			{ name: "MD (Made field goals)", type: "number" },
			{ name: "S", type: "number" },
			{ name: "MD (Made 1-point converts)", type: "number" },
		],
		additionalContext: `
			The table in the PDF has two columns labeled "MD". 
			The first (leftmost) MD colum is "Made field goals",
			and the second (rightmost) MD column is "Made 1-point converts".`
			.replace(/\n/g, " ")
			.replace(/\t/g, ""),
	});
}

// Note: Interceptions are a separate table in the PDF
// See getInterceptionStats()
async function getDefenseStats(ctx: ApiContext): Promise<PlayerStats[]> {
	return await getStats({
		assistantId: ctx.assistant.id,
		fileId: ctx.file.id,
		threadId: ctx.thread.id,
		tableName: "PLAYER", // See additional context
		columns: [
			{ name: "DT", type: "number" },
			{ name: "QS", type: "number" },
			{ name: "FF", type: "number" },
		],
		additionalContext: `
			The tables we are looking for in the PDF are on the page titled "INDIVIDUAL & TEAM DEFENCE".
			The tables have 10 columns, with the first column being labeled "PLAYER".`
			.replace(/\n/g, " ")
			.replace(/\t/g, ""),
	});
}

// Interceptions are in their own table, separate from other defense stats
async function getInterceptionStats(ctx: ApiContext): Promise<PlayerStats[]> {
	return await getStats({
		assistantId: ctx.assistant.id,
		fileId: ctx.file.id,
		threadId: ctx.thread.id,
		tableName: "INTERCEPTIONS",
		columns: [{ name: "INT", type: "number" }],
	});
}
