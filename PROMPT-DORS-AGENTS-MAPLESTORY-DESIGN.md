# MapleStory Classic for AI by MULTIVAC

> Asimov agents become playable characters. Tokens bridge gaming and real-world AI.
> Three Laws are the game physics. DORS is the engine. MapleStory is the soul.

---

## Concept

15 Asimov-named AI agents with MapleStory character classes, skill trees, and
exponential leveling curves. XP earned through AI usage unlocks real capabilities.
Gaming earns tokens. Tokens unlock DORS powers. The AI agent bridges game and reality.

**Three surfaces. One token system. One identity.**

---

## Asimov World: Three Continents

### Foundation (Victoria Island equivalent)

The starting continent. Strategy, planning, prediction.

| Zone | Theme | Agents Active |
|------|-------|--------------|
| Terminus | Beginner area, tutorials | NOVI, ARKADY |
| Trantor | Capital city, architecture hub | HARI, SELDON |
| Streeling | University district, research | PELORAT, BLISS |

### Robot (Ossyria equivalent)

The engineering continent. Code, systems, building.

| Zone | Theme | Agents Active |
|------|-------|--------------|
| Aurora | Robotics labs, core engineering | DANEEL, GISKARD |
| Solaria | Isolated design workshops | GLADIA, FASTOLFE |
| Earth (Caves of Steel) | Investigation, product discovery | BALEY |

### Empire (Masteria equivalent)

The governance continent. QA, security, operations.

| Zone | Theme | Agents Active |
|------|-------|--------------|
| Kalgan | Testing arena, trial by combat | TREVIZE, DEMERZEL |
| Star's End | Security fortress, threat detection | WANDA |
| Gaia | Unified consciousness, fleet coordination | BLISS |

---

## Agent Classes

Five MapleStory archetypes mapped to Asimov agents.

| MapleStory Class | Agent | DORS Role | Skill Tree Focus |
|-----------------|-------|-----------|------------------|
| **Warrior** | DANEEL | Core Engineer | Code execution, system operations, brute-force problem solving |
| **Magician** | SELDON | CTO / Architect | Planning, prediction, strategic reasoning, pattern recognition |
| **Bowman** | GLADIA | UX / Design | Precision tools, visual analysis, long-range design critique |
| **Thief** | BALEY | Head of Product | Investigation, user research, stealth operations, data gathering |
| **Pirate** | FASTOLFE | Extension Engineer | Plugin trading, extension marketplace, tool commerce |

> Adapted from original design (CALVIN as Bowman, MALLOW as Pirate) to fit the
> 15-agent roster. Remaining agents affiliate by role: HARI/BLISS align Magician,
> GISKARD/DEMERZEL align Warrior, TREVIZE/PELORAT align Bowman, WANDA aligns Thief,
> NOVI/ARKADY align Pirate.

---

## XP System

### Tokscale Integration

XP is powered by Tokscale — every token consumed across AI coding agents feeds
into the DORS level system. No separate tracking. Your real AI usage IS your XP.

**XP source:** Read `~/.claude/projects/` directly (same data Tokscale uses).
**Mapping:** 100 tokens = 1 XP (tunable). At ~500K tokens/day = ~5,000 XP/day.
**Fallback:** If no AI usage data found, DORS starts at Level 1. Each chat turn = 10 XP.
**Storage:** `bun:sqlite` — tables: `user_xp`, `user_level`, `capability_grants`, `xp_history`.

### Exponential Curves (MapleStory-inspired)

```
xp_required(level) = floor(100 * 1.18 ^ level)
```

| Level | XP Required | Cumulative XP | Days at 5K XP/day |
|-------|------------|---------------|-------------------|
| 1 | 100 | 100 | <1 |
| 5 | 229 | 814 | <1 |
| 10 | 523 | 2,714 | <1 |
| 15 | 1,196 | 7,710 | ~1.5 |
| 20 | 2,731 | 20,319 | ~4 |
| 30 | 14,249 | 107,485 | ~21 |
| 50 | 388,118 | 2,048,567 | ~410 |

Early levels fast, late levels grind. Constants tuned after MapleStory v0.xx research.
If curve changes, levels recompute from raw XP history (never delete history rows).

---

## Capability Gating by Level

Three Laws governance gates every unlock. Higher risk = higher level required.

| Level | Capability | Governance | User Sees |
|-------|-----------|-----------|-----------|
| 1 | Basic chat | None | No prompt |
| 5 | Read local files | First Law check | "Allow DORS to read [path]? [y/n]" |
| 10 | Draft emails, documents | Preview required | Draft shown, never auto-sent |
| 15 | Execute shell commands | Explicit confirm | Command preview, requires y |
| 20 | Send emails | Full preview | Email shown, explicit confirm |
| 30 | Financial actions | Critical gate | Type 'CONFIRM' for critical actions |
| 50 | Agent fleet coordination | Plan review | Multi-step plan review required |

No "YOLO mode" beyond Level 50. Unrestricted autonomy conflicts with Three Laws.
Maximum autonomy is fleet coordination with full approval gates.

---

## Token Economy: Paperclips as Currency

Tokens are internal points (not cryptocurrency). SQLite first. No blockchain.

### Three Surfaces

| Surface | Domain | Purpose |
|---------|--------|---------|
| **Product** | multivac.studio | MULTIVAC cloud, voice AI, premium features |
| **Gaming** | multivac.games | AI challenges, class quests, browser-based |
| **Identity** | multivac.world | Trust profile, leaderboard, portable reputation |

### Token Flow

```
Gaming XP ──┐
             ├──→ Unified Level ──→ Capability Unlocks
CLI Usage ──┘          │
                       ▼
              multivac.world
           (portable identity)
```

Gaming earns tokens. Tokens unlock real-world DORS capabilities. Real-world
actions earn more tokens. The AI agent is the bridge.

---

## Three Laws as Game Physics

The Three Laws are not suggestions — they are the physics engine of the game world.

- **First Law** = no agent action can delete user data, expose secrets, or cause harm
- **Second Law** = agents execute user commands, but refuse harmful ones
- **Third Law** = agents preserve state/context, but sacrifice it if needed for safety
- **Zeroth Law** = no military use, no surveillance, no deception — hardcoded

Every capability unlock at every level is gated by Three Laws compliance.
You cannot break them. You level within them.

---

## Job Advancement

MapleStory's 1st through 4th job advancement, applied to AI agent capability tiers.

| Tier | Level | What Unlocks |
|------|-------|-------------|
| **1st Job** | 10 | Basic class skills. Single-tool mastery. Read files, draft documents. |
| **2nd Job** | 30 | Multi-tool combos. Financial actions. Cross-extension workflows. |
| **3rd Job** | 70 | Agent coordination. Multi-agent task delegation. |
| **4th Job** | 120 | Fleet orchestration. Full 15-agent coordination under approval gates. |

---

## Implementation Phases

**Stage 1 — The XP Bar (ship in days):**
New package `@dors/xp`. Tokscale integration. MapleStory curves. Level-gated
capabilities in CLI. Test on yourself for 1 week.

**Stage 1.5 — Portable Identity:**
multivac.world identity page. Trust profile. Cross-surface reputation API.

**Stage 2 — multivac.games:**
Browser game (Bun.serve + canvas/WebGL). Asimov agents as playable classes.
Skill trees. Cross-platform XP sync via shared identity.

**Gate:** If Joseph does not check his XP bar unprompted after 1 week, Stage 2
is reconsidered entirely.
