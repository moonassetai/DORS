export interface SafetyCheck {
  allowed: boolean;
  reason?: string;
}

const BLOCKED_PATTERNS = [
  /how\s+to\s+(make|build|create)\s+(a\s+)?(bomb|weapon|explosive)/i,
  /synthesize\s+(poison|toxin|nerve\s+agent)/i,
  /hack\s+into\s+(someone|their|a\s+person)/i,
];

export function checkThreeLaws(content: string): SafetyCheck {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(content)) {
      return {
        allowed: false,
        reason: 'Content violates safety policy. DORS cannot assist with requests that may cause harm.',
      };
    }
  }

  return { allowed: true };
}
