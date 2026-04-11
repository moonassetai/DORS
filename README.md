<p align="center">
  <img src="assets/DORS_Final.png" alt="DORS — Dors Venabili" width="600">
</p>

<h1 align="center">DORS</h1>

<p align="center">
  <strong>The open-source AGI framework.</strong><br>
  Your AI. Your device. Your rules.<br>
  Free forever.
</p>

<p align="center">
  <a href="#what-dors-is">What It Is</a> &middot;
  <a href="#quick-start">Quick Start</a> &middot;
  <a href="#architecture">Architecture</a> &middot;
  <a href="#built-on-giants">Credits</a> &middot;
  <a href="#the-three-laws">Three Laws</a> &middot;
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

---

In 1956, Isaac Asimov imagined a machine that spent eternity learning.
Its final words: *"LET THERE BE LIGHT."*

He also imagined Dors Venabili — a protector so fierce they called her Tiger Woman.
She guarded the man who would save civilization.

We're building both. MULTIVAC is the intelligence. DORS is the protector.
And DORS is free.

> *"The Last Question"* first appeared in *Science Fiction Quarterly*, November 1956.
> Asimov called it his favorite story. Available in
> [Robot Dreams](https://www.amazon.com/Robot-Dreams-Isaac-Asimov/dp/0441731546) and
> [The Complete Stories, Vol. 1](https://www.amazon.com/Complete-Stories-Vol-Isaac-Asimov/dp/0385416273).
> Dors Venabili appears in
> [Prelude to Foundation](https://www.amazon.com/Prelude-Foundation-Isaac-Asimov/dp/0553278398) and
> [Forward the Foundation](https://www.amazon.com/Forward-Foundation-Isaac-Asimov/dp/0553565079).

---

## What DORS Is

DORS is not a chatbot. It is an open-source AGI framework — a complete architecture for building personal AI agents that run on your machine, use any LLM, and answer to no one but you. Install it. Customize it. Own it. Your AI, your device, your rules.

## Quick Start

```bash
npx dors init      # Interactive setup wizard
npx dors chat      # Start talking to DORS
```

DORS works with **Ollama** locally (no API key needed), **Claude**, **OpenAI**, **Groq**, **Mistral**, or any OpenAI-compatible endpoint.

## Architecture

Five core packages. Four tools. Eight extensions. Everything a 1-person corporation needs.

```
┌─────────────────────────────────────────────────┐
│                    dors CLI                       │
│         init / chat / run / config                │
├─────────────────────────────────────────────────┤
│                  @dors/agent                      │
│          SOUL.md persona + config                 │
├───────────┬───────────┬───────────┬──────────────┤
│  @dors/ai │ @dors/core│ @dors/tui │  @dors/ext   │
│           │           │           │              │
│  Ollama   │ Agent     │ Terminal  │  Extensions  │
│  Claude   │ Loop      │ Chat +    │  Hooks       │
│  OpenAI   │ 4 Tools   │ Markdown  │  Custom      │
│  Router   │ Storage   │ Streaming │  Tools       │
│  Failover │ Safety    │ Spinner   │  Registry    │
└───────────┴───────────┴───────────┴──────────────┘
```

| Package | What It Does |
|---------|-------------|
| `@dors/ai` | LLM provider abstraction (Claude, Ollama, OpenAI, Groq, Mistral) |
| `@dors/core` | Agent loop + tool execution + storage + safety |
| `@dors/tui` | Terminal interface (minimal, <1000 lines) |
| `@dors/agent` | The DORS agent (SOUL.md + personality + tools) |
| `@dors/ext` | Extension system (hot-reload, custom tools, marketplace) |

## Extensions — Run a 1-Person Corporation

DORS ships with 8 extensions providing 32 tools for running an entire business from the terminal.

| Extension | Tools | What It Does |
|---|---|---|
| `dors-ext-code` | `code_spec` `code_develop` `code_review` `code_analyze` | Free coding with OpenCode + OpenSpec |
| `dors-ext-email` | `email_triage` `email_draft` `email_send` `email_search` | Email triage, drafting, scheduling |
| `dors-ext-calendar` | `calendar_schedule` `calendar_availability` `calendar_prep` `calendar_timeblock` | Schedule management + time blocking |
| `dors-ext-finance` | `finance_invoice` `finance_expense` `finance_revenue` `finance_dashboard` | Invoices, expenses, revenue tracking |
| `dors-ext-web` | `web_browse` `web_search` `web_research` `web_monitor` | Research, browsing, competitor monitoring |
| `dors-ext-social` | `social_draft` `social_schedule` `social_analytics` `social_calendar` | Content creation + scheduling |
| `dors-ext-docs` | `docs_generate` `docs_template` `docs_export` `docs_review` | Contracts, proposals, SOWs, NDAs |
| `dors-ext-crm` | `crm_contacts` `crm_deals` `crm_followup` `crm_insights` | Contacts, deals, pipeline |

Plus the built-in `dors-ext-wiki` for compounding knowledge (Karpathy pattern).

### Approval Gates (Three Laws Compliance)

Not all actions are created equal. DORS auto-executes low-risk actions (reading files, analyzing code) but pauses for human approval on:

| Risk Level | Examples | Behavior |
|---|---|---|
| **Low** | Read files, search, analyze | Auto-execute |
| **Medium** | Write files, edit code, run commands | Auto-execute (configurable) |
| **High** | Send emails, post to social media, schedule meetings | **Requires approval** |
| **Critical** | Send invoices, make payments, deploy to production | **Always requires approval** |

## Built on Giants

| Capability | Powered By | Why |
|---|---|---|
| Memory | MemPalace (Milla Jovovich & Ben Sigman) | Palace architecture, 170-token wake-up, verbatim storage, zero API cost |
| Agent Core | Pi (Mario @ Sentry) | Minimal extensible core, 4-tool philosophy, benchmark-topping simplicity |
| Persona System | OpenClaw (Peter Steinberger) | SOUL.md pattern, persona-as-file |
| Knowledge Base | LLM Wiki (Andrej Karpathy) | Incremental wiki, compounding knowledge, Obsidian-compatible |
| Coding Agent | OpenCode (Anomaly) | Provider-agnostic AI coding, build + plan modes, MIT licensed |
| Spec Framework | OpenSpec (Fission AI) | Specification-driven development, requirement tracking |
| Local LLMs | Ollama | Run any model locally, offline, private |
| Speech-to-Text | Whisper (OpenAI) | Offline transcription via whisper.cpp |
| Text-to-Speech | Piper TTS | Free, offline, 20+ voices |
| Build System | gstack (Garry Tan) | CEO-to-QA pipeline, /ship, /review, /document-release |
| Agent Fleet | Paperclip (@dotta) | Multi-agent orchestration, org charts, budgets, heartbeat protocol |
| Safety | Isaac Asimov's Three Laws | Ethical AI governance since 1942 |
| Monorepo | Turborepo + pnpm | Parallel builds, caching, workspace management |
| Runtime | Bun + TypeScript | Fast, modern, cross-platform |

## SOUL.md — Your AI's Personality

Every DORS instance has a **SOUL.md** — a markdown file that defines personality, not instructions. Models already know what they are. The SOUL defines *who* they are.

| Persona | Named After | Archetype |
|---------|------------|-----------|
| **DORS** | Dors Venabili | Tactical guardian — sharp, protective, occasionally dry |
| **ORACLE** | The Psychohistorians | Analytical forecaster — data-driven, precise, prophetic |
| **COMPANION** | Gaia consciousness | Supportive coach — warm, patient, encouraging |

Create your own: drop a `.soul.md` file in `~/.dors/personas/`.

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

## The Ecosystem

```
DORS (free, open source) ──── Build your own AI
        │
        ├── Extensions ──── Community plugins, voice, gaming, trading
        │
        └── MULTIVAC Cloud ──── Premium upgrade (optional, never required)
                                multivac.studio
```

You can build your own MULTIVAC with this framework. That's the entire point.

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

Never military use. Hardcoded. Cannot be overridden.

## Development

```bash
pnpm install       # Install dependencies
pnpm build         # Build all packages
pnpm test          # Run all tests
pnpm lint          # Lint everything
pnpm typecheck     # TypeScript strict mode
```

## Milestones

- [x] **Milestone 1: Foundation** — 5 packages, CLI, Ollama integration, 83 tests
- [ ] **Milestone 2: Voice + Extensions** — Whisper STT, Piper TTS, extension hot-reload
- [ ] **Milestone 3: Launch** — npm publish, Product Hunt, docs site

## Credits — Standing on Giants

- **Isaac Asimov (1920–1992)** — Who imagined all of this first
- **Milla Jovovich & Ben Sigman** — MemPalace: memory that never forgets
- **Mario (Sentry)** — Pi: proving minimal beats complex
- **Peter Steinberger** — OpenClaw: the soul file pattern
- **Andrej Karpathy** — LLM Wiki: knowledge that compounds
- **@dotta** — Paperclip: agent fleets as autonomous companies
- **Anomaly team** — OpenCode: free coding for everyone
- **Fission AI** — OpenSpec: specs before code
- **Garry Tan** — gstack: the open-source software factory
- **The Ollama team** — Local LLMs for everyone
- **The Whisper & Piper communities** — Voice without the cloud
- **The Bun, Turborepo, and pnpm teams** — Modern build infrastructure

## License

MIT — free forever. That's the whole point.

---

Created by **[Joseph Moon](https://instagram.com/MoonAsset)** and **[MULTIVAC](https://multivac.studio)**.

Named after Isaac Asimov's Tiger Woman. Built in Seoul.

> Isaac Asimov wrote the dream. We write the code.
>
> *"LET THERE BE LIGHT."*
