import type { Message } from '@dors/ai';
import type { Tool } from '@dors/core';

export interface ExtensionManifest {
  name: string;
  version: string;
  description?: string;
  author?: string;
  main: string;
}

export interface Extension {
  name: string;
  version: string;
  hooks?: {
    onMessage?: (msg: Message) => Promise<Message | null>;
    onResponse?: (response: string) => Promise<string>;
    onTool?: (tool: string, args: unknown) => Promise<boolean>;
    onError?: (error: Error) => Promise<void>;
  };
  tools?: Tool[];
  activate(): Promise<void>;
  deactivate(): Promise<void>;
}
