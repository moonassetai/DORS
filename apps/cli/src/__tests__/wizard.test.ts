import { describe, it, expect } from 'vitest';

describe('Wizard', () => {
  it('should export runWizard function', async () => {
    const mod = await import('../wizard/steps.js');
    expect(typeof mod.runWizard).toBe('function');
  });
});
