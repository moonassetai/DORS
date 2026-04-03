export interface LLMProvider {
  id: string;
  name: string;
  type: "ollama" | "anthropic" | "openai" | "custom";
  baseUrl?: string;
  apiKey?: string;
  model: string;
}

export interface LLMConfig {
  provider: LLMProvider;
  fallback?: LLMProvider;
  maxTokens?: number;
  temperature?: number;
}

export interface RouterConfig {
  providers: LLMProvider[];
  defaultProvider: string;
  costAware: boolean;
  maxMonthlySpend?: number;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface CompletionResult {
  content: string;
  provider: string;
  model: string;
  tokensUsed: number;
  latencyMs: number;
}

export class LLMRouter {
  private config: RouterConfig;

  constructor(config: RouterConfig) {
    this.config = config;
  }

  async complete(messages: ChatMessage[]): Promise<CompletionResult> {
    const provider = this.resolveProvider();
    const start = Date.now();

    switch (provider.type) {
      case "ollama":
        return this.completeOllama(provider, messages, start);
      case "anthropic":
        return this.completeAnthropic(provider, messages, start);
      case "openai":
        return this.completeOpenAI(provider, messages, start);
      default:
        throw new Error(`Unknown provider type: ${provider.type}`);
    }
  }

  private resolveProvider(): LLMProvider {
    const provider = this.config.providers.find(
      (p) => p.id === this.config.defaultProvider
    );
    if (!provider) {
      throw new Error(
        `Provider "${this.config.defaultProvider}" not found in config`
      );
    }
    return provider;
  }

  private async completeOllama(
    provider: LLMProvider,
    messages: ChatMessage[],
    start: number
  ): Promise<CompletionResult> {
    const baseUrl = provider.baseUrl || "http://localhost:11434";
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: provider.model,
        messages,
        stream: false,
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama error: ${res.status} ${await res.text()}`);
    }

    const data = (await res.json()) as {
      message: { content: string };
      eval_count?: number;
      prompt_eval_count?: number;
    };

    return {
      content: data.message.content,
      provider: provider.id,
      model: provider.model,
      tokensUsed: (data.eval_count ?? 0) + (data.prompt_eval_count ?? 0),
      latencyMs: Date.now() - start,
    };
  }

  private async completeAnthropic(
    provider: LLMProvider,
    messages: ChatMessage[],
    start: number
  ): Promise<CompletionResult> {
    const systemMsg = messages.find((m) => m.role === "system");
    const chatMsgs = messages.filter((m) => m.role !== "system");

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": provider.apiKey!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: provider.model,
        max_tokens: 4096,
        system: systemMsg?.content,
        messages: chatMsgs.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!res.ok) {
      throw new Error(`Anthropic error: ${res.status} ${await res.text()}`);
    }

    const data = (await res.json()) as {
      content: Array<{ text: string }>;
      usage: { input_tokens: number; output_tokens: number };
    };

    return {
      content: data.content[0].text,
      provider: provider.id,
      model: provider.model,
      tokensUsed: data.usage.input_tokens + data.usage.output_tokens,
      latencyMs: Date.now() - start,
    };
  }

  private async completeOpenAI(
    provider: LLMProvider,
    messages: ChatMessage[],
    start: number
  ): Promise<CompletionResult> {
    const baseUrl = provider.baseUrl || "https://api.openai.com/v1";
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
        model: provider.model,
        messages,
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI error: ${res.status} ${await res.text()}`);
    }

    const data = (await res.json()) as {
      choices: Array<{ message: { content: string } }>;
      usage: { total_tokens: number };
    };

    return {
      content: data.choices[0].message.content,
      provider: provider.id,
      model: provider.model,
      tokensUsed: data.usage.total_tokens,
      latencyMs: Date.now() - start,
    };
  }
}
