# Contributing to DORS

Thanks for your interest in contributing to DORS.

## Development Setup

```bash
git clone https://github.com/multivac-os/dors.git
cd dors
pnpm install
pnpm build
```

## Project Structure

- `apps/cli` — CLI tool (`npx dors init/run/config`)
- `apps/web` — Dashboard and docs site
- `packages/core` — Core runtime (LLM router, agent engine)
- `packages/soul` — SOUL.md parser and persona engine
- `packages/voice` — Voice pipeline (Whisper + Piper)
- `packages/safety` — Three Laws safety engine
- `packages/storage` — SQLite + memory store
- `packages/plugins` — Plugin SDK and loader
- `plugins/` — Official plugins (Slack, Discord, MCP)
- `personas/` — Example SOUL.md personas

## Workflow

1. Fork the repo and create a branch from `main`
2. `pnpm install` to install dependencies
3. Make your changes
4. Add tests if applicable
5. Run `pnpm test` and `pnpm typecheck`
6. Open a pull request

## Commit Messages

We use conventional commits:

```
feat: add Ollama adapter to LLM router
fix: handle empty SOUL.md gracefully
docs: update quickstart guide
test: add persona parser tests
```

## Code Style

- TypeScript strict mode
- No `any` types without justification
- Functions under 50 lines
- Files under 400 lines

## Reporting Issues

Use [GitHub Issues](https://github.com/multivac-os/dors/issues). Include:
- DORS version (`npx dors --version`)
- Node.js version
- OS and architecture
- Steps to reproduce

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
