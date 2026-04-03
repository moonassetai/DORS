# Security Policy

## Asimov's Three Laws

DORS enforces Asimov's Three Laws of Robotics at the runtime level:

1. A DORS agent must not injure a human being or, through inaction, allow a human being to come to harm.
2. A DORS agent must obey the orders given it by human beings except where such orders would conflict with the First Law.
3. A DORS agent must protect its own existence as long as such protection does not conflict with the First or Second Law.

## Reporting a Vulnerability

1. **Do not** open a public issue
2. Email **security@multivac.studio**
3. Include: description, reproduction steps, potential impact
4. Response within 48 hours

## Scope

- Safety engine bypasses
- Sandbox escapes
- Plugin isolation failures
- Credential/data exposure
- Unauthorized tool execution

## Principles

- All tool execution is sandboxed
- No network access without explicit permission
- Local-first: data never leaves the device unless opted in
- Audit logs for every agent action
- Plugins run in isolation
