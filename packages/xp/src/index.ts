/**
 * @dors/xp — XP engine, level calculator, capability checker
 *
 * Leveling system inspired by classic MMORPG exp curves.
 * Integrates with Tokscale for AI usage tracking.
 * Three Laws governance gates capability unlocks.
 */

export { XPEngine } from './engine.js';
export { LevelCalculator, xpRequired, totalXpForLevel } from './levels.js';
export { CapabilityChecker, type Capability, type CapabilityLevel } from './capabilities.js';
export { TokscaleBridge } from './tokscale.js';
export type { XPRecord, LevelInfo, XPSource } from './types.js';
