import { createInterface } from 'node:readline';
import type { StreamChunk } from '@dors/ai';
import { renderUserPrompt, renderAssistantPrefix, renderWelcome, renderHelp, renderError, renderInfo } from './renderer.js';
import { Spinner } from './spinner.js';

export interface ChatConfig {
  name: string;
  processMessage: (input: string) => AsyncIterable<StreamChunk>;
  onCommand?: (command: string, args: string) => Promise<string | null>;
}

export async function startChat(config: ChatConfig): Promise<void> {
  const { name, processMessage, onCommand } = config;

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  process.stdout.write(renderWelcome(name));

  const prompt = (): void => {
    rl.question(renderUserPrompt(), async (input) => {
      const trimmed = input.trim();

      if (!trimmed) {
        prompt();
        return;
      }

      // Handle commands
      if (trimmed.startsWith('/')) {
        const [command, ...argParts] = trimmed.slice(1).split(' ');
        const args = argParts.join(' ');

        if (command === 'quit' || command === 'exit') {
          process.stdout.write(renderInfo('Goodbye.\n'));
          rl.close();
          process.exit(0);
        }

        if (command === 'help') {
          process.stdout.write(renderHelp());
          prompt();
          return;
        }

        if (onCommand) {
          const result = await onCommand(command, args);
          if (result) {
            process.stdout.write(result + '\n');
          }
        }
        prompt();
        return;
      }

      // Process message through agent
      const spinner = new Spinner();
      spinner.start();

      let started = false;

      try {
        for await (const chunk of processMessage(trimmed)) {
          if (chunk.type === 'text' && chunk.content) {
            if (!started) {
              spinner.stop();
              process.stdout.write(renderAssistantPrefix(name));
              started = true;
            }
            process.stdout.write(chunk.content);
          }

          if (chunk.type === 'error') {
            spinner.stop();
            process.stdout.write(renderError(chunk.error ?? 'Unknown error') + '\n');
            break;
          }
        }

        if (started) {
          // Re-render with markdown formatting
          process.stdout.write('\n\n');
        } else {
          spinner.stop();
        }
      } catch (error) {
        spinner.stop();
        const msg = error instanceof Error ? error.message : String(error);
        process.stdout.write(renderError(msg) + '\n');
      }

      prompt();
    });
  };

  prompt();

  rl.on('close', () => {
    process.exit(0);
  });
}
