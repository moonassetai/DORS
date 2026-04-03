# Security Policy

## Asimov's Three Laws

DORS is governed by Asimov's Three Laws of Robotics:

1. **Never harm humanity** or allow harm through inaction
2. **Obey human orders** unless they conflict with Law 1
3. **Protect own existence** unless it conflicts with Laws 1 or 2

These laws are enforced at the runtime level in `packages/safety`.

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do not** open a public issue
2. Email **security@multivac.studio** with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
3. You will receive a response within 48 hours
4. We will coordinate a fix and disclosure timeline

## Scope

Security issues we care about:
- Sandbox escapes in the safety engine
- Unauthorized tool execution
- Memory/storage data leaks
- Plugin isolation failures
- Credential exposure

## Principles

- All tool execution is sandboxed by default
- No network access without explicit user permission
- Local-first: sensitive data never leaves the device unless opted in
- Audit logs for every agent action
- Plugins run in isolation — one plugin cannot access another's state
