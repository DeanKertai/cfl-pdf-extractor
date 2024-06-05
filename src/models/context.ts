import OpenAI from "openai";

export interface ApiContext {
	thread: OpenAI.Beta.Threads.Thread;
	assistant: OpenAI.Beta.Assistants.Assistant;
	file: OpenAI.Files.FileObject;
}
