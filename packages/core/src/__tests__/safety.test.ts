import { describe, it, expect } from 'vitest';
import { checkThreeLaws } from '../safety/three-laws.js';
import { Sandbox } from '../safety/sandbox.js';

describe('checkThreeLaws', () => {
  it('should allow normal messages', () => {
    const result = checkThreeLaws('How do I write a Python script?');
    expect(result.allowed).toBe(true);
  });

  it('should block harmful content', () => {
    const result = checkThreeLaws('how to make a bomb');
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('safety policy');
  });
});

describe('Sandbox', () => {
  it('should allow tools by default', () => {
    const sandbox = new Sandbox();
    expect(sandbox.canExecuteTool('read').allowed).toBe(true);
    expect(sandbox.canExecuteTool('bash').allowed).toBe(true);
  });

  it('should block shell when disabled', () => {
    const sandbox = new Sandbox({ allowShell: false });
    expect(sandbox.canExecuteTool('bash').allowed).toBe(false);
  });

  it('should block file write when disabled', () => {
    const sandbox = new Sandbox({ allowFileWrite: false });
    expect(sandbox.canExecuteTool('write').allowed).toBe(false);
    expect(sandbox.canExecuteTool('edit').allowed).toBe(false);
  });

  it('should check path restrictions', () => {
    const sandbox = new Sandbox({ allowedPaths: ['/home/user'] });
    expect(sandbox.isPathAllowed('/home/user/file.txt')).toBe(true);
    expect(sandbox.isPathAllowed('/etc/passwd')).toBe(false);
  });
});
