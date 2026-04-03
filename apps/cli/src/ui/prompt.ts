import { select, input, confirm } from '@inquirer/prompts';

const PURPLE = '\x1b[35m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

export function banner() {
  console.log(`
${PURPLE}${BOLD}  ██████╗  ██████╗ ██████╗ ███████╗
  ██╔══██╗██╔═══██╗██╔══██╗██╔════╝
  ██║  ██║██║   ██║██████╔╝███████╗
  ██║  ██║██║   ██║██╔══██╗╚════██║
  ██████╔╝╚██████╔╝██║  ██║███████║
  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝${RESET}
  ${DIM}v0.1.0 — Open-source AGI framework${RESET}
`);
}

export async function promptAgentName(): Promise<string> {
  return input({
    message: 'What should your AI be called?',
    default: 'DORS',
  });
}

export async function promptPersonality(): Promise<string> {
  return select({
    message: 'Choose a personality:',
    choices: [
      {
        name: 'DORS — Sharp, tactical, protective (default)',
        value: 'dors',
      },
      {
        name: 'ORACLE — Analytical, data-driven, precise',
        value: 'oracle',
      },
      {
        name: 'COMPANION — Warm, supportive, encouraging',
        value: 'companion',
      },
      {
        name: 'Custom — Provide your own SOUL.md',
        value: 'custom',
      },
    ],
  });
}

export async function promptCustomSoulPath(): Promise<string> {
  return input({
    message: 'Path to your SOUL.md file:',
  });
}

export async function promptLLMProvider(): Promise<string> {
  return select({
    message: 'Select your LLM provider:',
    choices: [
      {
        name: 'Ollama (local, free — recommended)',
        value: 'ollama',
      },
      {
        name: 'Claude API (Anthropic — bring your own key)',
        value: 'claude',
      },
      {
        name: 'OpenAI API (bring your own key)',
        value: 'openai',
      },
    ],
  });
}

export async function promptOllamaModel(): Promise<string> {
  return input({
    message: 'Ollama model name:',
    default: 'qwen3.5:4b',
  });
}

export async function promptApiKey(provider: string): Promise<string> {
  return input({
    message: `Enter your ${provider} API key:`,
    validate: (v) => (v.length > 0 ? true : 'API key is required'),
  });
}

export async function promptClaudeModel(): Promise<string> {
  return input({
    message: 'Claude model:',
    default: 'claude-sonnet-4-20250514',
  });
}

export async function promptOpenAIModel(): Promise<string> {
  return input({
    message: 'OpenAI model:',
    default: 'gpt-4o-mini',
  });
}

export async function promptEnableVoice(): Promise<boolean> {
  return confirm({
    message: 'Enable voice pipeline? (downloads ~500MB)',
    default: false,
  });
}

export function log(msg: string) {
  console.log(`${PURPLE}▸${RESET} ${msg}`);
}

export function success(msg: string) {
  console.log(`${PURPLE}✓${RESET} ${msg}`);
}

export function warn(msg: string) {
  console.log(`\x1b[33m⚠${RESET} ${msg}`);
}

export function error(msg: string) {
  console.error(`\x1b[31m✗${RESET} ${msg}`);
}
