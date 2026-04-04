type Handler<T = unknown> = (data: T) => void | Promise<void>;

export class EventBus {
  private handlers = new Map<string, Set<Handler>>();

  on<T = unknown>(event: string, handler: Handler<T>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler as Handler);
    return () => this.handlers.get(event)?.delete(handler as Handler);
  }

  async emit<T = unknown>(event: string, data: T): Promise<void> {
    const handlers = this.handlers.get(event);
    if (!handlers) return;
    for (const handler of handlers) {
      await handler(data);
    }
  }

  removeAll(): void {
    this.handlers.clear();
  }
}
