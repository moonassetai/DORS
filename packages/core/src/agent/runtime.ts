import { parseSoul } from '@dors/soul';
import { soulToSystemPrompt } from '@dors/soul';
import type { EventBus } from '../events/bus.js';
import type { LLMRouter } from '../llm-router/router.js';
import type { AgentConfig, AgentMessage } from './types.js';
import { ConversationContext } from './context.js';

function buildSystemPrompt(raw: string): string {
  const persona = parseSoul(raw);
  return soulToSystemPrompt(persona);
}

export interface AgentRuntimeConfig {
  config: AgentConfig;
  router: LLMRouter;
  eventBus: EventBus;
}

export class AgentRuntime {
  private config: AgentConfig;
  private router: LLMRouter;
  private eventBus: EventBus;
  private context: ConversationContext;
  private systemPrompt: string;

  constructor({ config, router, eventBus }: AgentRuntimeConfig) {
    this.config = config;
    this.router = router;
    this.eventBus = eventBus;
    this.context = new ConversationContext();
    this.systemPrompt = buildSystemPrompt(config.persona);
  }

  async chat(input: string): Promise<string> {
    const userMessage: AgentMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };
    this.context.add(userMessage);

    this.eventBus.emit('agent:message:sent', {
      agent: this.config.name,
      message: userMessage,
    });

    try {
      const messages = this.context.toPromptMessages(this.systemPrompt);
      const response = await this.router.chat(messages);

      const assistantMessage: AgentMessage = {
        role: 'assistant',
        content: response.content,
        timestamp: Date.now(),
      };
      this.context.add(assistantMessage);

      this.eventBus.emit('agent:message:received', {
        agent: this.config.name,
        message: assistantMessage,
        model: response.model,
        provider: response.provider,
        tokensUsed: response.tokensUsed,
        latencyMs: response.latencyMs,
      });

      return response.content;
    } catch (error) {
      this.eventBus.emit('agent:error', {
        agent: this.config.name,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async *stream(input: string): AsyncIterable<string> {
    const userMessage: AgentMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };
    this.context.add(userMessage);

    this.eventBus.emit('agent:message:sent', {
      agent: this.config.name,
      message: userMessage,
    });

    try {
      const messages = this.context.toPromptMessages(this.systemPrompt);
      let fullContent = '';

      for await (const chunk of this.router.stream(messages)) {
        if (chunk.content) {
          fullContent += chunk.content;
          yield chunk.content;
        }
      }

      const assistantMessage: AgentMessage = {
        role: 'assistant',
        content: fullContent,
        timestamp: Date.now(),
      };
      this.context.add(assistantMessage);

      this.eventBus.emit('agent:message:received', {
        agent: this.config.name,
        message: assistantMessage,
      });
    } catch (error) {
      this.eventBus.emit('agent:error', {
        agent: this.config.name,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
