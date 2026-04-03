<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dors-logo-dark.svg">
    <img alt="DORS" src="docs/assets/dors-logo-light.svg" width="200">
  </picture>
</p>

<h1 align="center">DORS</h1>

<p align="center">
  <strong>Open-source AGI framework. Born from Asimov, built by MULTIVAC.</strong>
</p>

<p align="center">
  <a href="https://github.com/multivac-os/dors/actions"><img src="https://img.shields.io/github/actions/workflow/status/multivac-os/dors/ci.yml?branch=main&style=flat" alt="CI"></a>
  <a href="https://github.com/multivac-os/dors/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat" alt="License"></a>
  <a href="https://www.npmjs.com/package/dors"><img src="https://img.shields.io/npm/v/dors?style=flat&color=7C3AED" alt="npm"></a>
</p>

<p align="center">
  <a href="#quickstart">Quickstart</a> · <a href="#features">Features</a> · <a href="https://dors.multivac.studio">Docs</a> · <a href="#contributing">Contributing</a>
</p>

---

## What is DORS?

DORS is a **local-first, LLM-agnostic, modular AGI framework**. It gives any AI persona a runtime — memory, voice, safety rails, and the ability to act in the real world through plugins.

Think of it as an operating system for AI agents. You define a persona in a `SOUL.md` file, point it at any LLM (local or cloud), and DORS handles the rest: routing, memory, safety, voice I/O, and tool use.

```
┌──────────────────────────────────────────────────────┐
│                      YOUR APP                        │
├──────────────────────────────────────────────────────┤
│                                                      │
│   ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│   │ SOUL.md  │  │  Plugins │  │   LLM Router     │  │
│   │ Persona  │  │  Slack   │  │  Ollama · Claude  │  │
│   │ Engine   │  │  Discord │  │  OpenAI · Local   │  │
│   │          │  │  MCP     │  │                   │  │
│   └────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
│        │              │                 │            │
│   ┌────┴──────────────┴─────────────────┴─────────┐  │
│   │              DORS Core Runtime                 │  │
│   │     Agent Engine · Memory · Safety · Voice     │  │
│   └────────────────────────────────────────────────┘  │
│                                                      │
│   ┌────────────────────────────────────────────────┐  │
│   │              Storage (SQLite)                   │  │
│   │         Conversations · Memory · State          │  │
│   └────────────────────────────────────────────────┘  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Quickstart

```bash
npx dors init my-agent
cd my-agent
npx dors run
```

This scaffolds a new agent with:
- A default `SOUL.md` persona
- SQLite storage
- Ollama as the default LLM (falls back to Claude API)
- A terminal chat interface

## Features

### LLM Router
Route to any model — local or cloud. Ollama, Claude, OpenAI, or bring your own. Automatic fallback chains. Cost-aware routing keeps your API bill under control.

### SOUL.md Personas
Define an AI's personality, communication style, knowledge boundaries, and behavioral rules in a single Markdown file. Hot-reload — edit the file, the persona updates instantly.

### Three Laws Safety Engine
Every action passes through Asimov's Three Laws before execution. Configurable safety levels. Sandboxed tool execution. Audit logs for every decision.

### Voice Pipeline
Whisper STT (local) → LLM → Piper TTS (local). Fully offline voice conversations. No cloud dependency for voice.

### Plugin System
Extend DORS with plugins for Slack, Discord, MCP servers, or build your own. Plugins are npm packages with a simple interface.

### Local-First Storage
SQLite for everything. Conversations, memory, agent state. Works offline. Optional cloud sync via Supabase.

## Project Structure

```
dors/
├── apps/cli          # npx dors init/run/config
├── apps/web          # Dashboard (dors.multivac.studio)
├── packages/core     # Runtime engine + LLM router
├── packages/soul     # SOUL.md parser + persona engine
├── packages/voice    # Whisper STT + Piper TTS
├── packages/safety   # Three Laws engine
├── packages/storage  # SQLite + memory store
├── packages/plugins  # Plugin SDK
├── plugins/          # Official plugins (Slack, Discord, MCP)
└── personas/         # Example SOUL.md personas
```

## Personas

DORS ships with example personas you can use or customize:

| Persona | Style | Best For |
|---------|-------|----------|
| `dors` | Sharp, tactical, protective | Security, ops, trading |
| `oracle` | Analytical, data-driven | Research, analysis |
| `companion` | Warm, supportive | Personal assistant |

Create your own:

```bash
npx dors init --persona my-agent
# Edit personas/my-agent.soul.md
npx dors run --persona my-agent
```

## Attribution

DORS is named after **Dors Venabili** from Isaac Asimov's *Foundation* series — a humaniform robot who protected Hari Seldon with unwavering devotion and brilliance that exceeded everyone's expectations.

MULTIVAC is named after the supercomputer from Asimov's *"The Last Question"* (1956) — the machine that outlasts the universe to answer humanity's final question.

These names are used as a tribute to **Isaac Asimov (1920–1992)**, whose vision of benevolent artificial intelligence continues to inspire.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Security

See [SECURITY.md](SECURITY.md) for our security policy and how to report vulnerabilities.

## License

[MIT](LICENSE) — free for personal and commercial use.

---

<p align="center">
  Built by <a href="https://multivac.studio">MULTIVAC</a> · <a href="https://github.com/multivac-os/dors">github.com/multivac-os/dors</a>
</p>
