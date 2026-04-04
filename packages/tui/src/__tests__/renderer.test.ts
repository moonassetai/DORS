import { describe, it, expect } from 'vitest';
import { renderWelcome, renderHelp, renderError, renderInfo, renderSuccess } from '../renderer.js';

describe('renderer', () => {
  it('should render welcome message with name', () => {
    const output = renderWelcome('DORS');
    expect(output).toContain('DORS');
    expect(output).toContain('v0.1.0');
  });

  it('should render help with all commands', () => {
    const output = renderHelp();
    expect(output).toContain('/help');
    expect(output).toContain('/quit');
    expect(output).toContain('/clear');
    expect(output).toContain('/persona');
  });

  it('should render error messages', () => {
    const output = renderError('something broke');
    expect(output).toContain('something broke');
  });

  it('should render info messages', () => {
    const output = renderInfo('just info');
    expect(output).toContain('just info');
  });

  it('should render success messages', () => {
    const output = renderSuccess('it worked');
    expect(output).toContain('it worked');
  });
});
