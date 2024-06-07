import { logInfo } from "./lib/logger";
import { startSession } from "./lib/openai";
import { getCombinedStats } from "./lib/stats";

async function main() {
	logInfo("Starting PDF Analyzer");

	const context = await startSession("test-reduced.pdf");
	const stats = await getCombinedStats(context);
}

main();
