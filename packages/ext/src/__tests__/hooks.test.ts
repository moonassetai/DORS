import { describe, it, expect, vi } from 'vitest';
import { HookRunner } from '../hooks.js';
import type { Extension } from '../types.js';

function createTestExtension(name: string, hooks?: Extension['hooks']): Extension {
  return {
    name,
    version: '1.0.0',
    hooks,
    activate: vi.fn().mockResolvedValue(undefined),
    deactivate: vi.fn().mockResolvedValue(undefined),
  };
}

describe('HookRunner', () => {
  it('should run onMessage hooks in order', async () => {
    const runner = new HookRunner();
    const ext = createTestExtension('test', {
      onMessage: vi.fn().mockResolvedValue({ role: 'user', content: 'modified' }),
    });

    runner.register(ext);
    const result = await runner.runOnMessage({ role: 'user', content: 'original' });
    expect(result?.content).toBe('modified');
  });

  it('should stop processing when onMessage returns null', async () => {
    const runner = new HookRunner();
    const ext1 = createTestExtension('ext1', {
      onMessage: vi.fn().mockResolvedValue(null),
    });
    const ext2 = createTestExtension('ext2', {
      onMessage: vi.fn().mockResolvedValue({ role: 'user', content: 'never called' }),
    });

    runner.register(ext1);
    runner.register(ext2);
    const result = await runner.runOnMessage({ role: 'user', content: 'test' });
    expect(result).toBeNull();
    expect(ext2.hooks!.onMessage).not.toHaveBeenCalled();
  });

  it('should run onTool and return false if any extension blocks', async () => {
    const runner = new HookRunner();
    const ext = createTestExtension('blocker', {
      onTool: vi.fn().mockResolvedValue(false),
    });

    runner.register(ext);
    const allowed = await runner.runOnTool('bash', { command: 'rm -rf /' });
    expect(allowed).toBe(false);
  });

  it('should allow tools when no hooks block', async () => {
    const runner = new HookRunner();
    const ext = createTestExtension('permissive', {
      onTool: vi.fn().mockResolvedValue(true),
    });

    runner.register(ext);
    const allowed = await runner.runOnTool('read', { path: '/tmp/test' });
    expect(allowed).toBe(true);
  });

  it('should unregister extensions', () => {
    const runner = new HookRunner();
    runner.register(createTestExtension('test'));
    expect(runner.getExtensions()).toHaveLength(1);
    runner.unregister('test');
    expect(runner.getExtensions()).toHaveLength(0);
  });
});
