<p align="center">
  <img src="assets/DORS_Final.png" alt="DORS" width="480">
</p>

<h1 align="center">DORS</h1>

<p align="center">
  <strong>Open-source AGI framework.</strong><br>
  Your AI. Your device. Your rules.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-7C3AED?style=flat-square" alt="MIT License"></a>
  <a href="https://github.com/moonassetai/DORS"><img src="https://img.shields.io/badge/version-0.1.0-7C3AED?style=flat-square" alt="Version"></a>
  <a href="https://github.com/moonassetai/DORS"><img src="https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square" alt="TypeScript"></a>
  <a href="https://github.com/moonassetai/DORS"><img src="https://img.shields.io/badge/runtime-Bun-f472b6?style=flat-square" alt="Bun"></a>
</p>

<p align="center">
  <a href="#why-dors">Why DORS</a> ·
  <a href="#quick-start">Quick Start</a> ·
  <a href="#desktop-app">Desktop App</a> ·
  <a href="#xp--levels">XP & Levels</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#extensions">Extensions</a> ·
  <a href="#soul-system">SOUL.md</a> ·
  <a href="#the-three-laws">Three Laws</a> ·
  <a href="#roadmap">Roadmap</a> ·
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

---

## Why DORS

DORS is not a chatbot. It's a **modular AGI framework** — install it on any device, connect any LLM, customize the personality, and own your AI completely. Local-first, privacy-first, free forever.

- **Any device** — Mac, Windows, Linux, iOS, Android
- **Any LLM** — Ollama (local/offline), Claude, OpenAI, Groq, Mistral, or any OpenAI-compatible endpoint
- **Any platform** — Slack, Telegram, Discord bridges
- **Customizable personality** — SOUL.md defines *who* your AI is, not just what it does
- **Agent fleets** — orchestrate 25 AI agents via [Paperclip](https://github.com/paperclipai/paperclip)
- **Voice** — Whisper STT + Piper TTS, fully offline
- **Privacy** — all data stays on your device
- **Governed by [Asimov's Three Laws](#the-three-laws)** — ethical AI since 1942

> Named after **Dors Venabili** — the Tiger Woman from Isaac Asimov's Foundation prequels.
> She guarded the man who would save civilization. DORS guards you.

---

## Quick Start

**CLI (terminal)**
```bash
npx dors init      # Interactive setup wizard
npx dors chat      # Start talking to DORS
```

**Desktop App (one-click)**
```bash
npx dors desktop   # Launch DORS desktop app (Tauri 2.0)
```

The wizard lets you name your AI, pick a personality, choose an LLM provider, and optionally enable voice. Under a minute.

---

## Desktop App

DORS ships a native desktop app built with [Tauri 2.0](https://v2.tauri.app). One binary. ~5MB. Mac, Windows, Linux.

```
apps/
  cli/       — Terminal interface (npx dors)
  desktop/   — Tauri 2.0 native app (npx dors desktop)
```

The desktop app wraps the same @dors/core, @dors/agent, and @dors/ai packages as the CLI. Same SOUL.md personality. Same Three Laws governance. Same extensions. Just a native window instead of a terminal.

**Why Tauri 2.0:**
- ~5MB binary (not 200MB Electron)
- Native webview (WebKit on Mac, WebView2 on Windows, WebKitGTK on Linux)
- Rust backend with TypeScript/HTML frontend
- iOS and Android support built-in (Tauri 2.0 mobile)
- System tray, notifications, file system access, auto-updater

**Stack:**
- Backend: Tauri 2.0 (Rust) + Bun sidecar for @dors/core
- Frontend: HTML + CSS + vanilla JS (Bun.serve pattern, no React)
- IPC: Tauri commands bridge Rust to the Bun-powered agent loop
- Build: `pnpm tauri build` produces `.dmg` (Mac), `.msi` (Windows), `.AppImage` (Linux)

---

## XP & Levels

DORS has a built-in leveling system. The more you use DORS, the more capabilities it unlocks. Trust is earned, not given.

### How It Works

Your AI usage becomes XP. Every interaction with DORS, every token consumed across your AI coding agents, feeds into your level. XP tracking is powered by [Tokscale](https://github.com/junhoyeo/tokscale).

```
[DANEEL] Level 12 ████████░░░░░░░ 1,680/2,300 XP to next
  Next unlock: Shell commands (Level 15)
  Total XP: 8,923 | Today: +4,200
```

### Capability Unlocks

Higher levels unlock more powerful DORS capabilities. The Three Laws govern every unlock.

| Level | Capability | What You See |
|-------|-----------|-------------|
| 1 | Basic chat | No prompt |
| 5 | Read local files | "Allow DORS to read [path]? [y/n]" |
| 10 | Draft emails, documents | Draft shown, never auto-sent |
| 15 | Execute shell commands | Command preview, explicit confirm |
| 20 | Send emails | Full preview, explicit confirm |
| 30 | Financial actions | Type 'CONFIRM' for critical actions |
| 50 | Agent fleet coordination | Multi-step plan review |

### Exp Curves

Leveling follows exponential progression inspired by classic MMORPG design. Early levels are fast. Late levels require serious commitment.

```
xp_required(level) = floor(100 * 1.18 ^ level)
```

| Level | XP Required | Days at 5K XP/day |
|-------|------------|-------------------|
| 1 | 100 | <1 |
| 10 | 523 | <1 |
| 20 | 2,731 | ~4 |
| 30 | 14,249 | ~21 |
| 50 | 388,118 | ~410 |

### Agent Classes

Every Asimov agent has a class. Classes determine skill trees and specialization.

| Class | Agent | Focus |
|-------|-------|-------|
| Warrior | DANEEL | Code execution, system operations |
| Magician | SELDON | Planning, prediction, strategy |
| Bowman | CALVIN | Precision tools, code review |
| Thief | BALEY | Investigation, user research |
| Pirate | MALLOW | Trading, finance, commerce |

Classes follow a 4-tier advancement system:
- **1st Job** (Level 10): Basic class skills
- **2nd Job** (Level 30): Multi-tool combos
- **3rd Job** (Level 70): Agent coordination
- **4th Job** (Level 120): Fleet orchestration

### Token Economy

Tokens are internal points (not cryptocurrency). They flow across three surfaces:

| Surface | Domain | Purpose |
|---------|--------|---------|
| **Product** | [multivac.studio](https://multivac.studio) | MULTIVAC cloud, voice AI |
| **Gaming** | multivac.games | AI challenges, class quests |
| **Identity** | multivac.world | Trust profile, leaderboard, portable reputation |

Gaming earns tokens. Tokens unlock real-world DORS capabilities. Real-world actions earn more tokens. The AI agent is the bridge.

---

## Architecture

Five packages. Four core tools. Minimal by design.

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
└───────────┴───────────┴───────────┴─────────────┘
```

| Package | Purpose |
|---------|---------|
| **@dors/ai** | LLM provider abstraction — Ollama, Claude, OpenAI, Groq, Mistral |
| **@dors/core** | Agent loop, tool execution, SQLite storage, safety engine |
| **@dors/tui** | Terminal interface (< 1000 lines) |
| **@dors/agent** | DORS agent factory — SOUL.md + personality + tools |
| **@dors/ext** | Extension system — hot-reload, custom tools, marketplace |

### Project Structure

```
apps/cli/          CLI entry point (init, chat, run, config)
packages/
  ai/              LLM providers + router + failover
  core/            Agent loop, tools, storage, safety, SOUL parser
  tui/             Terminal interface
  agent/           DORS agent factory + headless SDK
  ext/             Extension system + registry
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
docs/              Internal docs (fleet roster, issue tracker, lore)
scripts/           Dev scripts
```

---

## Extensions

DORS ships with 8 extensions (32 tools) for running a 1-person business from the terminal.

| Extension | Tools | Purpose |
|-----------|-------|---------|
| **dors-ext-code** | `code_spec` `code_develop` `code_review` `code_analyze` | AI coding with OpenCode + OpenSpec |
| **dors-ext-email** | `email_triage` `email_draft` `email_send` `email_search` | Email triage, drafting, scheduling |
| **dors-ext-calendar** | `calendar_schedule` `calendar_availability` `calendar_prep` `calendar_timeblock` | Schedule management + time blocking |
| **dors-ext-finance** | `finance_invoice` `finance_expense` `finance_revenue` `finance_dashboard` | Invoices, expenses, revenue tracking |
| **dors-ext-web** | `web_browse` `web_search` `web_research` `web_monitor` | Research, browsing, competitor monitoring |
| **dors-ext-social** | `social_draft` `social_schedule` `social_analytics` `social_calendar` | Content creation + scheduling |
| **dors-ext-docs** | `docs_generate` `docs_template` `docs_export` `docs_review` | Contracts, proposals, SOWs, NDAs |
| **dors-ext-crm** | `crm_contacts` `crm_deals` `crm_followup` `crm_insights` | Contacts, deals, pipeline |

Plus built-in **dors-ext-wiki** for compounding knowledge ([Karpathy pattern](https://karpathy.ai)).

### Approval Gates

DORS follows the Three Laws — not all actions are created equal.

| Risk | Examples | Behavior |
|------|----------|----------|
| Low | Read files, search, analyze | Auto-execute |
| Medium | Write files, edit code, run commands | Auto-execute (configurable) |
| High | Send emails, post to social, schedule meetings | **Requires approval** |
| Critical | Send invoices, make payments, deploy to production | **Always requires approval** |

---

## Soul System

Every DORS instance has a **SOUL.md** — a markdown file that defines personality, not instructions. Models already know *what* they are. The SOUL defines *who* they are.

| Persona | Named After | Archetype |
|---------|------------|-----------|
| **DORS** | Dors Venabili | Tactical guardian — sharp, protective, occasionally dry |
| **ORACLE** | The Psychohistorians | Analytical forecaster — data-driven, precise, prophetic |
| **COMPANION** | Gaia consciousness | Supportive coach — warm, patient, encouraging |

Create your own — drop a `.soul.md` in `~/.dors/personas/`:

```markdown
# Identity
name: SELDON
archetype: The mathematician who sees the future
voice: Calm, certain, speaks in probabilities
laws: asimov

# Personality
- Prophetic: sees patterns before they emerge
- Patient: thinks in centuries, not minutes
- Humble: knowledge of the future is a burden, not a gift
```

---

## The Agent Fleet

DORS development is powered by 25 AI agents, all named after Asimov characters, orchestrated by [Paperclip](https://github.com/paperclipai/paperclip). Full roster in [`docs/FLEET.md`](docs/FLEET.md).

<details>
<summary><strong>View fleet roster</strong></summary>

| Agent | Character | Role |
|-------|-----------|------|
| **HARI** | Hari Seldon | CEO / Chief Architect |
| **SELDON** | Psychohistory lineage | CTO |
| **DANEEL** | R. Daneel Olivaw | Core Engineer |
| **CALVIN** | Susan Calvin | Code/Dev Tools Lead |
| **BRANNO** | Harla Branno | DevOps/Infrastructure |
| **PALVER** | Preem Palver | Integration/API |
| **GENDIBAL** | Stor Gendibal | Data/Analytics |
| **GISKARD** | R. Giskard Reventlov | Voice Engineer |
| **FASTOLFE** | Dr. Han Fastolfe | Extension Engineer |
| **BALEY** | Elijah Baley | Head of Product |
| **GLADIA** | Gladia Delmarre | UX / Design |
| **CHANNIS** | Bail Channis | Email Agent |
| **ANDREW** | Andrew Martin | Calendar/Schedule |
| **MIS** | Ebling Mis | Web Research |
| **DORNICK** | Gaal Dornick | Legal/Docs |
| **HARDIN** | Salvor Hardin | CRM/Sales |
| **MALLOW** | Hober Mallow | Finance/CFO |
| **DEMERZEL** | Eto Demerzel | Head of QA |
| **TREVIZE** | Golan Trevize | Test Engineer |
| **WANDA** | Wanda Seldon | Security Auditor |
| **BLISS** | Bliss of Gaia | Head of Growth |
| **JANDER** | Jander Panell | Social Media |
| **PELORAT** | Janov Pelorat | Documentation |
| **NOVI** | Sura Novi | Community Manager |
| **ARKADY** | Arkady Darrell | Content Creator |

</details>

---

## The Ecosystem

```
DORS (free, open source) ──── Build your own AI
  │
  ├── CLI ──────────── Terminal interface (npx dors)
  ├── Desktop ──────── Tauri 2.0 native app (Mac/Win/Linux)
  ├── Extensions ───── 8 built-in + community plugins
  ├── XP & Levels ──── Tokscale-powered progression
  │
  ├── multivac.studio ── MULTIVAC Cloud (voice AI, premium features)
  ├── multivac.games ─── Gaming surface (AI challenges, class quests)
  └── multivac.world ─── Identity (trust profile, leaderboard, reputation)
```

**Three domains. One token system. One identity.**

---

## The Three Laws

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

**Never military use. Hardcoded. Cannot be overridden.**

---

## Development

```bash
pnpm install       # Install dependencies
pnpm build         # Build all packages
pnpm test          # Run all tests
pnpm lint          # Lint everything
pnpm typecheck     # TypeScript strict mode
```

### Milestones

- [x] **v0.1 Foundation** — 15 packages, CLI, Ollama integration, 198 tests, 25 agents
- [ ] **v0.2 Solopreneur MVP** — 3 real API integrations (Gmail, Calendar, Stripe), approval gate in TUI, setup wizard
- [ ] **v0.3 XP & Levels** — Tokscale integration, exp curves, level-gated capabilities, @dors/xp package
- [ ] **v0.4 Desktop** — Tauri 2.0 native app, one-click install, system tray
- [ ] **v0.5 Voice** — Whisper STT + Piper TTS, fully offline, ElevenLabs cloud option
- [ ] **v1.0 Launch** — npm publish, Product Hunt, docs site at multivac.world

---

## Roadmap

### Stage 1: The Framework (now)

Ship DORS as a working AGI framework. CLI and desktop. Real extensions, not stubs. XP bar with tokscale integration.

**Timeline:** Q2 2026

| Milestone | Target | Status |
|-----------|--------|--------|
| v0.1 Foundation | Done | :white_check_mark: |
| v0.2 Solopreneur MVP | May 2026 | :construction: |
| v0.3 XP & Levels | May 2026 | :construction: |
| v0.4 Desktop (Tauri 2.0) | Jun 2026 | Planned |
| v0.5 Voice | Jun 2026 | Planned |
| v1.0 Launch | Jul 2026 | Planned |

### Stage 2: The Gaming Bridge (multivac.games)

Asimov agents become playable character classes. AI challenges, skill trees, cross-platform quests. Tokens earned in-game unlock real-world DORS capabilities.

**Timeline:** Q3 2026

| Feature | Description |
|---------|-------------|
| Agent Classes | 5 Asimov agents as MMORPG classes (Warrior, Magician, Bowman, Thief, Pirate) |
| Skill Trees | 4-tier job advancement per class (Level 10/30/70/120) |
| AI Challenges | Browser-based prompt engineering and debugging quests |
| Cross-Platform | SDK for connecting to external games |
| Leaderboard | Global rankings at multivac.world |

### Stage 3: The World (multivac.world)

Portable identity. Your DORS level, reputation, and capabilities travel with you. Across games, across tools, across platforms.

**Timeline:** Q4 2026

| Feature | Description |
|---------|-------------|
| Trust Profile | Public identity page showing level, class, history |
| Portable Reputation | API for third-party apps to read your DORS identity |
| Token Bridge | Internal tokens flow between gaming, product, and identity surfaces |
| DAO Governance | Community-governed token economics (Asimov's Three Laws applied to governance) |

### The Vision

```
2026 Q2  DORS ships. CLI + Desktop. XP bar. Real extensions.
2026 Q3  multivac.games launches. Agents become characters. Gaming earns tokens.
2026 Q4  multivac.world launches. Portable identity. Tokens bridge everything.
2027+    Cross-platform SDK. Real game integrations. The DORS economy.
```

---

## Built on Giants

| Capability | Powered By |
|---|---|
| Memory | [MemPalace](https://github.com/milla-jovovich/mempalace) — Milla Jovovich & Ben Sigman |
| Agent Core | [Pi](https://github.com/badlogic/pi-mono) — Mario @ Sentry |
| Persona System | [OpenClaw](https://github.com/openclaw/openclaw) — Peter Steinberger |
| Knowledge Base | LLM Wiki — Andrej Karpathy |
| Coding Agent | [OpenCode](https://github.com/anomalyco/opencode) — Anomaly |
| Spec Framework | [OpenSpec](https://github.com/Fission-AI/OpenSpec) — Fission AI |
| Local LLMs | [Ollama](https://ollama.ai) |
| Speech-to-Text | [Whisper](https://github.com/openai/whisper) — OpenAI |
| Text-to-Speech | [Piper](https://github.com/rhasspy/piper) |
| XP & Levels | [Tokscale](https://github.com/junhoyeo/tokscale) — Junho Yeo |
| Desktop | [Tauri 2.0](https://v2.tauri.app) — CrabNebula |
| Build System | [gstack](https://github.com/garrytan/gstack) — Garry Tan |
| Agent Fleet | [Paperclip](https://github.com/paperclipai/paperclip) — @dotta |
| Safety | Isaac Asimov's Three Laws (1942) |

---

## The Story

In 1956, Isaac Asimov imagined a machine that spent eternity learning.
Its final words: *"LET THERE BE LIGHT."*

He also imagined Dors Venabili — a protector so fierce they called her Tiger Woman.
She guarded the man who would save civilization.

We're building both. **MULTIVAC** is the intelligence. **DORS** is the protector.

<p align="center">
  <a href="https://www.youtube.com/watch?v=vp8qL6kfjQs">
    <img src="https://img.youtube.com/vi/vp8qL6kfjQs/maxresdefault.jpg" alt="To The Moon" width="480">
  </a>
  <br>
  <em>To The Moon</em>
</p>

> *"The Last Question"* first appeared in *Science Fiction Quarterly*, November 1956.
> Asimov called it his favorite story. Dors Venabili appears in
> [Prelude to Foundation](https://www.amazon.com/Prelude-Foundation-Isaac-Asimov/dp/0553278398) and
> [Forward the Foundation](https://www.amazon.com/Forward-Foundation-Isaac-Asimov/dp/0553565079).

---

## License

**MIT** — free forever. That's the whole point.

---

<p align="center">
  Created by <a href="https://instagram.com/MoonAsset"><strong>Joseph Moon</strong></a> and <a href="https://multivac.studio"><strong>MULTIVAC</strong></a>.<br>
  Named after Isaac Asimov's Tiger Woman. Built in Seoul.<br><br>
  <em>Isaac Asimov wrote the dream. We write the code.</em><br>
  <strong>"LET THERE BE LIGHT."</strong>
</p>
