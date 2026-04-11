import { test, expect } from 'vitest';
import { emailExtension } from '../index.js';

test('email extension has correct name', () => {
  expect(emailExtension.name).toBe('dors-ext-email');
});

test('email extension provides 4 tools', () => {
  expect(emailExtension.tools).toHaveLength(4);
});

test('email tools have correct names', () => {
  const names = emailExtension.tools!.map((t) => t.name);
  expect(names).toContain('email_triage');
  expect(names).toContain('email_draft');
  expect(names).toContain('email_send');
  expect(names).toContain('email_search');
});

test('triage tool returns mock results', async () => {
  const tool = emailExtension.tools!.find((t) => t.name === 'email_triage')!;
  const result = await tool.execute({ account: 'test@example.com', limit: 2 });
  expect(result.success).toBe(true);
  const data = JSON.parse(result.output);
  expect(data.account).toBe('test@example.com');
  expect(data.results).toHaveLength(2);
});

test('draft tool creates a draft', async () => {
  const tool = emailExtension.tools!.find((t) => t.name === 'email_draft')!;
  const result = await tool.execute({
    to: ['alice@example.com'],
    subject: 'Hello',
    body: 'Test body',
  });
  expect(result.success).toBe(true);
  const data = JSON.parse(result.output);
  expect(data.draft.subject).toBe('Hello');
  expect(data.draft.to).toEqual(['alice@example.com']);
});

test('send tool requires approval', async () => {
  const tool = emailExtension.tools!.find((t) => t.name === 'email_send')!;
  const result = await tool.execute({ draftId: 'draft-123' });
  expect(result.success).toBe(true);
  const data = JSON.parse(result.output);
  expect(data.status).toBe('pending_approval');
});

test('search tool returns empty stub', async () => {
  const tool = emailExtension.tools!.find((t) => t.name === 'email_search')!;
  const result = await tool.execute({ query: 'invoice' });
  expect(result.success).toBe(true);
  const data = JSON.parse(result.output);
  expect(data.query).toBe('invoice');
  expect(data.results).toEqual([]);
});
