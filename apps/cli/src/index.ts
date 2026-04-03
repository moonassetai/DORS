import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { chatCommand } from './commands/chat.js';
import { runCommand } from './commands/run.js';
import { configCommand } from './commands/config.js';

const PURPLE = '\x1b[35m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

const program = new Command();

program
  .name('dors')
  .version('0.1.0')
  .description(
    `${PURPLE}${BOLD}DORS${RESET} — Open-source AGI framework\n${DIM}Born from Asimov, built by MULTIVAC.${RESET}`,
  )
  .addCommand(initCommand)
  .addCommand(chatCommand)
  .addCommand(runCommand)
  .addCommand(configCommand);

program.parse();
