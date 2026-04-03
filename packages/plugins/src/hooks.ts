import type { HookName } from './types.js';

type HookHandler = (...args: unknown[]) => Promise<unknown>;

interface RegisteredHook {
  pluginName: string;
  handler: HookHandler;
}

export class HookRegistry {
  private hooks: Map<HookName, RegisteredHook[]> = new Map();

  register(pluginName: string, hookName: HookName, handler: HookHandler): void {
    const existing = this.hooks.get(hookName) ?? [];
    existing.push({ pluginName, handler });
    this.hooks.set(hookName, existing);
  }

  unregister(pluginName: string): void {
    for (const [hookName, handlers] of this.hooks.entries()) {
      const filtered = handlers.filter((h) => h.pluginName !== pluginName);
      if (filtered.length === 0) {
        this.hooks.delete(hookName);
      } else {
        this.hooks.set(hookName, filtered);
      }
    }
  }

  getHandlers(hookName: HookName): HookHandler[] {
    const registered = this.hooks.get(hookName) ?? [];
    return registered.map((r) => r.handler);
  }

  async execute(hookName: HookName, ...args: unknown[]): Promise<unknown[]> {
    const handlers = this.getHandlers(hookName);
    const results: unknown[] = [];
    for (const handler of handlers) {
      const result = await handler(...args);
      results.push(result);
    }
    return results;
  }
}
