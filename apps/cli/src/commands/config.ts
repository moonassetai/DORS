import { Command } from 'commander';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { homedir } from 'node:os';
import TOML from 'toml';
import { log, error } from '../ui/prompt.js';

const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

export const configCommand = new Command('config')
  .description('View or edit DORS configuration')
  .option('--path', 'Show config file path')
  .option('--raw', 'Show raw TOML')
  .action(async (opts: { path?: boolean; raw?: boolean }) => {
    const dorsHome = resolve(homedir(), '.dors');
    const configPath = join(dorsHome, 'config.toml');

    if (!existsSync(configPath)) {
      error('DORS not initialized. Run `dors init` first.');
      process.exit(1);
    }

    if (opts.path) {
      console.log(configPath);
      return;
    }

    const raw = readFileSync(configPath, 'utf-8');

    if (opts.raw) {
      console.log(raw);
      return;
    }

    const config = TOML.parse(raw) as Record<string, unknown>;
    const agent = config.agent as { name: string; persona: string };
    const llm = config.llm as { provider: string; model: string; api_key?: string };
    const storage = config.storage as { driver: string; path: string };
    const safety = config.safety as { level: string; three_laws: boolean };
    const voice = config.voice as { enabled: boolean; stt: string; tts: string };

    console.log('');
    console.log(`${BOLD}DORS Configuration${RESET}`);
    console.log(`${DIM}${configPath}${RESET}`);
    console.log('');
    console.log(`${BOLD}Agent${RESET}`);
    log(`Name:      ${agent.name}`);
    log(`Persona:   ${agent.persona}`);
    console.log('');
    console.log(`${BOLD}LLM${RESET}`);
    log(`Provider:  ${llm.provider}`);
    log(`Model:     ${llm.model}`);
    log(`API Key:   ${llm.api_key ? '***' + llm.api_key.slice(-4) : 'not set'}`);
    console.log('');
    console.log(`${BOLD}Storage${RESET}`);
    log(`Driver:    ${storage.driver}`);
    log(`Path:      ${storage.path}`);
    console.log('');
    console.log(`${BOLD}Safety${RESET}`);
    log(`Level:     ${safety.level}`);
    log(`Three Laws: ${safety.three_laws ? 'enabled' : 'disabled'}`);
    console.log('');
    console.log(`${BOLD}Voice${RESET}`);
    log(`Enabled:   ${voice?.enabled ?? false}`);
    log(`STT:       ${voice?.stt ?? 'whisper'}`);
    log(`TTS:       ${voice?.tts ?? 'piper'}`);
    console.log('');
    console.log(`${DIM}Edit: ${configPath}${RESET}`);
    console.log('');
  });
