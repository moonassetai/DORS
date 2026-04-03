// Events
export { EventBus } from './events/bus.js';
export type { EventHandler } from './events/bus.js';

// LLM Router — types
export type {
  Message,
  ChatOptions,
  StreamChunk,
  ChatResponse,
  LLMProvider,
} from './llm-router/types.js';

// LLM Router — providers
export { BaseLLMProvider } from './llm-router/providers/base.js';
export { OllamaProvider } from './llm-router/providers/ollama.js';
export type { OllamaProviderConfig } from './llm-router/providers/ollama.js';
export { ClaudeProvider } from './llm-router/providers/claude.js';
export type { ClaudeProviderConfig } from './llm-router/providers/claude.js';
export { OpenAIProvider } from './llm-router/providers/openai.js';
export type { OpenAIProviderConfig } from './llm-router/providers/openai.js';

// LLM Router
export { LLMRouter } from './llm-router/router.js';
export type { LLMRouterConfig } from './llm-router/router.js';

// Agent — types
export type { AgentConfig, AgentMessage } from './agent/types.js';

// Agent — context
export { ConversationContext } from './agent/context.js';

// Agent — runtime
export { AgentRuntime } from './agent/runtime.js';
export type { AgentRuntimeConfig } from './agent/runtime.js';
