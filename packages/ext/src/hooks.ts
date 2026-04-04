import type { Message } from '@dors/ai';
import type { Extension } from './types.js';

export class HookRunner {
  private extensions: Extension[] = [];

  register(ext: Extension): void {
    this.extensions.push(ext);
  }

  unregister(name: string): void {
    this.extensions = this.extensions.filter((e) => e.name !== name);
  }

  async runOnMessage(msg: Message): Promise<Message | null> {
    let current: Message | null = msg;
    for (const ext of this.extensions) {
      if (!current) break;
      if (ext.hooks?.onMessage) {
        current = await ext.hooks.onMessage(current);
      }
    }
    return current;
  }

  async runOnResponse(response: string): Promise<string> {
    let current = response;
    for (const ext of this.extensions) {
      if (ext.hooks?.onResponse) {
        current = await ext.hooks.onResponse(current);
      }
    }
    return current;
  }

  async runOnTool(tool: string, args: unknown): Promise<boolean> {
    for (const ext of this.extensions) {
      if (ext.hooks?.onTool) {
        const allowed = await ext.hooks.onTool(tool, args);
        if (!allowed) return false;
      }
    }
    return true;
  }

  async runOnError(error: Error): Promise<void> {
    for (const ext of this.extensions) {
      if (ext.hooks?.onError) {
        await ext.hooks.onError(error);
      }
    }
  }

  getExtensions(): readonly Extension[] {
    return this.extensions;
  }
}
