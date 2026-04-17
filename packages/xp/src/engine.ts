/**
 * XP Engine — main entry point for the leveling system.
 * Coordinates between tokscale data, local XP storage, and capability checking.
 */

import { LevelCalculator } from './levels.js';
import { CapabilityChecker, type CapabilityLevel } from './capabilities.js';
import { TokscaleBridge } from './tokscale.js';
import type { LevelInfo, XPSource } from './types.js';

export class XPEngine {
  private tokscale: TokscaleBridge;
  private localXP: number = 0;

  constructor() {
    this.tokscale = new TokscaleBridge();
  }

  /** Get combined XP from all sources */
  async getTotalXP(): Promise<number> {
    const tokscaleXP = await this.tokscale.getTotalXP();
    return tokscaleXP + this.localXP;
  }

  /** Add XP from a local source (DORS interactions, gaming, etc.) */
  addLocalXP(amount: number, _source: XPSource = 'dors_chat'): void {
    this.localXP += amount;
  }

  /** Get full level info */
  async getLevelInfo(): Promise<LevelInfo> {
    const totalXP = await this.getTotalXP();
    const calc = LevelCalculator.fromTotalXP(totalXP);

    return {
      level: calc.level,
      currentXP: calc.currentLevelXP,
      xpForCurrentLevel: calc.currentLevelXP,
      xpForNextLevel: calc.xpToNext,
      progressPercent: calc.progressPercent,
      totalXP,
    };
  }

  /** Check if a capability is unlocked at current level */
  async canUse(capability: CapabilityLevel): Promise<boolean> {
    const info = await this.getLevelInfo();
    const checker = new CapabilityChecker(info.level);
    return checker.canUse(capability);
  }

  /** Get capability checker for current level */
  async getCapabilities(): Promise<CapabilityChecker> {
    const info = await this.getLevelInfo();
    return new CapabilityChecker(info.level);
  }

  /** Render TUI status line */
  async renderStatusLine(agentName: string = 'DORS'): Promise<string> {
    const info = await this.getLevelInfo();
    const bar = LevelCalculator.renderBar(info.progressPercent);
    const checker = new CapabilityChecker(info.level);
    const next = checker.nextUnlock();

    const lines = [
      `[${agentName}] Level ${info.level} ${bar} ${info.currentXP.toLocaleString()}/${info.xpForNextLevel.toLocaleString()} XP to next`,
    ];

    if (next) {
      lines.push(`  Next unlock: ${next.name} (Level ${next.requiredLevel})`);
    }

    lines.push(`  Total XP: ${info.totalXP.toLocaleString()}`);

    return lines.join('\n');
  }
}
