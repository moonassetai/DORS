import { Command } from 'commander';
import { createDorsAgent } from '@dors/agent';
import { startChat, renderInfo, renderError } from '@dors/tui';

const OLLAMA_HOST = process.env.OLLAMA_HOST ?? 'http://localhost:11434';

async function checkOllama(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, {
      signal: AbortSignal.timeout(2000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function getOllamaModels(): Promise<string[]> {
  try {
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, {
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { models?: Array<{ name: string }> };
    return data.models?.map((m) => m.name) ?? [];
  } catch {
    return [];
  }
}

export const chatCommand = new Command('chat')
  .description('Start interactive chat with DORS')
  .option('-p, --persona <name>', 'Persona to use (dors, oracle, companion)', 'dors')
  .option('-m, --model <name>', 'Model to use')
  .action(async (opts) => {
    try {
      const agent = createDorsAgent();
      const config = agent.config;

      if (config.llm.provider === 'ollama') {
        const available = await checkOllama();
        if (!available) {
          console.error(renderError(
            `Ollama is not reachable at ${OLLAMA_HOST}. DORS needs Ollama for local AI.\n\n` +
            '  Install:    https://ollama.com\n' +
            '  Start:      ollama serve\n' +
            '  Custom URL: OLLAMA_HOST=http://host:port dors chat\n',
          ));
          process.exit(1);
        }

        const models = await getOllamaModels();
        const targetModel = opts.model ?? config.llm.model;
        const targetFamily = targetModel.split(':')[0];
        const hasModel = models.some((m) => m.split(':')[0] === targetFamily);
        if (!hasModel && models.length === 0) {
          console.log(renderInfo(
            `No models installed. Run: ollama pull ${targetModel}\n`,
          ));
        } else if (!hasModel) {
          console.log(renderInfo(
            `Model "${targetModel}" not found. Available: ${models.join(', ')}\n` +
            `  Pull it: ollama pull ${targetModel}\n`,
          ));
        }
      }

      const name = config.identity.name;

      // Lazy: only create a conversation row when the user actually saves.
      let conversationId: string | null = null;
      let lastSavedIndex = 0;

      await startChat({
        name,
        processMessage: (input) => agent.loop.processMessage(input),
        onCommand: async (command, _args) => {
          switch (command) {
            case 'clear':
              agent.loop.getContext().clear();
              lastSavedIndex = 0;
              return renderInfo('Conversation cleared.');
            case 'persona':
              return renderInfo(`Persona switching not yet implemented. Current: ${config.identity.persona}`);
            case 'model':
              return renderInfo(`Model switching not yet implemented. Current: ${config.llm.model}`);
            case 'memory': {
              const memories = agent.memory.list();
              if (memories.length === 0) return renderInfo('No memories stored.');
              return memories.map((m) => `  ${m.key}: ${m.value}`).join('\n');
            }
            case 'save': {
              const messages = agent.loop.getContext().getMessages();
              if (!conversationId) {
                conversationId = agent.conversations.create(config.identity.persona).id;
              }
              let saved = 0;
              for (let i = lastSavedIndex; i < messages.length; i++) {
                const msg = messages[i];
                if (msg.role === 'system') continue;
                agent.conversations.addMessage(
                  conversationId,
                  msg.role,
                  msg.content,
                  msg.toolCallId,
                );
                saved++;
              }
              lastSavedIndex = messages.length;
              return renderInfo(`Conversation saved (${saved} new messages).`);
            }
            default:
              return renderInfo(`Unknown command: /${command}. Type /help for available commands.`);
          }
        },
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(renderError(`Error starting chat: ${msg}`));
      process.exit(1);
    }
  });
