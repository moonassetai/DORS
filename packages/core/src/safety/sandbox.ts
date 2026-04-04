export interface SandboxConfig {
  allowShell: boolean;
  allowNetwork: boolean;
  allowFileWrite: boolean;
  allowedPaths?: string[];
}

const DEFAULT_CONFIG: SandboxConfig = {
  allowShell: true,
  allowNetwork: false,
  allowFileWrite: true,
};

export class Sandbox {
  private config: SandboxConfig;

  constructor(config?: Partial<SandboxConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  canExecuteTool(toolName: string): { allowed: boolean; reason?: string } {
    switch (toolName) {
      case 'bash':
        if (!this.config.allowShell) {
          return { allowed: false, reason: 'Shell execution is disabled' };
        }
        break;
      case 'write':
      case 'edit':
        if (!this.config.allowFileWrite) {
          return { allowed: false, reason: 'File writing is disabled' };
        }
        break;
    }
    return { allowed: true };
  }

  isPathAllowed(path: string): boolean {
    if (!this.config.allowedPaths?.length) return true;
    return this.config.allowedPaths.some((allowed) => path.startsWith(allowed));
  }

  getConfig(): Readonly<SandboxConfig> {
    return { ...this.config };
  }
}
