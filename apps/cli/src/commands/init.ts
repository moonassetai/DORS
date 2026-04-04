import { Command } from 'commander';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { renderSuccess, renderInfo } from '@dors/tui';

export const initCommand = new Command('init')
  .description('Initialize DORS configuration')
  .action(async () => {
    try {
      const { runWizard } = await import('../wizard/steps.js');
      await runWizard();
    } catch {
      // Fallback if inquirer not available
      const dorsDir = join(homedir(), '.dors');
      const configPath = join(dorsDir, 'config.toml');
      const dataDir = join(dorsDir, 'data');

      if (existsSync(configPath)) {
        console.log(renderInfo('DORS is already initialized.'));
        return;
      }

      mkdirSync(dataDir, { recursive: true });
      mkdirSync(join(dorsDir, 'personas'), { recursive: true });

      const config = `[identity]
name = "DORS"
persona = "dors"

[llm]
provider = "ollama"
model = "qwen3:14b"

[storage]
path = "${join(dorsDir, 'data', 'dors.db').replace(/\\/g, '/')}"

[safety]
three_laws = true
allow_shell = true
allow_network = false
`;

      writeFileSync(configPath, config, 'utf-8');
      console.log(renderSuccess('DORS initialized at ~/.dors/config.toml'));
      console.log(renderInfo('Run `dors chat` to start chatting.'));
    }
  });
