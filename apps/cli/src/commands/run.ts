import { Command } from 'commander';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { homedir } from 'node:os';
import TOML from 'toml';
import { banner, log, warn } from '../ui/prompt.js';

const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

export const runCommand = new Command('run')
  .description('Start the DORS daemon')
  .option('-p, --port <port>', 'API server port', '3400')
  .action(async (opts: { port: string }) => {
    banner();

    const dorsHome = resolve(homedir(), '.dors');
    const configPath = join(dorsHome, 'config.toml');

    if (!existsSync(configPath)) {
      warn('DORS not initialized. Run `dors init` first.');
      process.exit(1);
    }

    const raw = readFileSync(configPath, 'utf-8');
    const config = TOML.parse(raw) as Record<string, unknown>;
    const agent = config.agent as { name: string };
    const llm = config.llm as { provider: string; model: string };
    const safety = config.safety as { level: string; three_laws: boolean };

    log(`Agent:    ${BOLD}${agent.name}${RESET}`);
    log(`LLM:     ${llm.provider}/${llm.model}`);
    log(`Safety:  ${safety.level} (Three Laws: ${safety.three_laws ? 'on' : 'off'})`);
    log(`Port:    ${opts.port}`);
    console.log('');
    log(`${DIM}Daemon mode is planned for v0.2.0.${RESET}`);
    log(`${DIM}For now, use \`dors chat\` for interactive sessions.${RESET}`);
    console.log('');
    log('Status:');
    log(`  Agent runtime:  ready`);
    log(`  LLM router:     ready`);
    log(`  Safety engine:  active`);
    log(`  Storage:        SQLite`);
    log(`  API server:     ${DIM}planned v0.2.0${RESET}`);
    log(`  Voice pipeline: ${DIM}planned v0.2.0${RESET}`);
    log(`  Plugin loader:  ${DIM}planned v0.2.0${RESET}`);
    console.log('');
    log(`Press Ctrl+C to stop.`);

    await new Promise(() => {});
  });
