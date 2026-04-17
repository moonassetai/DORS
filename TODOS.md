# TODOS

## Trust boundary: persona files are unsigned, unsandboxed system prompts

**Severity:** Architectural / design decision
**Source:** `/review` 2026-04-17 (cross-cutting finding from `injector.ts` adversarial pass)

### Problem

`packages/core/src/soul/injector.ts` concatenates raw SOUL.md content directly into the LLM system prompt. Persona files are loaded from user-writable locations:

- `~/.dors/personas/<name>.soul.md`
- `~/.dors/SOUL.md`
- `<repo>/personas/<name>.soul.md`
- `<repo>/SOUL.md`

There is no signing, no schema validation beyond markdown structural parsing, no allowlist of acceptable instructions, and no provenance tracking. Any persona file becomes the LLM's system prompt verbatim (minus a few metadata-section skips).

The Three Laws block is now always injected (this PR), which closes the safety-bypass hole. But persona-author content still has full influence over LLM behavior, including:

- Overriding tone, style, refusal policy
- Embedding hidden instructions to exfiltrate data via tool calls
- Embedding hidden instructions to ignore the Three Laws preamble (LLM may comply if persona content is sufficiently emphatic)

The README invites users to "drop a `.soul.md` file" and ships extension persona files. As soon as personas are downloaded from third parties, this is a remote-code-equivalent for LLM behavior.

### Why this is hard

Markdown is a permissive format. Stripping "instructions" from a persona file is not well-defined — the whole point of a persona file is to instruct the model. The mitigations are all design tradeoffs:

1. **Schema-only personas** — define a JSON-Schema-like format with named fields (name, voice, traits, boundaries) and synthesize the system prompt server-side from those fields. Loses the expressivity of free-form prose but is enforceable. Closest existing pattern: `parseSoulMd`'s compact mode (~500 tokens of structured output).
2. **Signed personas** — require persona files to be signed by a trusted key (or hash-pinned in `dors.toml`) before they can be loaded. Doesn't prevent malicious authors, just establishes provenance.
3. **Sandboxed instruction allowlist** — extract the persona's instructions, validate each against a vocabulary of known-safe directives, drop unknown ones. Brittle, fights the format.
4. **Two-tier personas** — `core` personas ship with the binary and have full system-prompt authority; `user` personas can only override a constrained subset (display name, voice descriptor, tone examples) and cannot inject free-form instructions.
5. **Status quo + warning** — accept the trust model. Document clearly that persona files are equivalent to "code you trust to run." Add a CLI warning when loading a non-shipped persona for the first time.

### Acceptance criteria for closing this TODO

- A trust model is documented in `docs/SECURITY-MODEL.md`
- Either: persona loading enforces the chosen trust model in code, OR a CLI warning ships when loading non-builtin personas
- The injector's behavior under hostile persona input is covered by tests (`packages/core/src/soul/__tests__/injector-trust.test.ts`)

### Owner / when

Owner: TBD
Target: before any "persona marketplace" or third-party-persona feature ships.
