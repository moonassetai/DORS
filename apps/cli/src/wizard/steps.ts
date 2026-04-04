export async function runWizard(): Promise<void> {
  const { select, input } = await import('@inquirer/prompts');
  const { writeFileSync, mkdirSync, existsSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { homedir } = await import('node:os');
  const { renderSuccess, renderInfo } = await import('@dors/tui');

  const dorsDir = join(homedir(), '.dors');

  if (existsSync(join(dorsDir, 'config.toml'))) {
    console.log(renderInfo('DORS is already initialized. Delete ~/.dors/config.toml to reinitialize.'));
    return;
  }

  console.log('\n  Welcome to DORS setup!\n');

  const provider = await select({
    message: 'Which LLM provider?',
    choices: [
      { name: 'Ollama (local, recommended)', value: 'ollama' },
      { name: 'Anthropic (Claude)', value: 'anthropic' },
      { name: 'OpenAI', value: 'openai' },
    ],
  });

  let model: string;
  let apiKey: string | undefined;

  if (provider === 'ollama') {
    model = await input({
      message: 'Ollama model name:',
      default: 'qwen3:14b',
    });
  } else if (provider === 'anthropic') {
    model = await input({
      message: 'Model name:',
      default: 'claude-sonnet-4-6',
    });
    apiKey = await input({
      message: 'Anthropic API key:',
    });
  } else {
    model = await input({
      message: 'Model name:',
      default: 'gpt-4o',
    });
    apiKey = await input({
      message: 'OpenAI API key:',
    });
  }

  const persona = await select({
    message: 'Choose a persona:',
    choices: [
      { name: 'DORS — Tactical guardian, sharp and protective', value: 'dors' },
      { name: 'ORACLE — Analytical forecaster, data-driven', value: 'oracle' },
      { name: 'COMPANION — Supportive coach, warm and patient', value: 'companion' },
    ],
  });

  // Create directories
  mkdirSync(join(dorsDir, 'data'), { recursive: true });
  mkdirSync(join(dorsDir, 'personas'), { recursive: true });

  // Write config
  let config = `[identity]
name = "${persona.toUpperCase()}"
persona = "${persona}"

[llm]
provider = "${provider}"
model = "${model}"
`;

  if (apiKey) {
    config += `api_key = "${apiKey}"\n`;
  }

  config += `
[storage]
path = "${join(dorsDir, 'data', 'dors.db').replace(/\\/g, '/')}"

[safety]
three_laws = true
allow_shell = true
allow_network = false
`;

  writeFileSync(join(dorsDir, 'config.toml'), config, 'utf-8');
  console.log('\n' + renderSuccess('DORS initialized!'));
  console.log(renderInfo('Run `dors chat` to start chatting.\n'));
}
