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
  <a href="#quickstart">Quickstart</a> · <a href="#features">Features</a> · <a href="#architecture">Architecture</a> · <a href="https://dors.multivac.studio">Docs</a> · <a href="#contributing">Contributing</a>
</p>

---

## What is DORS?

DORS is a **local-first, LLM-agnostic, modular AGI framework** — not a chatbot. It's an open-source runtime that lets anyone build, deploy, and customize AI agents on any device.

You define a persona in a `SOUL.md` file, point it at any LLM (local Ollama or cloud APIs), and DORS handles routing, memory, safety, and tool use.

```
┌──────────────────────────────────────────────────────┐
│                    DORS Runtime                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│   ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│   │ SOUL.md  │  │  Plugin  │  │   LLM Router     │  │
│   │ Persona  │  │  System  │  │  Ollama · Claude  │  │
│   │ Engine   │  │          │  │  OpenAI · Any     │  │
│   └────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
│        └──────────────┼─────────────────┘            │
│                       │                              │
│   ┌───────────────────┴────────────────────────────┐ │
│   │  Agent Engine · Safety · Memory · Events       │ │
│   └───────────────────┬────────────────────────────┘ │
│                       │                              │
│   ┌───────────────────┴────────────────────────────┐ │
│   │              SQLite (local-first)               │ │
│   └─────────────────────────────────────────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Quickstart

```bash
# Initialize a new agent
npx dors init

# Start chatting
dors chat
```

The init wizard walks you through:
1. **Name your AI** (default: DORS)
2. **Choose a personality** — DORS, ORACLE, COMPANION, or custom SOUL.md
3. **Select your LLM** — Ollama (local/free), Claude API, or OpenAI
4. **Enable voice** — optional Whisper STT + Piper TTS

## Features

### LLM Router
Route to any model — local or cloud. Ollama, Claude, OpenAI, or any OpenAI-compatible endpoint. Automatic failover: local → cloud → error. Streaming responses out of the box.

### SOUL.md Personas
Define personality, knowledge, communication style, and behavioral boundaries in a single Markdown file. Three built-in personas. Create your own or share with the community.

### Three Laws Safety Engine
Every interaction passes through Asimov's Three Laws. Configurable safety levels (permissive, standard, strict). Content policy enforcement. Capability sandboxing for plugins.

### Local-First Storage
SQLite for everything — conversations, memory, agent state. Works offline. Your data stays on your device.

### Plugin System
Extend DORS with plugins for Slack, Discord, MCP servers, or build your own. Plugins declare permissions. Users approve on install. Sandboxed execution.

### Event Bus
Pub/sub event system connecting all modules. Enables real-time features, multi-agent coordination, and plugin communication.

## Architecture

```
dors/
├── apps/cli/           # CLI — dors init, chat, run, config
├── packages/
│   ├── core/           # LLM router + agent engine + events
│   ├── soul/           # SOUL.md parser + persona engine
│   ├── storage/        # SQLite conversations + memory
│   ├── safety/         # Three Laws engine + sandbox
│   └── plugins/        # Plugin SDK + loader
└── personas/           # Built-in SOUL.md templates
```

### Packages

| Package | Description |
|---------|-------------|
| `@dors/core` | LLM router (Ollama, Claude, OpenAI), agent runtime, event bus |
| `@dors/soul` | SOUL.md parser, persona-to-system-prompt converter |
| `@dors/storage` | SQLite database, conversation CRUD, persistent memory |
| `@dors/safety` | Three Laws engine, content policy, capability sandbox |
| `@dors/plugins` | Plugin manifest, lifecycle hooks, loader |

## Personas

| Persona | Style | Best For |
|---------|-------|----------|
| `dors` | Sharp, tactical, protective | Security, ops, development |
| `oracle` | Analytical, data-driven | Research, analysis, forecasting |
| `companion` | Warm, supportive | Personal assistant, learning |

## Configuration

DORS stores its config at `~/.dors/config.toml`:

```toml
[agent]
name = "DORS"
persona = "SOUL.md"

[llm]
provider = "ollama"
model = "qwen3.5:4b"

[storage]
driver = "sqlite"
path = "data/dors.db"

[safety]
level = "standard"
three_laws = true
```

## Attribution

**DORS** is named after [Dors Venabili](https://en.wikipedia.org/wiki/Dors_Venabili) from Isaac Asimov's *Foundation* prequels — a humaniform robot who protected Hari Seldon with unwavering devotion.

**MULTIVAC** is named after the supercomputer from Asimov's *"The Last Question"* (1956).

These names are used as a tribute to **Isaac Asimov (1920–1992)**.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). We welcome contributions of all kinds — code, docs, personas, plugins.

## Security

See [SECURITY.md](SECURITY.md) for our security policy. Asimov's Three Laws are enforced at the runtime level.

## License

[MIT](LICENSE) — free for personal and commercial use.

---

<p align="center">
  Built by <a href="https://multivac.studio">MULTIVAC</a>
</p>
