import { describe, it, expect, vi } from 'vitest';
import { EventBus } from '../events/bus.js';

describe('EventBus', () => {
  it('calls handler when event is emitted', () => {
    const bus = new EventBus();
    const handler = vi.fn();

    bus.on('test', handler);
    bus.emit('test', { value: 42 });

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith({ value: 42 });
  });

  it('supports multiple handlers for the same event', () => {
    const bus = new EventBus();
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    bus.on('test', handler1);
    bus.on('test', handler2);
    bus.emit('test', 'hello');

    expect(handler1).toHaveBeenCalledWith('hello');
    expect(handler2).toHaveBeenCalledWith('hello');
  });

  it('does not call handlers for other events', () => {
    const bus = new EventBus();
    const handler = vi.fn();

    bus.on('test', handler);
    bus.emit('other', 'data');

    expect(handler).not.toHaveBeenCalled();
  });

  it('removes handler with off()', () => {
    const bus = new EventBus();
    const handler = vi.fn();

    bus.on('test', handler);
    bus.off('test', handler);
    bus.emit('test', 'data');

    expect(handler).not.toHaveBeenCalled();
  });

  it('off() only removes the specified handler', () => {
    const bus = new EventBus();
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    bus.on('test', handler1);
    bus.on('test', handler2);
    bus.off('test', handler1);
    bus.emit('test', 'data');

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalledWith('data');
  });

  it('off() is safe to call for non-existent event', () => {
    const bus = new EventBus();
    const handler = vi.fn();

    expect(() => bus.off('nonexistent', handler)).not.toThrow();
  });

  it('once() handler fires only once', () => {
    const bus = new EventBus();
    const handler = vi.fn();

    bus.once('test', handler);
    bus.emit('test', 'first');
    bus.emit('test', 'second');

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith('first');
  });

  it('once() does not interfere with other handlers', () => {
    const bus = new EventBus();
    const onceHandler = vi.fn();
    const persistentHandler = vi.fn();

    bus.once('test', onceHandler);
    bus.on('test', persistentHandler);

    bus.emit('test', 'first');
    bus.emit('test', 'second');

    expect(onceHandler).toHaveBeenCalledOnce();
    expect(persistentHandler).toHaveBeenCalledTimes(2);
  });

  it('emitting with no handlers does not throw', () => {
    const bus = new EventBus();
    expect(() => bus.emit('nonexistent', 'data')).not.toThrow();
  });

  it('handles typed event data', () => {
    const bus = new EventBus();
    const handler = vi.fn();

    bus.on<{ name: string; count: number }>('typed', handler);
    bus.emit('typed', { name: 'test', count: 5 });

    expect(handler).toHaveBeenCalledWith({ name: 'test', count: 5 });
  });
});
