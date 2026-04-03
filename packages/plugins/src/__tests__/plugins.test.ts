import { describe, it, expect, vi } from 'vitest';
import { PluginLoader } from '../loader.js';
import { HookRegistry } from '../hooks.js';
import type { DorsPlugin, PluginContext } from '../types.js';

function makeContext(agentName: string = 'dors'): PluginContext {
  return {
    agentName,
    log: vi.fn(),
    getConfig: vi.fn(),
    emit: vi.fn(),
  };
}

function makePlugin(overrides: Partial<DorsPlugin> = {}): DorsPlugin {
  return {
    manifest: {
      name: overrides.manifest?.name ?? 'test-plugin',
      version: '1.0.0',
      description: 'A test plugin',
      dors: { minVersion: '0.1.0' },
    },
    activate: overrides.activate ?? vi.fn(async () => {}),
    deactivate: overrides.deactivate ?? vi.fn(async () => {}),
    hooks: overrides.hooks,
  };
}

describe('PluginLoader', () => {
  it('loads a plugin and calls activate', async () => {
    const loader = new PluginLoader();
    const activate = vi.fn(async () => {});
    const plugin = makePlugin({ activate });
    const ctx = makeContext();

    await loader.load(plugin, ctx);

    expect(activate).toHaveBeenCalledWith(ctx);
  });

  it('lists loaded plugins', async () => {
    const loader = new PluginLoader();
    await loader.load(makePlugin(), makeContext());

    const list = loader.list();
    expect(list.length).toBe(1);
    expect(list[0].name).toBe('test-plugin');
  });

  it('prevents loading the same plugin twice', async () => {
    const loader = new PluginLoader();
    await loader.load(makePlugin(), makeContext());

    await expect(loader.load(makePlugin(), makeContext())).rejects.toThrow('already loaded');
  });

  it('unloads a plugin and calls deactivate', async () => {
    const loader = new PluginLoader();
    const deactivate = vi.fn(async () => {});
    const plugin = makePlugin({ deactivate });
    await loader.load(plugin, makeContext());

    await loader.unload('test-plugin');

    expect(deactivate).toHaveBeenCalled();
    expect(loader.list().length).toBe(0);
  });

  it('throws when unloading a non-existent plugin', async () => {
    const loader = new PluginLoader();
    await expect(loader.unload('nope')).rejects.toThrow('not loaded');
  });

  it('unloads all plugins', async () => {
    const loader = new PluginLoader();
    const p1 = makePlugin({ manifest: { name: 'p1', version: '1.0.0', description: '', dors: { minVersion: '0.1.0' } } });
    const p2 = makePlugin({ manifest: { name: 'p2', version: '1.0.0', description: '', dors: { minVersion: '0.1.0' } } });
    await loader.load(p1, makeContext());
    await loader.load(p2, makeContext());

    await loader.unloadAll();
    expect(loader.list().length).toBe(0);
  });

  it('registers and executes hooks', async () => {
    const loader = new PluginLoader();
    const hookFn = vi.fn(async (msg: unknown) => `processed: ${msg}`);
    const plugin = makePlugin({
      hooks: { onMessage: hookFn },
    });
    await loader.load(plugin, makeContext());

    const hooks = loader.getHooks('onMessage');
    expect(hooks.length).toBe(1);

    const results = await loader.executeHook('onMessage', 'hello');
    expect(results).toEqual(['processed: hello']);
  });

  it('removes hooks on unload', async () => {
    const loader = new PluginLoader();
    const hookFn = vi.fn(async () => 'result');
    const plugin = makePlugin({ hooks: { onMessage: hookFn } });
    await loader.load(plugin, makeContext());

    await loader.unload('test-plugin');
    expect(loader.getHooks('onMessage').length).toBe(0);
  });
});

describe('HookRegistry', () => {
  it('registers and retrieves handlers', () => {
    const registry = new HookRegistry();
    const handler = vi.fn(async () => 'ok');
    registry.register('test', 'onMessage', handler);

    const handlers = registry.getHandlers('onMessage');
    expect(handlers.length).toBe(1);
    expect(handlers[0]).toBe(handler);
  });

  it('executes all handlers for a hook in order', async () => {
    const registry = new HookRegistry();
    const results: number[] = [];
    registry.register('p1', 'onMessage', async () => { results.push(1); return 1; });
    registry.register('p2', 'onMessage', async () => { results.push(2); return 2; });

    const output = await registry.execute('onMessage', 'test');
    expect(results).toEqual([1, 2]);
    expect(output).toEqual([1, 2]);
  });

  it('unregisters all hooks for a plugin', () => {
    const registry = new HookRegistry();
    registry.register('p1', 'onMessage', async () => 'a');
    registry.register('p1', 'onVoice', async () => 'b');
    registry.register('p2', 'onMessage', async () => 'c');

    registry.unregister('p1');

    expect(registry.getHandlers('onMessage').length).toBe(1);
    expect(registry.getHandlers('onVoice').length).toBe(0);
  });

  it('returns empty array for unregistered hooks', () => {
    const registry = new HookRegistry();
    expect(registry.getHandlers('onSchedule')).toEqual([]);
  });

  it('execute returns empty for no handlers', async () => {
    const registry = new HookRegistry();
    const result = await registry.execute('onToolCall');
    expect(result).toEqual([]);
  });
});
