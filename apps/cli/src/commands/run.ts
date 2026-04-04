import { Command } from 'commander';
import { HeadlessAgent } from '@dors/agent';
import { renderError } from '@dors/tui';

export const runCommand = new Command('run')
  .description('Run DORS in headless/daemon mode')
  .argument('[prompt]', 'Single prompt to process')
  .action(async (prompt?: string) => {
    try {
      const agent = new HeadlessAgent();

      if (prompt) {
        const response = await agent.send(prompt);
        console.log(response);
        return;
      }

      // Read from stdin
      const chunks: Buffer[] = [];
      for await (const chunk of process.stdin) {
        chunks.push(chunk as Buffer);
      }
      const input = Buffer.concat(chunks).toString('utf-8').trim();

      if (input) {
        const response = await agent.send(input);
        console.log(response);
      } else {
        console.error(renderError('No input provided. Usage: dors run "your prompt" or echo "prompt" | dors run'));
        process.exit(1);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(renderError(msg));
      process.exit(1);
    }
  });
