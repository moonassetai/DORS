import type { ExtensionManifest } from './types.js';

export class ExtensionRegistry {
  private manifests = new Map<string, ExtensionManifest>();

  register(manifest: ExtensionManifest): void {
    this.manifests.set(manifest.name, manifest);
  }

  unregister(name: string): boolean {
    return this.manifests.delete(name);
  }

  get(name: string): ExtensionManifest | undefined {
    return this.manifests.get(name);
  }

  list(): ExtensionManifest[] {
    return Array.from(this.manifests.values());
  }

  has(name: string): boolean {
    return this.manifests.has(name);
  }
}
