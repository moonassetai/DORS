import { Command } from 'commander';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { renderInfo, renderError } from '@dors/tui';

export const configCommand = new Command('config')
  .description('View or edit DORS configuration')
  .option('--path', 'Show config file path')
  .action((opts) => {
    const configPath = join(homedir(), '.dors', 'config.toml');

    if (opts.path) {
      console.log(configPath);
      return;
    }

    if (!existsSync(configPath)) {
      console.log(renderError('No config found. Run `dors init` first.'));
      process.exit(1);
    }

    const content = readFileSync(configPath, 'utf-8');
    console.log(renderInfo(`Config: ${configPath}\n`));
    console.log(content);
  });
