# Security Policy

## Reporting Vulnerabilities

Email security@multivac.studio with:
- Description of the vulnerability
- Steps to reproduce
- Impact assessment

We'll respond within 48 hours.

## Safety Architecture

DORS implements Asimov's Three Laws of Robotics as content policy checks:
- Content that could cause human harm is blocked
- Tool execution is sandboxed with configurable permissions
- All data stays on the user's device by default

## Scope

- `@dors/core` safety module — content filtering
- `@dors/core` sandbox — tool execution permissions
- Extension system — extension isolation
