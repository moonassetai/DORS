import { Command } from 'commander';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { homedir } from 'node:os';
import { createInterface } from 'node:readline';
import TOML from 'toml';
import { LLMRouter } from '@dors/core';
import { OllamaProvider, ClaudeProvider, OpenAIProvider } from '@dors/core';
import { parseSoul, soulToSystemPrompt } from '@dors/soul';
import { DorsDatabase, ConversationStore } from '@dors/storage';
import { ThreeLawsEngine } from '@dors/safety';
import { banner, log, error, warn } from '../ui/prompt.js';

const PURPLE = '\x1b[35m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

interface DorsConfig {
  agent: { name: string; persona: string };
  llm: { provider: string; model: string; api_key?: string; base_url?: string; failover?: { chain?: string[] } };
  storage: { driver: string; path: string };
  safety: { level: string; three_laws: boolean };
}

function loadConfig(): DorsConfig {
  const dorsHome = resolve(homedir(), '.dors');
  const configPath = join(dorsHome, 'config.toml');

  if (!existsSync(configPath)) {
    error('DORS not initialized. Run `dors init` first.');
    process.exit(1);
  }

  const raw = readFileSync(configPath, 'utf-8');
  return TOML.parse(raw) as unknown as DorsConfig;
}

function buildRouter(config: DorsConfig): LLMRouter {
  const providers = [];

  switch (config.llm.provider) {
    case 'ollama':
      providers.push(
        new OllamaProvider({
          baseUrl: config.llm.base_url,
          model: config.llm.model,
        }),
      );
      break;
    case 'claude':
      providers.push(
        new ClaudeProvider({
          apiKey: config.llm.api_key!,
          model: config.llm.model,
        }),
      );
      break;
    case 'openai':
      providers.push(
        new OpenAIProvider({
          apiKey: config.llm.api_key!,
          model: config.llm.model,
          baseUrl: config.llm.base_url,
        }),
      );
      break;
  }

  const failoverChain = config.llm.failover?.chain ?? [];
  for (const name of failoverChain) {
    if (name === 'ollama' && config.llm.provider !== 'ollama') {
      providers.push(new OllamaProvider({}));
    }
  }

  return new LLMRouter({
    providers,
    defaultProvider: config.llm.provider,
    failoverOrder: failoverChain,
  });
}

export const chatCommand = new Command('chat')
  .description('Start an interactive chat session')
  .option('-c, --conversation <id>', 'Resume a conversation by ID')
  .action(async (opts: { conversation?: string }) => {
    banner();

    const config = loadConfig();
    const dorsHome = resolve(homedir(), '.dors');

    log(`Agent: ${BOLD}${config.agent.name}${RESET}`);
    log(`LLM: ${config.llm.provider}/${config.llm.model}`);

    const router = buildRouter(config);
    const available = await router.getAvailableProviders();
    if (available.length === 0) {
      error('No LLM providers available. Check your configuration.');
      if (config.llm.provider === 'ollama') {
        warn('Is Ollama running? Try: ollama serve');
      }
      process.exit(1);
    }
    log(`Provider: ${available.map((p) => p.name).join(', ')} ${DIM}(available)${RESET}`);

    const soulPath = join(dorsHome, 'SOUL.md');
    let systemPrompt = `You are ${config.agent.name}, a helpful AI assistant.`;
    if (existsSync(soulPath)) {
      const soulRaw = readFileSync(soulPath, 'utf-8');
      const persona = parseSoul(soulRaw);
      systemPrompt = soulToSystemPrompt(persona);
    }

    const safety = new ThreeLawsEngine({
      level: (config.safety.level as 'permissive' | 'standard' | 'strict') ?? 'standard',
      threeLaws: config.safety.three_laws ?? true,
      blockedCategories: [],
      allowedCapabilities: [],
    });

    const dbPath = resolve(dorsHome, config.storage.path);
    const db = new DorsDatabase(dbPath);
    db.init();
    const conversations = new ConversationStore(db);

    let conversationId: string;
    if (opts.conversation) {
      const existing = conversations.get(opts.conversation);
      if (!existing) {
        error(`Conversation ${opts.conversation} not found.`);
        process.exit(1);
      }
      conversationId = existing.id;
      log(`Resuming conversation: ${conversationId}`);
    } else {
      const conv = conversations.create(`Chat with ${config.agent.name}`, config.agent.name);
      conversationId = conv.id;
    }

    const history: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ];

    if (opts.conversation) {
      const msgs = conversations.getMessages(conversationId);
      for (const m of msgs) {
        history.push({ role: m.role as 'user' | 'assistant', content: m.content });
      }
    }

    console.log('');
    console.log(`${DIM}Type your message and press Enter. Type /exit to quit.${RESET}`);
    console.log(`${DIM}Conversation: ${conversationId}${RESET}`);
    console.log('');

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `${PURPLE}you ▸${RESET} `,
    });

    rl.prompt();

    rl.on('line', async (line) => {
      const input = line.trim();
      if (!input) {
        rl.prompt();
        return;
      }

      if (input === '/exit' || input === '/quit' || input === '/q') {
        log('Goodbye.');
        db.close();
        process.exit(0);
      }

      if (input === '/history') {
        const msgs = conversations.getMessages(conversationId);
        for (const m of msgs) {
          const prefix = m.role === 'user' ? 'you' : config.agent.name.toLowerCase();
          console.log(`${DIM}${prefix}: ${m.content}${RESET}`);
        }
        rl.prompt();
        return;
      }

      if (input === '/clear') {
        history.length = 1;
        log('History cleared (system prompt preserved).');
        rl.prompt();
        return;
      }

      const safetyCheck = safety.check(input);
      if (!safetyCheck.allowed) {
        warn(`Blocked: ${safetyCheck.reason}`);
        rl.prompt();
        return;
      }

      history.push({ role: 'user', content: input });
      conversations.addMessage(conversationId, 'user', input);

      process.stdout.write(`${PURPLE}${config.agent.name.toLowerCase()} ▸${RESET} `);

      try {
        let fullResponse = '';
        for await (const chunk of router.stream(history)) {
          process.stdout.write(chunk.content);
          fullResponse += chunk.content;
        }
        console.log('');

        history.push({ role: 'assistant', content: fullResponse });
        conversations.addMessage(conversationId, 'assistant', fullResponse);
      } catch (err) {
        console.log('');
        error(`LLM error: ${err instanceof Error ? err.message : String(err)}`);
      }

      rl.prompt();
    });

    rl.on('close', () => {
      db.close();
      process.exit(0);
    });
  });
