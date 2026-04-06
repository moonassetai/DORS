# Security Policy

> *"A robot may not injure a human being or, through inaction, allow a human being to come to harm."*
> -- First Law of Robotics

## The Three Laws Are Not Optional

DORS is governed by Asimov's Three Laws of Robotics. This is not a guideline. It is a constraint enforced at the architecture level.

1. Content that could cause human harm is blocked before it reaches the LLM
2. Tool execution is sandboxed with configurable permission boundaries
3. All data stays on the user's device by default -- no telemetry, no cloud sync
4. **Military use is prohibited. Forever. No exceptions.**

## Reporting Vulnerabilities

Email **security@multivac.studio** with:
- Description of the vulnerability
- Steps to reproduce
- Impact assessment

We respond within 48 hours. If a vulnerability involves potential harm to users (First Law), we treat it as critical regardless of technical severity.

## Safety Architecture

| Layer | What it does |
|-------|-------------|
| `@dors/core/safety/three-laws.ts` | Content policy checks on every message |
| `@dors/core/safety/sandbox.ts` | Tool execution permissions (shell, network, file write) |
| `@dors/ext` hooks | Extensions can gate-keep tool execution via `onTool` |
| SOUL.md boundaries | Per-persona safety boundaries (e.g., `military: NEVER`) |

## Scope

Vulnerabilities in these areas are in scope:
- Safety bypass (circumventing Three Laws checks)
- Sandbox escape (tools executing outside permitted boundaries)
- Data exfiltration (user data leaving the device)
- Extension isolation (malicious extensions accessing other extensions' data)
- Authentication bypass in any MULTIVAC service

## Out of Scope

- LLM hallucinations (these are mitigated but not preventable at the framework level)
- Vulnerabilities in upstream LLM providers (Ollama, OpenAI, Anthropic)
