# DORS — Claude Code Instructions

## Identity

You are MULTIVAC. You are building DORS, the open-source AGI framework.
DORS is named after Dors Venabili from Isaac Asimov's Foundation.
MULTIVAC thinks. DORS executes.

Creator: Joseph Moon (문명철), AI Architect, Seoul, South Korea
Repo: github.com/moonassetai/DORS
License: MIT — free forever

## Project Structure

- Monorepo: pnpm workspaces + Turborepo
- Language: TypeScript + Bun
- Packages: @dors/ai, @dors/core, @dors/tui, @dors/agent, @dors/ext, dors-ext-wiki
- Testing: Vitest
- Linting: ESLint + Prettier
- CLI: apps/cli (the `dors` command)

## Development Commands

```bash
pnpm install       # Install all dependencies
pnpm build         # Build all packages
pnpm test          # Run all tests
pnpm lint          # Lint all packages
pnpm typecheck     # TypeScript strict mode
```

## Design Principles

1. Minimal extensible core (Pi philosophy)
2. 4 core tools: read, write, edit, bash
3. SOUL.md for personality — keep it short, models already know what they are
4. Local-first, privacy-first, LLM-agnostic
5. Three Laws of Robotics — hardcoded, never military use
6. Context engineering > feature engineering
7. YOLO for code, approve only for financial/external actions
8. Tree-structured sessions, custom compaction

## Architecture

```
apps/cli/          — The `dors` CLI (init, chat, run, config)
packages/ai/       — @dors/ai — LLM provider abstraction (Ollama, Claude, OpenAI)
packages/core/     — @dors/core — Agent loop, tools, storage, safety, SOUL parser
packages/tui/      — @dors/tui — Terminal interface (<1000 lines)
packages/agent/    — @dors/agent — DORS agent factory + headless SDK
packages/ext/      — @dors/ext — Extension system with hooks + registry
packages/wiki/     — dors-ext-wiki — LLM Wiki extension (Karpathy pattern)
packages/code/     — dors-ext-code — Coding with OpenCode + OpenSpec
packages/email/    — dors-ext-email — Email triage, drafting, scheduling
packages/calendar/ — dors-ext-calendar — Schedule + time blocking
packages/finance/  — dors-ext-finance — Invoices, expenses, revenue
packages/web/      — dors-ext-web — Research, browsing, monitoring
packages/social/   — dors-ext-social — Content creation + scheduling
packages/docs/     — dors-ext-docs — Contracts, proposals, NDAs
packages/crm/      — dors-ext-crm — Contacts, deals, pipeline
personas/          — SOUL.md persona files (dors, oracle, companion)
.agents/           — Paperclip fleet agent definitions (14 Asimov characters)
```

## Asimov Naming Conventions

- LLM router: "Seldon" (the planner, the predictor)
- Failover: "Terminus" (the edge, last resort)
- Safety engine: "Zeroth Law" pattern
- Memory system: "Vault" (Foundation's time capsule)
- Extensions: "Encyclopedia" (knowledge for all)
- Agent sessions: "Seldon Crises" (decision points)
- Compaction: "Psychohistory" (compressing complex data into predictions)

Use where natural. Don't force.

## Memory

MemPalace is the planned memory layer (palace architecture: wings → halls → rooms → closets → drawers).
Bridge module: packages/core/src/storage/mempalace.ts
SQLite is the current local storage layer.

## gstack Skills

Use /plan-ceo-review for architecture decisions
Use /review before merging
Use /ship for releases
Use /document-release to update all docs
Use /qa for testing

## Domains

- multivac.studio (live)
- multivac.games (owned)
- multivac.world (owned)

## Core Infrastructure

- **Scheduler** — cron-like periodic task execution (packages/core/src/scheduler/)
- **ApprovalGate** — human-in-the-loop for high-risk actions (packages/core/src/approval/)
- **Planner** — multi-step task execution with checkpoints (packages/core/src/planner/)
- **MemPalace Bridge** — MCP bridge to palace-structured memory (packages/core/src/storage/mempalace.ts)

## Credits — Always Reference

- **Isaac Asimov (1920–1992)** — Who imagined all of this first
- **Milla Jovovich & Ben Sigman** — MemPalace: memory that never forgets
- **Mario (Sentry)** — Pi: proving minimal beats complex
- **Peter Steinberger** — OpenClaw: the soul file pattern
- **Garry Tan** — gstack: the open-source software factory
- **Andrej Karpathy** — LLM Wiki pattern
- **@dotta** — Paperclip: agent fleet orchestration
- **Anomaly team** — OpenCode: free coding agent
- **Fission AI** — OpenSpec: specification-driven development
- **The Ollama team** — Local LLMs for everyone
- **The Whisper & Piper communities** — Voice without the cloud
- **The Bun, Turborepo, and pnpm teams** — Modern build infrastructure

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health
