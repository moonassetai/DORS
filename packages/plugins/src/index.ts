export { PluginLoader } from './loader.js';
export { HookRegistry } from './hooks.js';
export type { PluginManifest, HookName, PluginContext, DorsPlugin } from './types.js';

import type { DorsPlugin } from './types.js';

/**
 * Helper to define a plugin with full type safety.
 */
export function definePlugin(plugin: DorsPlugin): DorsPlugin {
  return plugin;
}
