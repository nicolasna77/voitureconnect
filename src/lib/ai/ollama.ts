import { createOpenAI } from "@ai-sdk/openai";

export function getOllamaModel() {
  const ollama = createOpenAI({
    baseURL: process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434/v1",
    apiKey: "ollama",
    // Force Chat Completions endpoint — Ollama does not support the Responses API
  });
  return ollama(process.env.OLLAMA_MODEL ?? "llama3.2");
}
