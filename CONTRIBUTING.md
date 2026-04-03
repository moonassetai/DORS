# Contributing to DORS

Thanks for your interest in DORS.

## Development Setup

```bash
git clone https://github.com/multivac-os/dors.git
cd dors
pnpm install
pnpm build
```

## Project Structure

- `apps/cli` — CLI tool (`dors init`, `dors chat`, `dors run`, `dors config`)
- `packages/core` — LLM router, agent engine, event bus
- `packages/soul` — SOUL.md parser and persona engine
- `packages/storage` — SQLite database, conversations, memory
- `packages/safety` — Three Laws engine, content policy, sandbox
- `packages/plugins` — Plugin SDK, lifecycle hooks, loader
- `personas/` — Built-in SOUL.md persona templates

## Workflow

1. Fork the repo and create a branch from `main`
2. `pnpm install`
3. Make your changes
4. `pnpm test` — run tests
5. `pnpm typecheck` — type check
6. `pnpm lint` — lint
7. Open a pull request

## Commit Messages

```
feat: add Ollama adapter to LLM router
fix: handle empty SOUL.md gracefully
docs: update quickstart guide
test: add persona parser edge cases
```

## Code Style

- TypeScript strict mode
- 2-space indentation
- ESM modules
- Functional where possible, classes for providers
- Every package exports from `src/index.ts`

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
