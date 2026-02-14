import { createOpenAI } from '@ai-sdk/openai';

/**
 * AI Provider configuration using Vercel AI Gateway
 *
 * Vercel AI Gateway provides:
 * - One key, hundreds of models from multiple providers
 * - Unified API to switch between providers with minimal code changes
 * - High reliability with automatic retries and fallbacks
 * - Spend monitoring across different providers
 * - No markup on tokens
 *
 * Configuration:
 * - AI_GATEWAY_API_KEY: Your Vercel AI Gateway API key
 * - AI_MODEL: Model in format "provider/model" (e.g., "openai/gpt-4o")
 *
 * @see https://vercel.com/docs/ai-gateway
 */

const VERCEL_AI_GATEWAY_URL = 'https://ai-gateway.vercel.sh/v1';
const AI_GATEWAY_API_KEY = process.env.AI_GATEWAY_API_KEY;

if (!AI_GATEWAY_API_KEY) {
  console.warn(
    'AI_GATEWAY_API_KEY is not set. AI features will not work.\n' +
    'Get your API key from: https://vercel.com/~/ai-gateway'
  );
}

// Create OpenAI-compatible provider through Vercel AI Gateway
export const aiProvider = createOpenAI({
  apiKey: AI_GATEWAY_API_KEY,
  baseURL: VERCEL_AI_GATEWAY_URL,
});

// Default model for AI operations (format: provider/model)
// Available models: https://vercel.com/ai-gateway/models
export const DEFAULT_AI_MODEL = process.env.AI_MODEL || 'openai/gpt-4o';

// Helper to get configured AI model
export function getAIModel(modelId?: string) {
  return aiProvider(modelId || DEFAULT_AI_MODEL);
}

// Export configuration status for debugging
export const aiConfig = {
  hasApiKey: !!AI_GATEWAY_API_KEY,
  baseURL: VERCEL_AI_GATEWAY_URL,
  model: DEFAULT_AI_MODEL,
};
