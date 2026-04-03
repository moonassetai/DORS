import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DorsDatabase } from '../database.js';
import { ConversationStore } from '../conversations.js';
import { MemoryStore } from '../memory.js';

describe('Storage', () => {
  let db: DorsDatabase;
  let conversations: ConversationStore;
  let memory: MemoryStore;

  beforeEach(() => {
    db = new DorsDatabase(':memory:');
    db.init();
    conversations = new ConversationStore(db);
    memory = new MemoryStore(db);
  });

  afterEach(() => {
    db.close();
  });

  describe('ConversationStore', () => {
    it('creates a conversation with default agent', () => {
      const convo = conversations.create('Test Chat');
      expect(convo.id).toBeDefined();
      expect(convo.title).toBe('Test Chat');
      expect(convo.agent_name).toBe('dors');
    });

    it('creates a conversation with custom agent', () => {
      const convo = conversations.create('Custom', 'custom-agent');
      expect(convo.agent_name).toBe('custom-agent');
    });

    it('gets a conversation by id', () => {
      const created = conversations.create('Lookup Test');
      const fetched = conversations.get(created.id);
      expect(fetched).not.toBeNull();
      expect(fetched!.title).toBe('Lookup Test');
    });

    it('returns null for missing conversation', () => {
      expect(conversations.get('nonexistent')).toBeNull();
    });

    it('lists conversations ordered by updated_at', () => {
      conversations.create('First');
      conversations.create('Second');
      const list = conversations.list();
      expect(list.length).toBe(2);
    });

    it('lists conversations filtered by agent name', () => {
      conversations.create('A', 'agent-a');
      conversations.create('B', 'agent-b');
      const list = conversations.list('agent-a');
      expect(list.length).toBe(1);
      expect(list[0].agent_name).toBe('agent-a');
    });

    it('adds and retrieves messages', () => {
      const convo = conversations.create('Msg Test');
      const msg1 = conversations.addMessage(convo.id, 'user', 'Hello');
      const msg2 = conversations.addMessage(convo.id, 'assistant', 'Hi there');

      expect(msg1.role).toBe('user');
      expect(msg1.content).toBe('Hello');
      expect(msg2.role).toBe('assistant');

      const messages = conversations.getMessages(convo.id);
      expect(messages.length).toBe(2);
      expect(messages[0].content).toBe('Hello');
      expect(messages[1].content).toBe('Hi there');
    });

    it('deletes a conversation and its messages', () => {
      const convo = conversations.create('Delete Test');
      conversations.addMessage(convo.id, 'user', 'Bye');
      conversations.delete(convo.id);

      expect(conversations.get(convo.id)).toBeNull();
      expect(conversations.getMessages(convo.id).length).toBe(0);
    });
  });

  describe('MemoryStore', () => {
    it('sets and gets a value', () => {
      memory.set('user_name', 'Alice');
      expect(memory.get('user_name')).toBe('Alice');
    });

    it('updates an existing key', () => {
      memory.set('theme', 'dark');
      memory.set('theme', 'light');
      expect(memory.get('theme')).toBe('light');
    });

    it('returns null for missing key', () => {
      expect(memory.get('nonexistent')).toBeNull();
    });

    it('lists all memory entries', () => {
      memory.set('a', '1');
      memory.set('b', '2');
      const list = memory.list();
      expect(list.length).toBe(2);
    });

    it('lists memory filtered by agent', () => {
      memory.set('x', '1', 'general', 'agent-x');
      memory.set('y', '2', 'general', 'agent-y');
      const list = memory.list('agent-x');
      expect(list.length).toBe(1);
    });

    it('lists memory filtered by category', () => {
      memory.set('a', '1', 'prefs');
      memory.set('b', '2', 'facts');
      const list = memory.list(undefined, 'prefs');
      expect(list.length).toBe(1);
    });

    it('deletes a memory entry', () => {
      memory.set('delete_me', 'gone');
      memory.delete('delete_me');
      expect(memory.get('delete_me')).toBeNull();
    });

    it('searches memory by key or value', () => {
      memory.set('favorite_color', 'blue');
      memory.set('favorite_food', 'pizza');
      memory.set('random', 'something with blue in it');

      const results = memory.search('blue');
      expect(results.length).toBe(2);
    });

    it('search scopes to agent', () => {
      memory.set('item', 'shared value', 'general', 'agent-a');
      memory.set('item', 'shared value', 'general', 'agent-b');

      const results = memory.search('shared', 'agent-a');
      expect(results.length).toBe(1);
    });
  });
});
