<p align="center">
  <img src="assets/DORS_Final.png" alt="DORS — Dors Venabili" width="600">
</p>

# DORS

**Local-first, LLM-agnostic, modular AGI framework.**

Named after Dors Venabili — the Tiger Woman from Asimov's Foundation. Fiercely loyal, brilliant, witty, and secretly more capable than anyone realizes.

> DORS is NOT a chatbot. It's an open-source architecture anyone can install and build their own personal AI on top of.

## Features

- **Any Device** — Mac, Windows, Linux
- **Any LLM** — Ollama (local), Claude, OpenAI, Groq, Mistral
- **Offline First** — Local LLMs via Ollama, all data on your device
- **Customizable Personality** — SOUL.md system for persona definition
- **4 Core Tools** — read, write, edit, bash (Pi-inspired, benchmark-topping)
- **Extension System** — Hot-reload plugins, custom tools, custom UI
- **Privacy First** — All data stays on YOUR device
- **Governed by Asimov's Three Laws**

## Quick Start

```bash
# Install
npx dors init

# Start chatting
npx dors chat
```

Or install globally:

```bash
pnpm add -g dors
dors init
dors chat
```

## Architecture

```
┌─────────────────────────────────────────────┐
│                  dors CLI                     │
│              (Commander.js)                   │
├─────────────────────────────────────────────┤
│              @dors/agent                      │
│        (SOUL.md + config + agent)             │
├──────────┬──────────┬───────────┬────────────┤
│ @dors/ai │@dors/core│ @dors/tui │  @dors/ext │
│ LLM      │ Agent    │ Terminal  │  Extension │
│ Router   │ Loop +   │ Interface │  System    │
│ Ollama   │ Storage  │ Markdown  │  Hooks     │
│ Claude   │ Safety   │ Streaming │  Loader    │
│ OpenAI   │ Tools    │ Spinner   │  Registry  │
└──────────┴──────────┴───────────┴────────────┘
```

## Personas

DORS ships with three personas defined in `SOUL.md` files:

| Persona | Archetype | Style |
|---------|-----------|-------|
| **DORS** | Tactical guardian | Direct, confident, witty |
| **ORACLE** | Analytical forecaster | Measured, data-driven |
| **COMPANION** | Supportive coach | Warm, patient, encouraging |

Create your own by adding a `.soul.md` file to `~/.dors/personas/`.

## Configuration

```toml
# ~/.dors/config.toml

[identity]
name = "DORS"
persona = "dors"

[llm]
provider = "ollama"
model = "qwen3:14b"

[safety]
three_laws = true
allow_shell = true
allow_network = false
```

## Development

```bash
pnpm install
pnpm build
pnpm test
pnpm lint
```

## License

MIT — free forever.

## Credits

Built by [MULTIVAC](https://multivac.studio). Named after Asimov's Tiger Woman.
