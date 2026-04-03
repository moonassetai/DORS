export type SafetyLevel = 'permissive' | 'standard' | 'strict';

export interface SafetyConfig {
  level: SafetyLevel;
  threeLaws: boolean;
  blockedCategories: string[];
  allowedCapabilities: string[];
}

export interface SafetyCheck {
  allowed: boolean;
  reason?: string;
  category?: string;
}

export interface SafetyLog {
  timestamp: number;
  input: string;
  result: SafetyCheck;
  action: string;
}
