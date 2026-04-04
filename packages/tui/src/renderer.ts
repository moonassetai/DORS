import chalk from 'chalk';
import { Marked } from 'marked';
import TerminalRenderer from 'marked-terminal';

const marked = new Marked(TerminalRenderer as object);

export function renderMarkdown(text: string): string {
  return marked.parse(text) as string;
}

export function renderUserPrompt(): string {
  return chalk.bold.magenta('you > ');
}

export function renderAssistantPrefix(name: string): string {
  return chalk.bold.cyan(`${name} > `);
}

export function renderError(message: string): string {
  return chalk.bold.red(`✗ ${message}`);
}

export function renderInfo(message: string): string {
  return chalk.dim(`ℹ ${message}`);
}

export function renderSuccess(message: string): string {
  return chalk.green(`✓ ${message}`);
}

export function renderWelcome(name: string): string {
  const lines = [
    '',
    chalk.bold.magenta(`  ◆ ${name} v0.1.0`),
    chalk.dim('  Local-first AGI framework'),
    chalk.dim('  Type /help for commands, /quit to exit'),
    '',
  ];
  return lines.join('\n');
}

export function renderHelp(): string {
  const commands = [
    ['/help', 'Show this help message'],
    ['/clear', 'Clear conversation history'],
    ['/persona <name>', 'Switch persona (dors, oracle, companion)'],
    ['/model <name>', 'Switch model'],
    ['/memory', 'List stored memories'],
    ['/quit', 'Exit DORS'],
  ];

  const lines = [chalk.bold('\nAvailable commands:\n')];
  for (const [cmd, desc] of commands) {
    lines.push(`  ${chalk.cyan(cmd.padEnd(20))} ${chalk.dim(desc)}`);
  }
  lines.push('');
  return lines.join('\n');
}
