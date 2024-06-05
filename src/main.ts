import { logInfo } from "./lib/logger";
import { startSession } from "./lib/openai";
import {
	getKickerStats,
	getPassingStats,
	getReceivingStats,
	getRushingStats,
	getTurnoverStats,
} from "./lib/stats";

async function main() {
	logInfo("Starting PDF Analyzer");

	const context = await startSession("test-reduced.pdf");

	const passing = await getPassingStats(context);
	const rushing = await getRushingStats(context);
	const receiving = await getReceivingStats(context);
	const turnovers = await getTurnoverStats(context);
	const kickers = await getKickerStats(context);

	console.log(passing);
	console.log(rushing);
	console.log(receiving);
	console.log(turnovers);
	console.log(kickers);
}

main();
