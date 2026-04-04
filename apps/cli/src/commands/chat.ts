import { Command } from 'commander';
import { createDorsAgent } from '@dors/agent';
import { startChat, renderInfo } from '@dors/tui';

export const chatCommand = new Command('chat')
  .description('Start interactive chat with DORS')
  .option('-p, --persona <name>', 'Persona to use (dors, oracle, companion)', 'dors')
  .option('-m, --model <name>', 'Model to use')
  .action(async (_opts) => {
    try {
      const agent = createDorsAgent();
      const name = agent.config.identity.name;

      await startChat({
        name,
        processMessage: (input) => agent.loop.processMessage(input),
        onCommand: async (command, _args) => {
          switch (command) {
            case 'clear':
              agent.loop.getContext().clear();
              return renderInfo('Conversation cleared.');
            case 'persona':
              return renderInfo(`Persona switching not yet implemented. Current: ${agent.config.identity.persona}`);
            case 'model':
              return renderInfo(`Model switching not yet implemented. Current: ${agent.config.llm.model}`);
            case 'memory': {
              const memories = agent.memory.list();
              if (memories.length === 0) return renderInfo('No memories stored.');
              return memories.map((m) => `  ${m.key}: ${m.value}`).join('\n');
            }
            default:
              return renderInfo(`Unknown command: /${command}`);
          }
        },
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`Error starting chat: ${msg}`);
      process.exit(1);
    }
  });
