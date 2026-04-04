import type { ChatOptions, StreamChunk, LLMProvider } from '@dors/ai';
import { LLMRouter } from '@dors/ai';
import { ContextManager } from './context.js';
import { checkThreeLaws } from './safety/three-laws.js';
import { Sandbox } from './safety/sandbox.js';
import { EventBus } from './events.js';
import type { Tool, ToolResult } from './tools/types.js';
import type { Persona } from './soul/types.js';
import { injectPersona } from './soul/injector.js';

export interface AgentConfig {
  provider: LLMProvider;
  fallbackProvider?: LLMProvider;
  persona?: Persona;
  tools?: Tool[];
  sandbox?: Partial<{ allowShell: boolean; allowNetwork: boolean; allowFileWrite: boolean }>;
  chatOptions?: ChatOptions;
}

export class AgentLoop {
  private router: LLMRouter;
  private context: ContextManager;
  private sandbox: Sandbox;
  private tools: Map<string, Tool>;
  private events: EventBus;
  private persona?: Persona;
  private chatOptions: ChatOptions;

  constructor(config: AgentConfig) {
    this.router = new LLMRouter({
      primary: config.provider,
      fallback: config.fallbackProvider,
    });
    this.context = new ContextManager();
    this.sandbox = new Sandbox(config.sandbox);
    this.tools = new Map();
    this.events = new EventBus();
    this.persona = config.persona;
    this.chatOptions = config.chatOptions ?? {};

    if (config.tools) {
      for (const tool of config.tools) {
        this.tools.set(tool.name, tool);
      }
    }

    if (this.persona) {
      const systemPrompt = injectPersona(this.persona);
      this.context.add({ role: 'system', content: systemPrompt });
    }
  }

  async *processMessage(userMessage: string): AsyncIterable<StreamChunk> {
    // Safety check
    const safety = checkThreeLaws(userMessage);
    if (!safety.allowed) {
      yield { type: 'text', content: safety.reason ?? 'Request blocked by safety policy.' };
      yield { type: 'done' };
      return;
    }

    this.context.add({ role: 'user', content: userMessage });
    await this.events.emit('message', { role: 'user', content: userMessage });

    const toolDefs = this.getToolDefinitions();
    const options: ChatOptions = {
      ...this.chatOptions,
      ...(toolDefs.length > 0 ? { tools: toolDefs } : {}),
    };

    let fullResponse = '';

    for await (const chunk of this.router.chat(this.context.getMessages(), options)) {
      if (chunk.type === 'text' && chunk.content) {
        fullResponse += chunk.content;
      }

      if (chunk.type === 'tool_call' && chunk.toolCall) {
        const result = await this.executeTool(chunk.toolCall.name, chunk.toolCall.args);
        yield { type: 'tool_call', toolCall: chunk.toolCall };

        // Add tool result to context and continue
        this.context.add({
          role: 'tool',
          content: result.success ? result.output : `Error: ${result.error}`,
          toolCallId: chunk.toolCall.name,
        });
      }

      yield chunk;
    }

    if (fullResponse) {
      this.context.add({ role: 'assistant', content: fullResponse });
      await this.events.emit('response', fullResponse);
    }
  }

  private async executeTool(name: string, args: Record<string, unknown>): Promise<ToolResult> {
    const tool = this.tools.get(name);
    if (!tool) {
      return { success: false, output: '', error: `Unknown tool: ${name}` };
    }

    const permission = this.sandbox.canExecuteTool(name);
    if (!permission.allowed) {
      return { success: false, output: '', error: permission.reason ?? 'Tool blocked by sandbox' };
    }

    try {
      return await tool.execute(args);
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private getToolDefinitions(): Array<{ name: string; description: string; parameters: Record<string, unknown> }> {
    return Array.from(this.tools.values()).map((t) => ({
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    }));
  }

  on(event: string, handler: (data: unknown) => void): () => void {
    return this.events.on(event, handler);
  }

  getContext(): ContextManager {
    return this.context;
  }
}
