export interface PluginContext {
  agentName: string;
  send(message: string): Promise<void>;
  onMessage(handler: (message: PluginMessage) => Promise<string | void>): void;
  log(level: "debug" | "info" | "warn" | "error", message: string): void;
  getConfig<T = unknown>(key: string): T | undefined;
}

export interface PluginMessage {
  source: string;
  channel: string;
  author: string;
  content: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  homepage?: string;
  configSchema?: Record<string, PluginConfigField>;
}

export interface PluginConfigField {
  type: "string" | "number" | "boolean";
  description: string;
  required?: boolean;
  default?: string | number | boolean;
}

export interface DorsPlugin {
  manifest: PluginManifest;
  activate(ctx: PluginContext): Promise<void>;
  deactivate?(): Promise<void>;
}

export function definePlugin(plugin: DorsPlugin): DorsPlugin {
  return plugin;
}

export class PluginLoader {
  private plugins = new Map<string, DorsPlugin>();

  async load(plugin: DorsPlugin, ctx: PluginContext): Promise<void> {
    if (this.plugins.has(plugin.manifest.name)) {
      throw new Error(`Plugin "${plugin.manifest.name}" is already loaded`);
    }

    await plugin.activate(ctx);
    this.plugins.set(plugin.manifest.name, plugin);
  }

  async unload(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) return;

    if (plugin.deactivate) {
      await plugin.deactivate();
    }
    this.plugins.delete(name);
  }

  async unloadAll(): Promise<void> {
    for (const [name] of this.plugins) {
      await this.unload(name);
    }
  }

  list(): PluginManifest[] {
    return [...this.plugins.values()].map((p) => p.manifest);
  }
}
