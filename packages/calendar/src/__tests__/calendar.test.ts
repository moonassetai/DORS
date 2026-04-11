import { describe, it, expect } from 'vitest';
import { createCalendarExtension } from '../index.js';

describe('dors-ext-calendar', () => {
  const ext = createCalendarExtension();

  it('has the correct extension name', () => {
    expect(ext.name).toBe('dors-ext-calendar');
  });

  it('provides exactly 4 tools', () => {
    expect(ext.tools).toHaveLength(4);
  });

  it('provides the expected tool names', () => {
    const toolNames = ext.tools!.map((t) => t.name).sort();
    expect(toolNames).toEqual([
      'calendar_availability',
      'calendar_prep',
      'calendar_schedule',
      'calendar_timeblock',
    ]);
  });

  it('has activate and deactivate methods', () => {
    expect(typeof ext.activate).toBe('function');
    expect(typeof ext.deactivate).toBe('function');
  });
});
