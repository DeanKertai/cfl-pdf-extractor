import { PlayerStats } from "../models/player-stats";
import { getStats } from "../lib/openai";
import { ApiContext } from "../models/context";

export async function getPassingStats(ctx: ApiContext): Promise<PlayerStats[]> {
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

export async function getRushingStats(ctx: ApiContext): Promise<PlayerStats[]> {
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

export async function getReceivingStats(ctx: ApiContext): Promise<PlayerStats[]> {
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

export async function getTurnoverStats(ctx: ApiContext): Promise<PlayerStats[]> {
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

export async function getKickerStats(ctx: ApiContext): Promise<PlayerStats[]> {
	return await getStats({
		assistantId: ctx.assistant.id,
		fileId: ctx.file.id,
		threadId: ctx.thread.id,
		tableName: "FIELD GOALS & CONVERTS",
		columns: [
			{ name: "FGA", type: "number" },
			{ name: "MD", type: "number" },
			{ name: "S", type: "number" },
			{ name: "MD", type: "number" },
		],
	});
}
