<p align="center">
  <img src="assets/DORS_Final.png" alt="DORS — Dors Venabili" width="600">
</p>

<h1 align="center">DORS</h1>

<p align="center">
  <strong>The open-source AGI framework.</strong><br>
  Local-first. LLM-agnostic. Governed by the Three Laws.<br>
  Free forever.
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> &middot;
  <a href="#the-story">The Story</a> &middot;
  <a href="#architecture">Architecture</a> &middot;
  <a href="#the-three-laws">Three Laws</a> &middot;
  <a href="#personas">Personas</a> &middot;
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

---

## The Story

> *"She protected Hari Seldon so he could build psychohistory. Now she protects you so you can build your future."*

In Isaac Asimov's Foundation prequels, **Dors Venabili** is the Tiger Woman. Fiercely loyal. Brilliant. Witty. Secretly more capable than anyone realizes. She was assigned to protect Hari Seldon -- the mathematician who would save civilization -- and she did so with a devotion that transcended her programming.

**DORS** is her namesake. An open-source AGI framework that runs on your machine, uses any LLM, and answers to no one but you. Not a chatbot. Not a cloud service. A personal AI architecture you own completely.

**[MULTIVAC](https://multivac.studio)** thinks. DORS executes.

## The Three Laws

DORS is governed by Asimov's Three Laws of Robotics. This is not a marketing line. It is the foundation of every architectural decision.

> **1.** A robot may not injure a human being or, through inaction, allow a human being to come to harm.
>
> **2.** A robot must obey orders given by human beings except where such orders would conflict with the First Law.
>
> **3.** A robot must protect its own existence as long as such protection does not conflict with the First or Second Law.

In practice: content safety checks run on every message. Tool execution is sandboxed. Your data never leaves your device. Military use is prohibited. Forever.

## Quick Start

```bash
npx dors init      # Interactive setup wizard
npx dors chat      # Start talking to DORS
```

Or install globally:

```bash
pnpm add -g dors
dors init
dors chat
```

DORS works with **Ollama** locally (no API key needed), **Claude**, **OpenAI**, **Groq**, **Mistral**, or any OpenAI-compatible endpoint.

## Architecture

DORS follows the Pi principle: *context engineering > feature engineering.* Five lean packages. Four core tools. Everything else is an extension.

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

| Package | What it does |
|---------|-------------|
| **@dors/ai** | LLM provider abstraction with automatic failover routing |
| **@dors/core** | Agent loop, SOUL.md parser, SQLite storage, Three Laws safety, 4 tools (read, write, edit, bash) |
| **@dors/tui** | Terminal interface with streaming markdown rendering |
| **@dors/agent** | DORS agent factory with TOML config and headless SDK |
| **@dors/ext** | Extension system with lifecycle hooks and tool registration |
| **dors-ext-wiki** | LLM Wiki extension -- persistent, compounding knowledge base |

## The Four Tools

Like R. Daneel Olivaw -- the greatest robot ever built -- DORS achieves mastery through simplicity. Four tools, used precisely.

| Tool | Purpose |
|------|---------|
| `read` | Read any file |
| `write` | Write any file |
| `edit` | Edit by exact string replacement |
| `bash` | Execute shell commands |

Extensions add more. The core stays lean.

## Personas

Every DORS instance has a **SOUL.md** -- a markdown file that defines personality, not instructions. Models already know what they are through training. The SOUL defines *who* they are.

| Persona | Named After | Archetype |
|---------|------------|-----------|
| **DORS** | Dors Venabili | Tactical guardian -- sharp, protective, occasionally dry |
| **ORACLE** | The Psychohistorians | Analytical forecaster -- data-driven, precise, prophetic |
| **COMPANION** | Gaia consciousness | Supportive coach -- warm, patient, encouraging |

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

## LLM Wiki Extension

DORS ships with a built-in knowledge base extension based on [Andrej Karpathy's LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f). Instead of RAG, the LLM incrementally builds and maintains a persistent wiki of interlinked markdown pages. Knowledge compounds over time.

| Tool | What it does |
|------|-------------|
| `wiki_ingest` | Process a source document into the wiki |
| `wiki_query` | Search the wiki by keyword |
| `wiki_write` | Create or update wiki pages with frontmatter and wikilinks |
| `wiki_lint` | Health-check: orphans, stale pages, broken links |
| `wiki_status` | Dashboard of wiki stats |

Obsidian-compatible. Open `~/.dors/wiki/wiki/` as a vault.

## Configuration

```toml
# ~/.dors/config.toml

[identity]
name = "DORS"
persona = "dors"

[llm]
provider = "ollama"          # ollama | anthropic | openai
model = "qwen3:14b"

[llm.fallback]
provider = "anthropic"
model = "claude-sonnet-4-6"

[storage]
path = "~/.dors/data/dors.db"

[safety]
three_laws = true            # Non-negotiable
allow_shell = true
allow_network = false
```

## The Agent Fleet

DORS development is powered by a fleet of 14 AI agents, all named after Asimov characters. They are organized in a hierarchy that mirrors the Foundation universe.

| Agent | Character | Role |
|-------|-----------|------|
| **HARI** | Hari Seldon | CEO / Chief Architect |
| **SELDON** | Psychohistory lineage | CTO |
| **DANEEL** | R. Daneel Olivaw | Core Engineer |
| **GISKARD** | R. Giskard Reventlov | Voice Engineer |
| **FASTOLFE** | Dr. Han Fastolfe | Extension Engineer |
| **BALEY** | Elijah Baley | Head of Product |
| **GLADIA** | Gladia Delmarre | UX / Design |
| **PELORAT** | Janov Pelorat | Documentation |
| **DEMERZEL** | Eto Demerzel | Head of QA |
| **TREVIZE** | Golan Trevize | Test Engineer |
| **WANDA** | Wanda Seldon | Security Auditor |
| **BLISS** | Bliss of Gaia | Head of Growth |
| **NOVI** | Sura Novi | Community Manager |
| **ARKADY** | Arkady Darrell | Content Creator |

## Development

```bash
pnpm install       # Install dependencies
pnpm build         # Build all packages
pnpm test          # Run 83 tests across 18 files
pnpm lint          # Lint everything
pnpm typecheck     # TypeScript strict mode
```

## Milestones

- [x] **Milestone 1: Foundation** -- 5 packages, CLI, Ollama integration, 83 tests (21/21 issues closed)
- [ ] **Milestone 2: Voice + Extensions** -- Whisper STT, Piper TTS, extension hot-reload
- [ ] **Milestone 3: Launch** -- npm publish, Product Hunt, docs site, 100+ GitHub stars

## License

MIT -- free forever. That's the whole point.

## Credits

Created by **[Joseph Moon](https://instagram.com/MoonAsset)** and **[MULTIVAC](https://multivac.studio)**.

Named after Isaac Asimov's Tiger Woman. Built in Seoul.

> *"The last question was asked for the first time, half in jest, on May 21, 2061, at a time when humanity first stepped into the light."*
> -- Isaac Asimov, *The Last Question* (1956)
