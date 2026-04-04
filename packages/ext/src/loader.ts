import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Extension, ExtensionManifest } from './types.js';
import { ExtensionRegistry } from './registry.js';
import { HookRunner } from './hooks.js';

export class ExtensionLoader {
  private registry: ExtensionRegistry;
  private hooks: HookRunner;
  private loaded = new Map<string, Extension>();

  constructor() {
    this.registry = new ExtensionRegistry();
    this.hooks = new HookRunner();
  }

  async loadFromPath(extensionPath: string): Promise<Extension> {
    const manifestPath = join(extensionPath, 'package.json');

    if (!existsSync(manifestPath)) {
      throw new Error(`No package.json found at ${extensionPath}`);
    }

    const manifestContent = readFileSync(manifestPath, 'utf-8');
    const pkg = JSON.parse(manifestContent);

    const manifest: ExtensionManifest = {
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      author: pkg.author,
      main: pkg.main ?? 'dist/index.js',
    };

    const mainPath = join(extensionPath, manifest.main);
    const module = await import(mainPath);
    const ext: Extension = module.default ?? module;

    this.registry.register(manifest);
    this.hooks.register(ext);
    this.loaded.set(manifest.name, ext);

    await ext.activate();

    return ext;
  }

  async unload(name: string): Promise<void> {
    const ext = this.loaded.get(name);
    if (ext) {
      await ext.deactivate();
      this.hooks.unregister(name);
      this.registry.unregister(name);
      this.loaded.delete(name);
    }
  }

  getRegistry(): ExtensionRegistry {
    return this.registry;
  }

  getHooks(): HookRunner {
    return this.hooks;
  }

  getLoaded(): Map<string, Extension> {
    return new Map(this.loaded);
  }
}
