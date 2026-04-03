import type { DorsPlugin, PluginContext, PluginManifest, HookName } from './types.js';
import { HookRegistry } from './hooks.js';

interface LoadedPlugin {
  plugin: DorsPlugin;
  ctx: PluginContext;
}

export class PluginLoader {
  private plugins: Map<string, LoadedPlugin> = new Map();
  private registry: HookRegistry = new HookRegistry();

  async load(plugin: DorsPlugin, ctx: PluginContext): Promise<void> {
    const name = plugin.manifest.name;

    if (this.plugins.has(name)) {
      throw new Error(`Plugin "${name}" is already loaded`);
    }

    // Register hooks before activation
    if (plugin.hooks) {
      for (const [hookName, handler] of Object.entries(plugin.hooks)) {
        if (handler) {
          this.registry.register(name, hookName as HookName, handler);
        }
      }
    }

    // Activate the plugin
    await plugin.activate(ctx);

    this.plugins.set(name, { plugin, ctx });
  }

  async unload(name: string): Promise<void> {
    const loaded = this.plugins.get(name);
    if (!loaded) {
      throw new Error(`Plugin "${name}" is not loaded`);
    }

    // Call deactivate if available
    if (loaded.plugin.deactivate) {
      await loaded.plugin.deactivate();
    }

    // Remove hooks
    this.registry.unregister(name);

    this.plugins.delete(name);
  }

  async unloadAll(): Promise<void> {
    const names = [...this.plugins.keys()];
    for (const name of names) {
      await this.unload(name);
    }
  }

  list(): PluginManifest[] {
    return [...this.plugins.values()].map((lp) => lp.plugin.manifest);
  }

  getHooks(hookName: HookName): ((...args: unknown[]) => Promise<unknown>)[] {
    return this.registry.getHandlers(hookName);
  }

  async executeHook(hookName: HookName, ...args: unknown[]): Promise<unknown[]> {
    return this.registry.execute(hookName, ...args);
  }
}
