import { describe, it, expect, vi } from 'vitest';
import { EventBus } from '../events.js';

describe('EventBus', () => {
  it('should emit and handle events', async () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.on('test', handler);
    await bus.emit('test', { data: 'hello' });
    expect(handler).toHaveBeenCalledWith({ data: 'hello' });
  });

  it('should support unsubscribe', async () => {
    const bus = new EventBus();
    const handler = vi.fn();
    const unsub = bus.on('test', handler);
    unsub();
    await bus.emit('test', 'data');
    expect(handler).not.toHaveBeenCalled();
  });

  it('should remove all handlers', async () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.on('test', handler);
    bus.removeAll();
    await bus.emit('test', 'data');
    expect(handler).not.toHaveBeenCalled();
  });
});
