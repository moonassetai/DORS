import type { SafetyCheck } from './types.js';

const VALID_CAPABILITIES = new Set(['network', 'filesystem', 'shell', 'database', 'env']);

export class CapabilitySandbox {
  private allowed: Set<string>;

  constructor(allowedCapabilities: string[]) {
    this.allowed = new Set(
      allowedCapabilities.filter((cap) => VALID_CAPABILITIES.has(cap))
    );
  }

  check(capability: string): boolean {
    return this.allowed.has(capability);
  }

  request(capability: string, context: string): SafetyCheck {
    if (!VALID_CAPABILITIES.has(capability)) {
      return {
        allowed: false,
        reason: `Unknown capability: ${capability}. Valid capabilities: ${[...VALID_CAPABILITIES].join(', ')}`,
      };
    }

    if (this.allowed.has(capability)) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: `Capability "${capability}" is not permitted. Context: ${context}`,
      category: 'capability_denied',
    };
  }
}
