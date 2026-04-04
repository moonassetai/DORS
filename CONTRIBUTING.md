# Contributing to DORS

Thanks for your interest in DORS! Here's how to get started.

## Development Setup

```bash
# Clone the repo
git clone https://github.com/multivac-os/dors.git
cd dors

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint
```

## Project Structure

```
packages/
  ai/      — LLM provider abstraction (@dors/ai)
  core/    — Agent loop, storage, safety (@dors/core)
  tui/     — Terminal interface (@dors/tui)
  agent/   — DORS agent configuration (@dors/agent)
  ext/     — Extension system (@dors/ext)
apps/
  cli/     — CLI entry point (dors command)
personas/  — SOUL.md personality files
```

## Guidelines

- TypeScript strict mode
- ESM modules
- 2-space indent
- Vitest for testing (80%+ coverage)
- Conventional commits (feat:, fix:, refactor:, etc.)

## Adding an LLM Provider

1. Create a new provider in `packages/ai/src/providers/`
2. Extend `BaseProvider`
3. Implement `chat()` and `isAvailable()`
4. Export from `packages/ai/src/index.ts`

## Creating an Extension

1. Create a package with `Extension` interface
2. Implement `activate()`, `deactivate()`, and optional hooks
3. Load via `ExtensionLoader.loadFromPath()`

## License

MIT — free forever.
