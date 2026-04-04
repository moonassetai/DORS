import { describe, it, expect } from 'vitest';
import { ExtensionRegistry } from '../registry.js';

describe('ExtensionRegistry', () => {
  it('should register and retrieve manifests', () => {
    const registry = new ExtensionRegistry();
    registry.register({ name: 'test-ext', version: '1.0.0', main: 'dist/index.js' });
    expect(registry.get('test-ext')).toBeDefined();
    expect(registry.get('test-ext')?.version).toBe('1.0.0');
  });

  it('should list all registered manifests', () => {
    const registry = new ExtensionRegistry();
    registry.register({ name: 'ext-a', version: '1.0.0', main: 'index.js' });
    registry.register({ name: 'ext-b', version: '2.0.0', main: 'index.js' });
    expect(registry.list()).toHaveLength(2);
  });

  it('should unregister manifests', () => {
    const registry = new ExtensionRegistry();
    registry.register({ name: 'temp', version: '1.0.0', main: 'index.js' });
    expect(registry.unregister('temp')).toBe(true);
    expect(registry.has('temp')).toBe(false);
  });

  it('should check existence with has()', () => {
    const registry = new ExtensionRegistry();
    expect(registry.has('nonexistent')).toBe(false);
    registry.register({ name: 'exists', version: '1.0.0', main: 'index.js' });
    expect(registry.has('exists')).toBe(true);
  });
});
