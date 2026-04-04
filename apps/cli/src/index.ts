import { Command } from 'commander';
import { chatCommand } from './commands/chat.js';
import { initCommand } from './commands/init.js';
import { runCommand } from './commands/run.js';
import { configCommand } from './commands/config.js';

const program = new Command();

program
  .name('dors')
  .description('DORS — Local-first, LLM-agnostic AGI framework')
  .version('0.1.0');

program.addCommand(chatCommand);
program.addCommand(initCommand);
program.addCommand(runCommand);
program.addCommand(configCommand);

// Default to chat if no subcommand given
program.action(() => {
  chatCommand.parseAsync(process.argv.slice(2));
});

program.parse();
