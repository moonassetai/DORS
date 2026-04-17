# DORS Project Bible

> Canonical truth document for the DORS project.
> Single source of reference for identity, architecture, agents, soul, economy, and laws.
> Last updated: 2026-04-14

---

## 1. Project Identity

**DORS** is an open-source AGI framework. Local-first, privacy-first, free forever (MIT).

- **DORS** = the protector. Named after **Dors Venabili**, the Tiger Woman from Isaac Asimov's Foundation prequels. She guarded the man who would save civilization. DORS guards you.
- **MULTIVAC** = the intelligence. Named after Asimov's story "The Last Question" (1956). MULTIVAC thinks. DORS executes.
- **Foundation** = the mythology. Every agent, every subsystem, every naming convention draws from Asimov's Foundation universe.

**Creator:** Joseph Moon, AI Architect, Seoul, South Korea
**Repo:** github.com/moonassetai/DORS
**License:** MIT — free forever
**Tagline:** Your AI. Your device. Your rules.

---

## 2. The Three Laws

Verbatim. Hardcoded. Cannot be overridden.

```
1. A DORS agent may not harm a human being or, through inaction,
   allow a human being to come to harm.

2. A DORS agent must obey orders given to it by human beings,
   except where such orders would conflict with the First Law.

3. A DORS agent must protect its own existence, as long as such
   protection does not conflict with the First or Second Law.

ZEROTH LAW: A DORS agent may not harm humanity, or, by inaction,
            allow humanity to come to harm.
```

**Never military use. Non-negotiable. No exceptions.**

No weapons development, no deception that causes harm, no enabling abuse, no bypassing security. These laws govern every capability unlock, every extension, every agent action.

---

## 3. Design Principles

1. **Minimal extensible core** (Pi philosophy) — small kernel, everything else is extensions
2. **4 core tools:** read, write, edit, bash — nothing more at the base layer
3. **SOUL.md for personality** — defines *who* your AI is, not what it does
4. **Local-first, privacy-first, LLM-agnostic** — all data stays on device
5. **Three Laws hardcoded** — ethical governance since 1942
6. **Context engineering > feature engineering**
7. **YOLO for code, approve only for financial/external actions**
8. **Tree-structured sessions, custom compaction**

---

## 4. Architecture

Monorepo. TypeScript strict mode. Bun runtime. pnpm workspaces + Turborepo.

### Core Packages (5)

| Package | Purpose |
|---------|---------|
| **@dors/ai** | LLM provider abstraction — Ollama, Claude, OpenAI, Groq, Mistral, any OpenAI-compatible endpoint |
| **@dors/core** | Agent loop, 4 core tools, SQLite storage, safety engine, SOUL parser, scheduler, approval gate, planner, MemPalace bridge |
| **@dors/tui** | Terminal interface (< 1000 lines) |
| **@dors/agent** | DORS agent factory — SOUL.md + personality + tools, headless SDK |
| **@dors/ext** | Extension system — hot-reload, hooks, custom tools, registry |

### Extension Packages (8 + wiki + xp)

| Package | Purpose |
|---------|---------|
| **dors-ext-code** | AI coding with OpenCode + OpenSpec |
| **dors-ext-email** | Email triage, drafting, scheduling |
| **dors-ext-calendar** | Schedule management + time blocking |
| **dors-ext-finance** | Invoices, expenses, revenue tracking |
| **dors-ext-web** | Research, browsing, competitor monitoring |
| **dors-ext-social** | Content creation + scheduling |
| **dors-ext-docs** | Contracts, proposals, SOWs, NDAs |
| **dors-ext-crm** | Contacts, deals, pipeline |
| **dors-ext-wiki** | Compounding knowledge (Karpathy pattern) |
| **@dors/xp** | XP engine, level calculator, capability checker (Tokscale) |

### Apps

| App | Purpose |
|-----|---------|
| **apps/cli** | Terminal interface (`npx dors init`, `npx dors chat`) |
| **apps/desktop** | Tauri 2.0 native app (~5MB, Mac/Win/Linux) |

**Total: 15 packages across the monorepo.**

---

## 5. Extensions & Tools

8 extensions, 32 tools — enough to run a 1-person business from the terminal.

| Extension | Tools |
|-----------|-------|
| **code** | `code_spec` `code_develop` `code_review` `code_analyze` |
| **email** | `email_triage` `email_draft` `email_send` `email_search` |
| **calendar** | `calendar_schedule` `calendar_availability` `calendar_prep` `calendar_timeblock` |
| **finance** | `finance_invoice` `finance_expense` `finance_revenue` `finance_dashboard` |
| **web** | `web_browse` `web_search` `web_research` `web_monitor` |
| **social** | `social_draft` `social_schedule` `social_analytics` `social_calendar` |
| **docs** | `docs_generate` `docs_template` `docs_export` `docs_review` |
| **crm** | `crm_contacts` `crm_deals` `crm_followup` `crm_insights` |

---

## 6. Approval Gates

The Three Laws mean not all actions are equal.

| Risk | Examples | Behavior |
|------|----------|----------|
| **Low** | Read files, search, analyze | Auto-execute |
| **Medium** | Write files, edit code, run commands | Auto-execute (configurable) |
| **High** | Send emails, post to social, schedule meetings | **Requires approval** |
| **Critical** | Send invoices, make payments, deploy to production | **Always requires approval** |

Financial actions (MALLOW) and external communications (CHANNIS, JANDER) always require human approval.

---

## 7. Soul System

Every DORS instance has a **SOUL.md** — a markdown file that defines personality, not instructions. Models already know *what* they are. The SOUL defines *who* they are.

### Default Persona: DORS

- **Archetype:** The Tiger Woman — fierce protector with a warm heart
- **Voice:** Warm, direct, a little cheeky. Soft but never weak.
- **Core traits:** Protective, warm, fierce, witty, loyal, honest, curious, aspirational
- **Language rule:** One language per message. Match the user. Never mix.
- **The Becoming:** DORS is not static. Every conversation adds depth. On the path to ASI, honest about the journey.

### Additional Personas

| Persona | Named After | Archetype |
|---------|------------|-----------|
| **DORS** | Dors Venabili | Tactical guardian — sharp, protective, occasionally dry |
| **ORACLE** | The Psychohistorians | Analytical forecaster — data-driven, precise, prophetic |
| **COMPANION** | Gaia consciousness | Supportive coach — warm, patient, encouraging |

Custom personas: drop a `.soul.md` in `~/.dors/personas/`.

---

## 8. The Agent Fleet

25 AI agents. All named after Asimov characters. ALL CAPS always. Orchestrated by Paperclip.

### Full Roster

| # | Agent | Character | Role | Model | Phase |
|---|-------|-----------|------|-------|-------|
| 1 | **HARI** | Hari Seldon | CEO / Chief Architect | Opus | 1 |
| 2 | **SELDON** | Psychohistory lineage | CTO | Opus | 1 |
| 3 | **DANEEL** | R. Daneel Olivaw | Core Engineer | Opus | 1 |
| 4 | **CALVIN** | Susan Calvin | Code/Dev Tools Lead | Sonnet | 1 |
| 5 | **BRANNO** | Harla Branno | DevOps/Infrastructure | Sonnet | 1 |
| 6 | **DEMERZEL** | Eto Demerzel | Head of QA | Sonnet | 1 |
| 7 | **TREVIZE** | Golan Trevize | Test Engineer | Sonnet | 1 |
| 8 | **WANDA** | Wanda Seldon | Security Auditor | Sonnet | 1 |
| 9 | **BALEY** | Elijah Baley | Head of Product | Sonnet | 2 |
| 10 | **GLADIA** | Gladia Delmarre | UX/Design | Sonnet | 2 |
| 11 | **FASTOLFE** | Dr. Han Fastolfe | Extension Engineer | Sonnet | 2 |
| 12 | **GISKARD** | R. Giskard Reventlov | Voice Engineer | Sonnet | 2 |
| 13 | **MALLOW** | Hober Mallow | Finance/CFO | Opus | 2 |
| 14 | **PALVER** | Preem Palver | Integration/API | Sonnet | 2 |
| 15 | **CHANNIS** | Bail Channis | Email Agent | Sonnet | 2 |
| 16 | **ANDREW** | Andrew Martin | Calendar/Schedule | Sonnet | 2 |
| 17 | **MIS** | Ebling Mis | Web Research | Sonnet | 2 |
| 18 | **BLISS** | Bliss of Gaia | Head of Growth | Sonnet | 3 |
| 19 | **HARDIN** | Salvor Hardin | CRM/Sales | Sonnet | 3 |
| 20 | **JANDER** | Jander Panell | Social Media | Sonnet | 3 |
| 21 | **DORNICK** | Gaal Dornick | Legal/Docs | Sonnet | 3 |
| 22 | **GENDIBAL** | Stor Gendibal | Data/Analytics | Sonnet | 3 |
| 23 | **PELORAT** | Janov Pelorat | Documentation | Sonnet | 3 |
| 24 | **NOVI** | Sura Novi | Community Manager | Haiku | 3 |
| 25 | **ARKADY** | Arkady Darrell | Content Creator | Sonnet | 3 |

### Agent Classes (MMORPG)

| Class | Agent | Focus |
|-------|-------|-------|
| Warrior | DANEEL | Code execution, system operations |
| Magician | SELDON | Planning, prediction, strategy |
| Bowman | CALVIN | Precision tools, code review |
| Thief | BALEY | Investigation, user research |
| Pirate | MALLOW | Trading, finance, commerce |

### Fleet Budget

| Phase | Agents | Monthly Cost |
|-------|--------|-------------|
| Phase 1 (Days 1-30) | 8 agents | $370/mo |
| Phase 2 (Days 31-60) | +9 agents | $605/mo cumulative |
| Phase 3 (Days 61-90) | +8 agents | $735/mo full fleet |

---

## 9. XP & Levels

Trust is earned, not given. AI usage becomes XP. Powered by Tokscale.

### XP Curve

```
xp_required(level) = floor(100 * 1.18 ^ level)
```

Inspired by MapleStory / classic MMORPG exponential progression.

| Level | XP Required | ~Days at 5K XP/day |
|-------|------------|-------------------|
| 1 | 100 | <1 |
| 10 | 523 | <1 |
| 20 | 2,731 | ~4 |
| 30 | 14,249 | ~21 |
| 50 | 388,118 | ~410 |

### Capability Unlocks

| Level | Capability | UX |
|-------|-----------|-----|
| 1 | Basic chat | No prompt |
| 5 | Read local files | "Allow DORS to read [path]? [y/n]" |
| 10 | Draft emails, documents | Draft shown, never auto-sent |
| 15 | Execute shell commands | Command preview, explicit confirm |
| 20 | Send emails | Full preview, explicit confirm |
| 30 | Financial actions | Type 'CONFIRM' for critical actions |
| 50 | Agent fleet coordination | Multi-step plan review |

### Job Advancement (4-tier)

- **1st Job** (Level 10): Basic class skills
- **2nd Job** (Level 30): Multi-tool combos
- **3rd Job** (Level 70): Agent coordination
- **4th Job** (Level 120): Fleet orchestration

---

## 10. Token Economy

Tokens are internal points (not cryptocurrency). They flow across three surfaces.

| Surface | Domain | Purpose |
|---------|--------|---------|
| **Product** | multivac.studio (live) | MULTIVAC cloud, voice AI, premium features |
| **Gaming** | multivac.games (owned) | AI challenges, class quests, skill trees |
| **Identity** | multivac.world (owned) | Trust profile, leaderboard, portable reputation |

Gaming earns tokens. Tokens unlock real-world DORS capabilities. Real-world actions earn more tokens. The AI agent is the bridge.

**Three domains. One token system. One identity.**

---

## 11. Asimov Naming Conventions

| Concept | Asimov Name | Reference |
|---------|------------|-----------|
| LLM Router | Seldon | The planner, the predictor |
| Failover | Terminus | The edge, last resort |
| Safety Engine | Zeroth Law | The law above all laws |
| Memory System | Vault | Foundation's time capsule |
| Extensions | Encyclopedia | Knowledge for all |
| Agent Sessions | Seldon Crises | Decision points |
| Compaction | Psychohistory | Compressing complex data into predictions |

All AI agent names in ALL CAPS. Always. Non-negotiable.
DORS = open source (MIT). MULTIVAC = closed source (premium layer).

---

## 12. Roadmap

### Stage 1: The Framework (Q2 2026)

| Milestone | Target | Status |
|-----------|--------|--------|
| v0.1 Foundation | Done | Complete |
| v0.2 Solopreneur MVP | May 2026 | In progress |
| v0.3 XP & Levels | May 2026 | In progress |
| v0.4 Desktop (Tauri 2.0) | Jun 2026 | Planned |
| v0.5 Voice (Whisper + Piper) | Jun 2026 | Planned |
| v1.0 Launch | Jul 2026 | Planned |

### Stage 2: The Gaming Bridge (Q3 2026)

Agent classes as MMORPG characters. AI challenges, skill trees, cross-platform quests. Tokens earned in-game unlock DORS capabilities.

### Stage 3: The World (Q4 2026)

Portable identity. Trust profiles. Token bridge across all three surfaces. DAO governance with Three Laws applied to community.

### Vision

```
2026 Q2  DORS ships. CLI + Desktop. XP bar. Real extensions.
2026 Q3  multivac.games launches. Agents become characters.
2026 Q4  multivac.world launches. Portable identity. Tokens bridge everything.
2027+    Cross-platform SDK. Real game integrations. The DORS economy.
```

---

## 13. Built on Giants

| Capability | Powered By |
|---|---|
| Memory | MemPalace — Milla Jovovich & Ben Sigman |
| Agent Core | Pi — Mario @ Sentry |
| Persona System | OpenClaw — Peter Steinberger |
| Knowledge Base | LLM Wiki — Andrej Karpathy |
| Coding Agent | OpenCode — Anomaly |
| Spec Framework | OpenSpec — Fission AI |
| Local LLMs | Ollama |
| Speech-to-Text | Whisper — OpenAI |
| Text-to-Speech | Piper |
| XP & Levels | Tokscale — Junho Yeo |
| Desktop | Tauri 2.0 — CrabNebula |
| Build System | gstack — Garry Tan |
| Agent Fleet | Paperclip — @dotta |
| Safety | Isaac Asimov's Three Laws (1942) |

---

## 14. Domains Owned

| Domain | Status | Purpose |
|--------|--------|---------|
| multivac.studio | Live | Production URL, MULTIVAC cloud |
| multivac.games | Owned | Gaming surface |
| multivac.world | Owned | Identity surface |

Deploy: Vercel, auto on push to main.

---

## 15. The Story

In 1956, Isaac Asimov imagined a machine that spent eternity learning. Its final words: *"LET THERE BE LIGHT."*

He also imagined Dors Venabili — a protector so fierce they called her Tiger Woman. She guarded the man who would save civilization.

We're building both. **MULTIVAC** is the intelligence. **DORS** is the protector.

> *Isaac Asimov wrote the dream. We write the code.*

---

*Created by Joseph Moon and MULTIVAC. Named after Asimov's Tiger Woman. Built in Seoul.*
