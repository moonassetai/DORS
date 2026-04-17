export interface XPRecord {
  id: number;
  source: XPSource;
  amount: number;
  timestamp: number;
  metadata?: string;
}

export type XPSource =
  | 'tokscale'       // AI agent token usage (Claude Code, OpenCode, etc.)
  | 'dors_chat'      // Direct DORS interactions
  | 'dors_tool'      // DORS tool executions
  | 'gaming'         // multivac.games challenges
  | 'manual';        // Manual XP grants (admin)

export interface LevelInfo {
  level: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
  totalXP: number;
}

export interface AgentClass {
  name: string;
  agent: string;
  focus: string;
  tier: 1 | 2 | 3 | 4;
}
