import { describe, it, expect, vi, afterEach } from 'vitest';
import { Spinner } from '../spinner.js';

describe('Spinner', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create with default message', () => {
    const spinner = new Spinner();
    expect(spinner).toBeDefined();
  });

  it('should create with custom message', () => {
    const spinner = new Spinner('Loading...');
    expect(spinner).toBeDefined();
  });

  it('should start and stop without errors', () => {
    const writeSpy = vi.spyOn(process.stderr, 'write').mockReturnValue(true);
    const spinner = new Spinner('test');
    spinner.start();
    spinner.stop();
    expect(writeSpy).toHaveBeenCalled();
  });

  it('should update message', () => {
    const spinner = new Spinner('initial');
    spinner.update('updated');
    expect(spinner).toBeDefined();
  });

  it('should handle double stop gracefully', () => {
    const vi_ = vi.spyOn(process.stderr, 'write').mockReturnValue(true);
    const spinner = new Spinner();
    spinner.stop();
    spinner.stop();
    expect(vi_).toBeDefined();
  });
});
