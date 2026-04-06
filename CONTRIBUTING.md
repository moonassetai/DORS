# Contributing to DORS

> *"In the Foundation universe, no single person built the future alone. Hari Seldon needed Dors, Daneel, Giskard, and thousands of others."*

DORS is open source because the future of AI should belong to everyone. Here's how to join.

## Development Setup

```bash
git clone https://github.com/moonassetai/DORS.git
cd DORS
pnpm install
pnpm build
pnpm test
pnpm lint
```

## Project Structure

```
packages/
  ai/      — LLM provider abstraction (@dors/ai)
  core/    — Agent loop, SOUL.md, storage, safety, 4 tools (@dors/core)
  tui/     — Terminal interface (@dors/tui)
  agent/   — DORS agent factory (@dors/agent)
  ext/     — Extension system (@dors/ext)
  wiki/    — LLM Wiki extension (dors-ext-wiki)
apps/
  cli/     — CLI entry point (dors command)
personas/  — SOUL.md personality files
.agents/   — Paperclip agent fleet (14 Asimov-named AI agents)
```

## Code Standards

- TypeScript strict mode, ESM modules, 2-space indent
- Vitest for testing -- every function gets a test
- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- No external dependencies unless absolutely necessary
- Three Laws compliance in all safety-related code

## Adding an LLM Provider

DORS works with any LLM. To add a new provider:

1. Create `packages/ai/src/providers/your-provider.ts`
2. Extend `BaseProvider` from `./base.ts`
3. Implement `chat()` (async generator yielding `StreamChunk`) and `isAvailable()`
4. Export from `packages/ai/src/index.ts`
5. Add tests in `packages/ai/src/__tests__/`

## Creating an Extension

Extensions add tools and hooks without touching the core. See `dors-ext-wiki` for a complete example.

```typescript
import type { Extension } from '@dors/ext';
import type { Tool } from '@dors/core';

const myExtension: Extension = {
  name: 'dors-ext-example',
  version: '1.0.0',
  tools: [/* your custom tools */],
  hooks: {
    onMessage: async (msg) => msg,       // intercept messages
    onResponse: async (res) => res,       // transform responses
    onTool: async (name, args) => true,   // gate-keep tools
  },
  async activate() { /* setup */ },
  async deactivate() { /* cleanup */ },
};

export default myExtension;
```

## Writing a SOUL.md

SOUL.md defines personality, not instructions. The model already knows what it is. The SOUL defines *who* it is.

```markdown
# Identity
name: YOUR_NAME
archetype: One-line description of the character
voice: How they speak
laws: asimov

# Personality
- Trait: Description
- Trait: Description

# Boundaries
- category: constraint
```

## The Three Laws Apply to Contributors Too

- Never submit code that could be used to harm users
- Never add telemetry, tracking, or data exfiltration
- Never build features for military applications
- Always keep user data local by default

## License

MIT -- free forever. That's non-negotiable.
