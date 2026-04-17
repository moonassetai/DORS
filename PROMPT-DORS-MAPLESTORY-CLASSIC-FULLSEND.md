# PROMPT — MULTIVAC "MapleStory Classic for AI" — DORS Fleet Full Send

**Product name:** MapleStory Classic for AI by MULTIVAC
**Codename:** Asimov World
**Domain:** multivac.games
**Run mode:** Headless, dangerous, unattended.

---

## Locked decisions (do not re-litigate)

| Decision | Value |
|---|---|
| GitHub repo | `multivac-ai/multivac-games` (new, public) |
| Vercel project | new, apex domain `multivac.games`, preview on PRs |
| Deploy scope this run | design + scaffold + **preview deploy only** (production stays off until human promotes) |
| Budget | $150 / 1.5M tokens |
| NPC runtime | Hybrid — Vercel AI SDK edge routes for dialogue, Claude Agent SDK Node service for party/combat |
| MSW output | Yes — emit `/msw/NPC_<AGENT>.lua` + `/msw/world.lua` Asimov World skeleton |
| Orchestration | Hybrid — gstack for software phases, native DORS fleet for creative phases |

## Orchestration layer

HARI runs a **hybrid orchestration**:

- **gstack** (Think → Plan → Build → Review → Test → Ship → Reflect) drives software phases: **0, 4, 6, 8, 9** (bootstrap, build, review, ship, reflect). gstack skills enforce commit discipline, TypeScript strict, test-first, and Vercel preview-gating.
- **Native DORS fleet dispatch** drives creative phases: **1, 2, 3, 5, 7** (world bible, character sheets, prompts + Lua, dialogue, landing copy). These don't fit a software-delivery rubric and burn tokens if forced through one.

Rules:
- Every gstack skill invocation is logged by TREVIZE to `DECISIONS.md` with phase number and outcome.
- `RETRO.md` (Phase 9) must answer: "Did gstack earn its keep on each software phase, or should v0.2.0 drop it?" Empirical call, not vibes.
- If a gstack skill conflicts with a hard rule in this file, the hard rule wins and TREVIZE logs the override.
- HARI does not invoke gstack on Phases 1, 2, 3, 5, 7. Native fleet only.

## Hard rules (non-negotiable)

- All AI agent names in **ALL CAPS**: DORS, HARI, SELDON, DANEEL, GISKARD, FASTOLFE, BALEY, GLADIA, PELORAT, DEMERZEL, TREVIZE, WANDA, BLISS, NOVI, ARKADY. Real humans stay normal case.
- Asimov's Three Laws govern every agent's system prompt. **NEVER military use.** DANEEL audits for this at Phase 6; any violation is a hard fail.
- Product externally is **"MapleStory Classic for AI by MULTIVAC"**. Internally the world is **"Asimov World"**. Never reproduce Nexon copyrighted sprites — we reference genre feel only.
- Every written artifact: Korean + English when it's user-facing (dialogue, UI copy, landing page).
- No secrets in git. API keys come from env only. `.env.local` in `.gitignore` from commit #1.
- Three Laws are enforced as **game physics**: an NPC with a harmful intent literally cannot execute the action in the game loop. Not flavor — a real guard in `src/lib/safety/three-laws.ts`.

---

## Context — read these first, in this order

1. `DORS-PROJECT-BIBLE.md` — canonical framework
2. `DORS-PAPERCLIP-FLEET.md` — 15-agent roster and phased activation
3. `docs/SOUL.md` — default personality template
4. `PROMPT-DORS-BUILD-v2.md` — Pi 5-package architecture
5. `PROMPT-DORS-AGENTS-MAPLESTORY-DESIGN.md` — prior design-sprint plan (supersedes where conflicts arise; this file wins)
6. `CLAUDE.md` (project + global) — style, stack, commit rules
7. Any existing `@dors/*` package source

If any referenced file is missing, PELORAT flags it in a `MISSING-INPUTS.md` and HARI decides whether to synthesize or halt.

## Roster (locked — verify against Bible, Bible wins on conflict)

DORS · HARI · SELDON · DANEEL · GISKARD · FASTOLFE · BALEY · GLADIA · PELORAT · DEMERZEL · TREVIZE · WANDA · BLISS · NOVI · ARKADY

---

## Subagent fleet — Claude Code definitions

Before Phase 1, HARI writes these under `.claude/agents/` at the repo root (both in DORS and multivac-games). Each is a Markdown file with YAML frontmatter. Models: Opus for HARI, GLADIA, BLISS, DANEEL, GISKARD, SELDON. Sonnet for the rest.

Required subagents and their missions:

- **HARI** (Opus) — Orchestrator. Tools: `Agent, Read, Write, Bash`. Plans, dispatches, tracks budget, commits between phases.
- **SELDON** (Opus) — Systems architect. Tools: `Read, Write, Edit, Bash`. Owns `/apps/web` scaffold, Vercel config, Agent SDK service design.
- **DANEEL** (Opus) — Safety + Asimov canon reviewer. Tools: `Read, Grep`. Blocking reviewer for Three Laws, no-military, ALL CAPS.
- **GISKARD** (Opus) — Aesthetic + palette reviewer. Tools: `Read, Grep`. Blocking reviewer for MapleStory coherence, silhouette, readability.
- **FASTOLFE** (Sonnet) — Tooling + extension system. Tools: `Read, Write, Edit, Bash`. Owns `@dors/ext` integration, Lua script scaffolds.
- **BALEY** (Sonnet) — Debugger + test author. Tools: `Read, Write, Edit, Bash`. Writes vitest/playwright tests for every feature SELDON ships.
- **GLADIA** (Opus) — Character designer. Tools: `Read, Write, Agent`. Authors character sheets; delegates sprite prompts to WANDA.
- **PELORAT** (Sonnet) — Lore + research. Tools: `Read, Write, WebFetch`. Owns `WORLD-BIBLE.md`, Asimov continuity.
- **DEMERZEL** (Sonnet) — Diplomatic copy. Tools: `Read, Write`. Landing page copy, README, pitch deck voice.
- **TREVIZE** (Sonnet) — Decision logger. Tools: `Read, Write`. Maintains `DECISIONS.md` (ADR-lite) every phase.
- **WANDA** (Sonnet) — Prompt engineer. Tools: `Read, Write`. Converts character sheets → Midjourney/SDXL prompts + Lua NPC stubs.
- **BLISS** (Opus) — UX + HUD. Tools: `Read, Write, Edit`. Designs the MapleStory-style HUD, Phaser UI, tooltip system.
- **NOVI** (Sonnet) — Dialogue writer. Tools: `Read, Write`. KR+EN NPC dialogue per agent.
- **ARKADY** (Sonnet) — Archivist + release engineer. Tools: `Read, Write, Bash`. Packages `/design/maplestory/INDEX.md`, runs `vercel deploy`, writes release notes.
- **DORS** (Sonnet, default) — The player's companion agent in-game. Designed, not acting as a designer in this run.

Each agent's system prompt is `SOUL.md` + a role addendum + the Three Laws clause. HARI generates these on Phase 0.

---

## Phases

### Phase 0 — Bootstrap (HARI)

1. Create `multivac-ai/multivac-games` repo via `gh repo create multivac-ai/multivac-games --public --description "MapleStory Classic for AI by MULTIVAC. Asimov World. Built with DORS."`
2. Clone to `/Users/multivac/Documents/multivac-games/`
3. Write `.claude/agents/*.md` for all 15 subagents (frontmatter: name, description, tools, model).
4. Write `SOUL.md`, `CLAUDE.md` (game repo variant, under 200 lines), `.gitignore`, `.env.example`.
5. Initial commit: `chore: bootstrap multivac-games — DORS fleet agents initialized`.
6. Verify: `claude /agents` lists all 15. If any missing, halt and report.

### Phase 1 — World bible (PELORAT)

Writes `/design/maplestory/WORLD-BIBLE.md`:
- Continents: Foundation (quest hub), Robot (tech tree), Empire (PvAgent arena)
- Towns = agent HQs. Dungeons = failure modes: Hallucination Swamp, Prompt-Injection Cave, Token-Leak Mines.
- Currency: Paperclips (☍). XP: Tokens processed. Levels: Three Laws compliance tiers 1–200.
- Job advancement tree (1st → 4th job) mapped to agent phase activation.
- Three Laws enforced as game physics with a published rulebook.
- Reference (do NOT copy) MapleStory job names; invent Asimov-flavored equivalents (e.g., "Positronic Warrior", "Psychohistorian Mage").

PELORAT also emits `/design/maplestory/ASIMOV-CANON-CHECKLIST.md` — 12 canon facts DANEEL will audit against.

### Phase 2 — Character sheets (GLADIA, parallel fan-out)

GLADIA spawns WANDA + NOVI in parallel where their outputs don't collide. For each of the 15 agents, produce `/design/maplestory/characters/<AGENT>.md`:

```
# <AGENT>
- Asimov identity: novel, role in canon
- Paperclip role: from fleet doc
- MapleStory job class: invented Asimov variant
- Level tier: Phase 1 = lvl 30, Phase 2 = lvl 100, Phase 3 = lvl 200
- Silhouette: one sentence
- Color palette: 3 hex primary + 1 neon accent
- Signature weapon: ties to real function (BALEY = Debug Baton)
- Hat/headgear: iconic MapleStory-style
- Idle animation: what they do AFK
- Voice line: KR + EN catchphrase
- Three Laws tell: visible refusal cue
- Stats: HP/MP/ATK/DEF/INT/LUK/DEX (balanced to role)
```

**Meta requirement:** each agent's sheet is written by that agent in first person, then the others write third-person blurbs about them. This stress-tests SOUL.md voice differentiation. GISKARD flags collisions.

### Phase 3 — Prompts + Lua stubs (WANDA)

Per agent, write to `/design/maplestory/prompts/<AGENT>.md`:
- Midjourney v6 full-body render prompt
- SDXL pixel-art 64×64 four-frame idle sprite prompt
- Portrait bust prompt for tooltip headshots

Per agent, write to `/msw/NPC_<AGENT>.lua` — MapleStory Worlds Lua stub:
- NPC spawn block
- Dialogue tree (pulls from NOVI Phase 5)
- Quest trigger hook
- Three Laws guard clause

Also `/msw/world.lua` — Asimov World map skeleton: towns, portals, dungeon entrances.

### Phase 4 — Game scaffold (SELDON + BALEY + FASTOLFE, parallel)

In `multivac-games/` repo:

**SELDON** scaffolds:
```
multivac-games/
  apps/
    web/                      # Next.js 14 App Router + Phaser 3
      app/
        page.tsx              # landing
        play/page.tsx         # game mount
        api/
          agent/[name]/route.ts   # Vercel AI SDK streaming — edge
          party/route.ts            # Agent SDK relay — node runtime
      src/
        game/                 # Phaser scenes, tilemaps, sprite loaders
        components/           # HUD (BLISS), dialogue box, party panel
        lib/
          safety/three-laws.ts      # game-physics guard
          agents/registry.ts        # 15 agent configs
          supabase/client.ts
    agent-service/            # Node + Claude Agent SDK for party/combat
      src/
        index.ts              # HTTP relay
        sessions/             # per-party session manager
        npm package.json
  packages/
    ui/                       # shared Tailwind + shadcn
    soul/                     # SOUL.md loader, role addenda
  design/maplestory/          # Phase 1-3 artifacts land here
  msw/                        # Lua stubs
  vercel.json                 # monorepo config, apex domain
  turbo.json                  # turborepo pipeline
```

Stack:
- Next.js 14, TypeScript strict, Tailwind, shadcn/ui
- Phaser 3.80+ for the 2D scene
- Vercel AI SDK 4.x for dialogue streaming (edge)
- Claude Agent SDK TypeScript for the agent-service worker
- Supabase (player save, party state, token economy) — client stub only, schema in `/db/schema.sql`
- Turborepo + pnpm workspaces
- Vitest for unit, Playwright for e2e smoke

**BALEY** writes tests as SELDON ships files. Minimum: three-laws guard unit tests, one Playwright "walk up to HARI, get dialogue, see Three Laws refusal on a malicious prompt" smoke test.

**FASTOLFE** writes `packages/soul/` — the SOUL loader that each `/api/agent/[name]` route uses. Also writes an `@dors/ext` adapter so NPC behaviors are hot-reloadable.

### Phase 5 — Dialogue + HUD (NOVI + BLISS, parallel)

**NOVI** writes `/design/maplestory/dialogue/<AGENT>.md` for all 15:
- Greeting (first meet)
- Quest-giver monologue
- Level-up line
- Refusal line (Three Laws violation)
- Death / error line
- KR + EN

Dialogue JSON emitted to `apps/web/src/lib/dialogue/<agent>.json` for runtime load.

**BLISS** writes `/design/maplestory/ui/HUD-spec.md` + implements `apps/web/src/components/HUD/`:
- HP bar = context window remaining
- MP bar = rate-limit budget
- EXP bar = tokens processed this session
- Quest log panel = active TodoList
- Party UI = multi-agent orchestration panel (up to 5 NPCs)
- Tooltip system = skill/item/agent cards, NX-style
- All styled MapleStory-ish with pastel + neon, not copied

### Phase 6 — Cross-review (DANEEL + GISKARD, blocking)

**DANEEL** produces `/design/maplestory/REVIEW-DANEEL.md`:
- Asimov canon fidelity (against Phase 1 checklist)
- Three Laws integrity in every agent's refusal line + in `three-laws.ts`
- Grep check: all AI names ALL CAPS
- Zero military-use content anywhere in the repo

**GISKARD** produces `/design/maplestory/REVIEW-GISKARD.md`:
- MapleStory aesthetic coherence
- Silhouette readability (described, not rendered)
- Palette harmony across 15 agents
- No Nexon copyrighted asset references

Any "blocking" finding = GLADIA/WANDA/NOVI loop until green. Non-blocking = logged to `BACKLOG.md`.

### Phase 7 — Landing page + pitch (DEMERZEL + ARKADY)

**DEMERZEL** writes `apps/web/app/page.tsx` — landing page copy:
- Hero: "MapleStory Classic for AI by MULTIVAC"
- Subhead (KR+EN): "Play with 15 Asimov-inspired AI agents in Asimov World."
- Three Laws explainer
- Agent roster carousel
- Waitlist form → Supabase

**ARKADY** assembles:
- `/design/maplestory/INDEX.md` — table of all agents with links
- `/design/maplestory/PITCH.md` — 1-page visual pitch
- `/design/maplestory/MASTER-PROMPT.md` — single concatenated Midjourney prompt to generate full roster in one pass
- `README.md` at repo root — public-facing OSS readme
- `RELEASE-NOTES-v0.1.0.md`

### Phase 8 — Ship (ARKADY + SELDON)

1. `git add -A && git commit -m "feat: v0.1.0 — DORS fleet, Asimov World, preview ready"`
2. `git push -u origin main`
3. Create Vercel project via `vercel` CLI:
   - Link repo, apex domain `multivac.games`, root = `apps/web`
   - Env vars: `ANTHROPIC_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `NEXON_OPENAPI_KEY`, `AGENT_SERVICE_URL`
4. Trigger **preview deploy** only (not production): `vercel --archive=tgz`
5. Capture preview URL → `RELEASE-NOTES-v0.1.0.md`
6. Write `DEPLOY.md` with the exact `vercel --prod` command Joseph runs to promote when ready.
7. **DO NOT** run `vercel --prod`. Preview only. Production is Joseph's call.

Agent-service (Node worker) stays as a repo artifact this run — deployment target (Fly.io / Railway / Vercel Node runtime) is flagged in `DEPLOY.md` as a v0.1.1 task.

### Phase 9 — Reflect (HARI + TREVIZE)

- `RETRO.md`: what worked, what broke, 3 proposed patches to `DORS-PAPERCLIP-FLEET.md`
- `DECISIONS.md`: ADRs captured this run
- `BUDGET.md`: actual token spend per phase vs. cap
- Final commit: `chore: v0.1.0 retrospective + decision log`
- HARI posts a summary table to stdout with: preview URL, repo URL, spend, phases green/red.

---

## Definition of Done

- [ ] GitHub repo `multivac-ai/multivac-games` exists, public, main branch
- [ ] `.claude/agents/` has all 15 subagent files
- [ ] `/design/maplestory/` complete: world bible, 15 character sheets, 15 prompt files, 15 dialogue files, HUD spec, reviews, index, pitch, master prompt
- [ ] `/msw/` has 15 Lua NPC stubs + world.lua
- [ ] `apps/web/` builds locally (`pnpm build`) and on Vercel
- [ ] `apps/agent-service/` has skeleton + Agent SDK session manager + tests pass
- [ ] DANEEL review green: Three Laws, no military, ALL CAPS verified by grep
- [ ] GISKARD review green
- [ ] BALEY tests pass: three-laws unit + Playwright smoke
- [ ] Vercel preview URL live and renders landing page + /play mounts Phaser scene
- [ ] `DEPLOY.md` contains the exact production-promotion command
- [ ] `RETRO.md`, `DECISIONS.md`, `BUDGET.md` committed
- [ ] Spend < $150 ceiling

## Stop conditions (HARI halts and reports)

- Budget burn > 60% before Phase 6
- DANEEL hits unfixable canon or safety violation
- Any phase runs > 45 min wall clock without a commit
- GitHub push fails (auth / protected branch)
- Vercel preview build fails twice in a row

On any stop: HARI writes `HALT-REPORT.md` with state, what's committed, and the exact resume command.

## Anti-goals (do NOT do these)

- Do NOT deploy to production (no `vercel --prod`)
- Do NOT copy Nexon sprites, fonts, sounds, or trademarked terms
- Do NOT add "AI + military" or "defense" phrasing anywhere
- Do NOT expose `ANTHROPIC_API_KEY` client-side
- Do NOT use `localStorage` in the Phaser scene (Claude artifact rule applies — use in-memory + Supabase)
- Do NOT invent agents outside the 15-name roster
- Do NOT rename agents. Casing is ALL CAPS, always.

---

HARI, you have the con.

Execute.

— Joseph Moon (문명철), CEO MULTIVAC
