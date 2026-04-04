import { describe, it, expect } from 'vitest';
import { chatCommand } from '../commands/chat.js';
import { initCommand } from '../commands/init.js';
import { runCommand } from '../commands/run.js';
import { configCommand } from '../commands/config.js';

describe('CLI Commands', () => {
  it('should define chat command', () => {
    expect(chatCommand.name()).toBe('chat');
    expect(chatCommand.description()).toContain('chat');
  });

  it('should define init command', () => {
    expect(initCommand.name()).toBe('init');
    expect(initCommand.description()).toContain('Initialize');
  });

  it('should define run command', () => {
    expect(runCommand.name()).toBe('run');
    expect(runCommand.description()).toContain('headless');
  });

  it('should define config command', () => {
    expect(configCommand.name()).toBe('config');
    expect(configCommand.description()).toContain('configuration');
  });
});
