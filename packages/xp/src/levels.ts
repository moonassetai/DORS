/**
 * Level calculator using exponential exp curves.
 *
 * Formula: xp_required(level) = floor(100 * 1.18 ^ level)
 *
 * Inspired by classic MMORPG progression:
 * - Level 1-10: fast (Maple Island / tutorial zone)
 * - Level 11-30: steady grind (Victoria Island / mid-game)
 * - Level 31-70: serious commitment (4th continent / endgame)
 * - Level 71+: legendary (post-cap content)
 */

const BASE_XP = 100;
const GROWTH_RATE = 1.18;
const MAX_LEVEL = 200;

/** XP required to advance FROM this level to the next */
export function xpRequired(level: number): number {
  if (level < 1) return 0;
  if (level > MAX_LEVEL) return Infinity;
  return Math.floor(BASE_XP * Math.pow(GROWTH_RATE, level));
}

/** Total cumulative XP needed to reach a given level */
export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += xpRequired(i);
  }
  return total;
}

export class LevelCalculator {
  /** Calculate level info from total XP */
  static fromTotalXP(totalXP: number): {
    level: number;
    currentLevelXP: number;
    xpToNext: number;
    progressPercent: number;
  } {
    let level = 1;
    let remaining = totalXP;

    while (level < MAX_LEVEL) {
      const needed = xpRequired(level);
      if (remaining < needed) break;
      remaining -= needed;
      level++;
    }

    const xpToNext = xpRequired(level);
    const progressPercent = xpToNext > 0
      ? Math.min(100, Math.floor((remaining / xpToNext) * 100))
      : 100;

    return {
      level,
      currentLevelXP: remaining,
      xpToNext,
      progressPercent,
    };
  }

  /** Generate XP bar string for TUI display */
  static renderBar(progressPercent: number, width: number = 15): string {
    const filled = Math.floor((progressPercent / 100) * width);
    const empty = width - filled;
    return '\u2588'.repeat(filled) + '\u2591'.repeat(empty);
  }
}
