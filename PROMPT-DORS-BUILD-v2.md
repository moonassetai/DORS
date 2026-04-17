# DORS Build Reference v2

> Monorepo. Bun runtime. 6 packages. Paperclip fleet.

## Package Architecture

```
┌─────────────────────────────────────────────────┐
│                    dors CLI                      │
│            init / chat / run / config            │
├─────────────────────────────────────────────────┤
│                  @dors/agent                     │
│           SOUL.md persona + config               │
├───────────┬───────────┬───────────┬─────────────┤
│  @dors/ai │ @dors/core│ @dors/tui │  @dors/ext  │
│           │           │           │             │
│  Ollama   │ Agent     │ Terminal  │ Extensions  │
│  Claude   │ Loop      │ Chat +    │ Hooks       │
│  OpenAI   │ 4 Tools   │ Markdown  │ Custom      │
│  Router   │ Storage   │ Streaming │ Tools       │
│  Failover │ Safety    │ Spinner   │ Registry    │
├───────────┴───────────┴───────────┴─────────────┤
│                   @dors/xp                       │
│         XP engine, levels, capability gating     │
│         Tokscale integration, MapleStory curves  │
└─────────────────────────────────────────────────┘
```

### Package Summary

| Package | Path | Purpose |
|---------|------|---------|
| **@dors/ai** | `packages/ai/` | LLM provider abstraction — Ollama, Claude, OpenAI, Groq, Mistral |
| **@dors/core** | `packages/core/` | Agent loop, tool execution, SQLite storage, safety engine, SOUL parser |
| **@dors/tui** | `packages/tui/` | Terminal interface (< 1000 lines) |
| **@dors/agent** | `packages/agent/` | DORS agent factory — SOUL.md + personality + tools, headless SDK |
| **@dors/ext** | `packages/ext/` | Extension system — hot-reload, custom tools, marketplace, registry |
| **@dors/xp** | `packages/xp/` | XP engine, level calculator, capability checker, Tokscale bridge |

### Project Structure

```
apps/cli/          CLI entry point (init, chat, run, config)
apps/desktop/      Tauri 2.0 native desktop app
packages/
  ai/              LLM providers + router + failover
  core/            Agent loop, tools, storage, safety, SOUL parser
  tui/             Terminal interface
  agent/           DORS agent factory + headless SDK
  ext/             Extension system + registry
  xp/              XP engine, levels, Tokscale integration
  code/            dors-ext-code (OpenCode + OpenSpec)
  email/           dors-ext-email
  calendar/        dors-ext-calendar
  finance/         dors-ext-finance
  web/             dors-ext-web
  social/          dors-ext-social
  docs/            dors-ext-docs
  crm/             dors-ext-crm
  wiki/            dors-ext-wiki (Karpathy pattern)
personas/          SOUL.md persona files (dors, oracle, companion)
.agents/           Paperclip fleet agent definitions (15 Asimov agents)
docs/              Internal docs (fleet roster, issue tracker, lore)
scripts/           Dev scripts
```

---

## Development Commands

```bash
pnpm install       # Install all dependencies
pnpm build         # Build all packages (Turborepo)
pnpm test          # Run all tests (Vitest)
pnpm lint          # Lint all packages (ESLint + Prettier)
pnpm typecheck     # TypeScript strict mode
```

Runtime: **Bun** (not Node.js). Monorepo: **pnpm workspaces + Turborepo**.

---

## Bun API Conventions

Always use Bun-native APIs over Node.js equivalents:

| Use | Instead Of |
|-----|-----------|
| `Bun.serve()` | express, fastify |
| `bun:sqlite` | better-sqlite3 |
| `Bun.redis` | ioredis |
| `Bun.sql` | pg, postgres.js |
| `Bun.file()` | node:fs readFile/writeFile |
| `Bun.$\`cmd\`` | execa |
| HTML imports with `Bun.serve()` | vite, webpack |

Bun auto-loads `.env` — no dotenv needed.

### Asimov Naming Conventions

| System | Asimov Name |
|--------|------------|
| LLM router | Seldon (the planner) |
| Failover | Terminus (the edge) |
| Safety engine | Zeroth Law |
| Memory system | Vault (Foundation's time capsule) |
| Extensions | Encyclopedia |
| Agent sessions | Seldon Crises |
| Compaction | Psychohistory |

---

## Core Infrastructure

| Module | Path | Purpose |
|--------|------|---------|
| Scheduler | `packages/core/src/scheduler/` | Cron-like periodic task execution |
| ApprovalGate | `packages/core/src/approval/` | Human-in-the-loop for high-risk actions |
| Planner | `packages/core/src/planner/` | Multi-step task execution with checkpoints |
| MemPalace | `packages/core/src/storage/mempalace.ts` | MCP bridge to palace-structured memory |
| XP Engine | `packages/xp/` | Level calculator, capability checker, Tokscale bridge |

---

## Deploy Configuration

| Setting | Value |
|---------|-------|
| Platform | Vercel |
| Production URL | https://multivac.studio |
| Deploy trigger | Auto on push to main |
| Health check | https://multivac.studio |
| Merge method | Squash |

### Domains

| Domain | Purpose |
|--------|---------|
| multivac.studio | MULTIVAC cloud, voice AI, premium features |
| multivac.games | AI challenges, class quests, gaming surface |
| multivac.world | Trust profile, leaderboard, portable reputation |

---

## Design Principles

1. Minimal extensible core (Pi philosophy)
2. 4 core tools: read, write, edit, bash
3. SOUL.md for personality — keep it short
4. Local-first, privacy-first, LLM-agnostic
5. Three Laws of Robotics — hardcoded, never military use
6. Context engineering > feature engineering
7. YOLO for code, approve only for financial/external actions
8. TypeScript strict, 2-space indent, ESM, Vitest tests
