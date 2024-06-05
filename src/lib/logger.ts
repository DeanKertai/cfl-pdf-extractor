enum Colors {
	RED = "\x1b[31m",
	GREEN = "\x1b[32m",
	YELLOW = "\x1b[33m",
	BLUE = "\x1b[34m",
	MAGENTA = "\x1b[35m",
	CYAN = "\x1b[36m",
	WHITE = "\x1b[37m",
	RESET = "\x1b[0m",
}

export function logInfo(message: string): void {
	console.log(`${Colors.CYAN}[INFO] ${message}${Colors.RESET}`);
}

export function logError(message: string): void {
	console.log(`${Colors.RED}[ERROR] ${message}${Colors.RESET}`);
}

export function logSuccess(message: string): void {
	console.log(`${Colors.GREEN}[SUCCESS] ${message}${Colors.RESET}`);
}

export function logWarning(message: string): void {
	console.log(`${Colors.YELLOW}[WARNING] ${message}${Colors.RESET}`);
}

export function logDebug(message: string): void {
	console.log(`${Colors.MAGENTA}[DEBUG] ${message}${Colors.RESET}`);
}
