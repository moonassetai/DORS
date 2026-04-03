# @dors/safety

Three Laws safety engine for DORS.

**Status:** Planned for v0.2.0

## Asimov's Three Laws

1. Never harm humanity or allow harm through inaction
2. Obey human orders unless they conflict with Law 1
3. Protect own existence unless it conflicts with Laws 1 or 2

## Planned Features

- **Action validation:** Every tool call passes through safety checks before execution
- **Sandboxing:** Plugin actions run in isolation with limited permissions
- **Audit log:** Every decision, action, and override is logged
- **Safety levels:** Configurable from `permissive` to `strict`
- **Human-in-the-loop:** High-risk actions require explicit approval
