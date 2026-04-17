# DORS Issue Tracker — All Milestones

## Milestone 1: Foundation (Days 1-30)
Phase 1 agents: HARI, SELDON, DANEEL, DEMERZEL, TREVIZE, WANDA

| # | Issue | Assignee | Pri | Labels | Status |
|---|-------|----------|-----|--------|--------|
| 1 | Set up monorepo: pnpm workspaces + Turborepo + tsconfig | SELDON | P0 | `infra` `phase-1` | ☐ |
| 2 | Implement @dors/ai: LLMProvider interface + Ollama provider | DANEEL | P0 | `core` `phase-1` | ☐ |
| 3 | Implement @dors/ai: Anthropic provider (Claude SDK) | DANEEL | P0 | `core` `phase-1` | ☐ |
| 4 | Implement @dors/ai: OpenAI-compatible provider | DANEEL | P1 | `core` `phase-1` | ☐ |
| 5 | Implement @dors/ai: LLM Router with failover logic | DANEEL | P0 | `core` `phase-1` | ☐ |
| 6 | Implement @dors/core: Agent loop (input → SOUL → LLM → tools → response) | DANEEL | P0 | `core` `phase-1` | ☐ |
| 7 | Implement @dors/core: SOUL.md parser + persona injector | DANEEL | P0 | `core` `phase-1` | ☐ |
| 8 | Implement @dors/core: SQLite storage (conversations, messages, memory) | DANEEL | P0 | `core` `phase-1` | ☐ |
| 9 | Implement @dors/core: 4 tools (read, write, edit, bash) | DANEEL | P0 | `core` `phase-1` | ☐ |
| 10 | Implement @dors/core: Three Laws safety engine | DANEEL | P1 | `core` `safety` `phase-1` | ☐ |
| 11 | Implement @dors/core: Context manager (rolling window + compression) | DANEEL | P1 | `core` `phase-1` | ☐ |
| 12 | Implement @dors/tui: Terminal chat interface with streaming | DANEEL | P0 | `tui` `phase-1` | ☐ |
| 13 | Implement apps/cli: Commander.js entry + init/chat/run/config commands | DANEEL | P0 | `cli` `phase-1` | ☐ |
| 14 | Implement apps/cli: Interactive init wizard (@inquirer/prompts) | DANEEL | P1 | `cli` `phase-1` | ☐ |
| 15 | Create CI pipeline: .github/workflows/ci.yml | TREVIZE | P0 | `infra` `ci` `phase-1` | ☐ |
| 16 | Write unit tests: @dors/ai (router, providers, failover) | TREVIZE | P0 | `test` `phase-1` | ☐ |
| 17 | Write unit tests: @dors/core (agent loop, SOUL.md parser, storage) | TREVIZE | P0 | `test` `phase-1` | ☐ |
| 18 | Write unit tests: @dors/core tools (read, write, edit, bash) | TREVIZE | P0 | `test` `phase-1` | ☐ |
| 19 | Security audit: scan for hardcoded secrets, validate sandbox | WANDA | P1 | `security` `phase-1` | ☐ |
| 20 | Architecture review: validate 5-package split matches Pi learnings | SELDON | P0 | `architecture` `phase-1` | ☐ |
| 21 | Create default persona files: dors.soul.md, oracle.soul.md, companion.soul.md | DANEEL | P1 | `core` `phase-1` | ☐ |

**Phase 1 totals:** 21 issues — 14 P0, 7 P1

---

## Milestone 2: Voice + Extensions (Days 31-60)
Add agents: GISKARD, FASTOLFE, BALEY, GLADIA

| # | Issue | Assignee | Pri | Labels | Status |
|---|-------|----------|-----|--------|--------|
| 22 | Implement @dors/ext: Extension loader + hooks system | FASTOLFE | P0 | `ext` `phase-2` | ☐ |
| 23 | Implement @dors/ext: Extension registry + manifest schema | FASTOLFE | P0 | `ext` `phase-2` | ☐ |
| 24 | Implement @dors/ext: Hot-reload without agent restart | FASTOLFE | P1 | `ext` `phase-2` | ☐ |
| 25 | Implement @dors/ext: Custom tools API (user-defined TypeScript tools) | FASTOLFE | P1 | `ext` `phase-2` | ☐ |
| 26 | Build dors-ext-voice: Whisper.cpp STT integration | GISKARD | P0 | `voice` `ext` `phase-2` | ☐ |
| 27 | Build dors-ext-voice: Piper TTS integration | GISKARD | P0 | `voice` `ext` `phase-2` | ☐ |
| 28 | Build dors-ext-voice: Silero VAD + wake word detection | GISKARD | P1 | `voice` `ext` `phase-2` | ☐ |
| 29 | Build dors-ext-voice: Streaming LLM → TTS pipeline | GISKARD | P1 | `voice` `ext` `phase-2` | ☐ |
| 30 | Implement @dors/agent: Default DORS agent config | DANEEL | P0 | `agent` `phase-2` | ☐ |
| 31 | Implement @dors/agent: Headless SDK mode (for Paperclip) | DANEEL | P1 | `agent` `phase-2` | ☐ |
| 32 | Product spec: TUI polish and error states | BALEY | P0 | `product` `phase-2` | ☐ |
| 33 | TUI design: chalk colors, layout, spacing, loading states | GLADIA | P0 | `design` `tui` `phase-2` | ☐ |
| 34 | Product spec: Init wizard UX flow (5-step setup) | BALEY | P1 | `product` `cli` `phase-2` | ☐ |
| 35 | Write tests: @dors/ext (loader, hooks, hot-reload) | TREVIZE | P0 | `test` `phase-2` | ☐ |
| 36 | Write tests: dors-ext-voice (STT, TTS, VAD) | TREVIZE | P1 | `test` `phase-2` | ☐ |
| 37 | Security audit: extension sandboxing, tool permissions | WANDA | P0 | `security` `phase-2` | ☐ |

**Phase 2 totals:** 16 issues — 9 P0, 7 P1

---

## Milestone 3: Launch (Days 61-90)
Add agents: BLISS, PELORAT, NOVI, ARKADY

| # | Issue | Assignee | Pri | Labels | Status |
|---|-------|----------|-----|--------|--------|
| 38 | Write README.md: what + quick start + architecture + contributing | PELORAT | P0 | `docs` `phase-3` | ☐ |
| 39 | Write CONTRIBUTING.md: code standards, PR process, issue templates | PELORAT | P0 | `docs` `phase-3` | ☐ |
| 40 | Write SECURITY.md: vulnerability reporting, Three Laws | PELORAT | P0 | `docs` `phase-3` | ☐ |
| 41 | Write SOUL.md authoring guide | PELORAT | P1 | `docs` `phase-3` | ☐ |
| 42 | API documentation: @dors/ai, @dors/core, @dors/ext interfaces | PELORAT | P1 | `docs` `phase-3` | ☐ |
| 43 | Launch strategy: Product Hunt, Hacker News, Reddit, Twitter plan | BLISS | P0 | `growth` `phase-3` | ☐ |
| 44 | Write Product Hunt launch copy | ARKADY | P0 | `content` `phase-3` | ☐ |
| 45 | Write Hacker News "Show HN" post | ARKADY | P0 | `content` `phase-3` | ☐ |
| 46 | Write Twitter/X launch thread | ARKADY | P1 | `content` `phase-3` | ☐ |
| 47 | Write blog post: "Why I Built DORS" (dev.to/Medium) | ARKADY | P1 | `content` `phase-3` | ☐ |
| 48 | Set up GitHub issue labels + templates | NOVI | P0 | `community` `phase-3` | ☐ |
| 49 | Set up Discord server structure | NOVI | P1 | `community` `phase-3` | ☐ |
| 50 | E2E test: full install → init → chat flow works | TREVIZE | P0 | `test` `phase-3` | ☐ |
| 51 | Final security audit: all packages, all dependencies | WANDA | P0 | `security` `phase-3` | ☐ |
| 52 | Build validation: pnpm lint + test + build + typecheck all pass | DEMERZEL | P0 | `qa` `phase-3` | ☐ |

**Phase 3 totals:** 15 issues — 10 P0, 5 P1

---

## MULTIVAC Website Issues (Separate Paperclip company)

| # | Issue | Assignee | Pri | Labels | Status |
|---|-------|----------|-----|--------|--------|
| W1 | Audit existing multivac.studio codebase and fix build errors | — | P0 | `website` `infra` | ☐ |
| W2 | Landing page: hero, 3 sections, CTA, dark+purple design | — | P0 | `website` `design` | ☐ |
| W3 | About page: Joseph's story, Three Laws, "LET THERE BE LIGHT" | — | P1 | `website` `content` | ☐ |
| W4 | DORS page: features, quick start, link to GitHub | — | P0 | `website` `content` | ☐ |
| W5 | Navigation + footer: MULTIVAC logo, DORS, About links | — | P0 | `website` `design` | ☐ |
| W6 | Mobile responsiveness audit | — | P1 | `website` `design` | ☐ |
| W7 | Vercel deployment: verify multivac.studio resolves correctly | — | P0 | `website` `infra` | ☐ |
| W8 | SEO: meta tags, Open Graph, structured data | — | P1 | `website` `seo` | ☐ |

**Website totals:** 8 issues — 5 P0, 3 P1

---

## Grand Total: 60 issues (38 P0, 22 P1)
