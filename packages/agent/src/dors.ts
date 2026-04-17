import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import {
  OllamaProvider,
  AnthropicProvider,
  OpenAIProvider,
  type LLMProvider,
} from '@dors/ai';
import {
  AgentLoop,
  parseSoulMd,
  createDatabase,
  ConversationStore,
  MemoryStore,
  readTool,
  writeTool,
  editTool,
  bashTool,
  type Persona,
} from '@dors/core';

export interface DorsConfig {
  identity: {
    name: string;
    persona: string;
  };
  llm: {
    provider: string;
    model: string;
    api_key?: string;
    fallback?: {
      provider: string;
      model: string;
      api_key?: string;
    };
  };
  storage: {
    path: string;
  };
  safety: {
    three_laws: boolean;
    allow_shell: boolean;
    allow_network: boolean;
  };
}

const DEFAULT_CONFIG: DorsConfig = {
  identity: { name: 'DORS', persona: 'dors' },
  llm: { provider: 'ollama', model: 'qwen3:14b' },
  storage: { path: join(homedir(), '.dors', 'data', 'dors.db') },
  safety: { three_laws: true, allow_shell: true, allow_network: false },
};

export function loadConfig(configPath?: string): DorsConfig {
  const path = configPath ?? join(homedir(), '.dors', 'config.toml');

  if (!existsSync(path)) {
    return DEFAULT_CONFIG;
  }

  try {
    const _require = createRequire(import.meta.url);
    const toml = _require('toml');
    const content = readFileSync(path, 'utf-8');
    const parsed = toml.parse(content);
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      identity: { ...DEFAULT_CONFIG.identity, ...parsed.identity },
      llm: { ...DEFAULT_CONFIG.llm, ...parsed.llm },
      storage: { ...DEFAULT_CONFIG.storage, ...parsed.storage },
      safety: { ...DEFAULT_CONFIG.safety, ...parsed.safety },
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

function createProvider(type: string, _model: string, apiKey?: string): LLMProvider {
  switch (type) {
    case 'anthropic':
      return new AnthropicProvider(apiKey);
    case 'openai':
      return new OpenAIProvider(apiKey);
    case 'ollama':
    default:
      return new OllamaProvider();
  }
}

const PERSONA_NAME_RE = /^[a-z0-9_-]+$/;

function loadPersona(personaName: string): Persona | undefined {
  if (!PERSONA_NAME_RE.test(personaName)) {
    return undefined;
  }

  const __dirname = dirname(fileURLToPath(import.meta.url));

  // Persona-specific paths take precedence over the home-dir SOUL.md fallback
  // so that `dors chat -p oracle` doesn't silently load `~/.dors/SOUL.md`.
  // The home SOUL.md acts as a fallback for the default persona ("dors") only.
  const paths = [
    join(homedir(), '.dors', 'personas', `${personaName}.soul.md`),
    join(__dirname, '..', '..', '..', 'personas', `${personaName}.soul.md`),
    join(__dirname, '..', 'personas', `${personaName}.soul.md`),
  ];
  if (personaName === 'dors') {
    paths.push(join(homedir(), '.dors', 'SOUL.md'));
    paths.push(join(__dirname, '..', '..', '..', 'SOUL.md'));
  }

  for (const p of paths) {
    if (existsSync(p)) {
      const content = readFileSync(p, 'utf-8');
      return parseSoulMd(content);
    }
  }

  return undefined;
}

export interface DorsAgent {
  loop: AgentLoop;
  conversations: ConversationStore;
  memory: MemoryStore;
  config: DorsConfig;
}

export function createDorsAgent(configPath?: string): DorsAgent {
  const config = loadConfig(configPath);

  const provider = createProvider(config.llm.provider, config.llm.model, config.llm.api_key);
  const fallbackProvider = config.llm.fallback
    ? createProvider(config.llm.fallback.provider, config.llm.fallback.model, config.llm.fallback.api_key)
    : undefined;

  const persona = loadPersona(config.identity.persona);

  const db = createDatabase(config.storage.path.replace('~', homedir()));
  const conversations = new ConversationStore(db);
  const memory = new MemoryStore(db);

  const loop = new AgentLoop({
    provider,
    fallbackProvider,
    persona,
    tools: [readTool, writeTool, editTool, bashTool],
    sandbox: {
      allowShell: config.safety.allow_shell,
      allowNetwork: config.safety.allow_network,
    },
    chatOptions: {
      model: config.llm.model,
    },
  });

  return { loop, conversations, memory, config };
}
