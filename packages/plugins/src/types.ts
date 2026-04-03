export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  author?: string;
  dors: {
    minVersion: string;
    capabilities?: string[];
    hooks?: string[];
    permissions?: {
      network?: { domains: string[] };
      filesystem?: { paths: string[] };
      env?: string[];
      shell?: boolean;
      database?: 'read' | 'readwrite';
    };
  };
}

export type HookName = 'onMessage' | 'onVoice' | 'onAgentCreate' | 'onSchedule' | 'onToolCall';

export interface PluginContext {
  agentName: string;
  log(level: 'debug' | 'info' | 'warn' | 'error', msg: string): void;
  getConfig<T = unknown>(key: string): T | undefined;
  emit(event: string, data: unknown): void;
}

export interface DorsPlugin {
  manifest: PluginManifest;
  activate(ctx: PluginContext): Promise<void>;
  deactivate?(): Promise<void>;
  hooks?: Partial<Record<HookName, (...args: unknown[]) => Promise<unknown>>>;
}
