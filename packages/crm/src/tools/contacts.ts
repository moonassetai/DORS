import type { Tool, ToolResult } from '@dors/core';
import type { Contact } from '../types.js';

const mockContacts: Contact[] = [
  {
    id: 'c1',
    name: 'Hari Seldon',
    email: 'hari@foundation.org',
    company: 'Foundation',
    role: 'Director',
    tags: ['vip', 'partner'],
    notes: 'Key strategic contact',
    lastContactedAt: '2026-04-01',
    createdAt: '2026-01-15',
  },
  {
    id: 'c2',
    name: 'Dors Venabili',
    email: 'dors@streeling.edu',
    company: 'Streeling University',
    role: 'Professor',
    tags: ['academic'],
    createdAt: '2026-02-20',
  },
];

export function createContactsTool(): Tool {
  return {
    name: 'crm_contacts',
    description: 'Manage contacts: add, update, search, list, or get a specific contact',
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['add', 'update', 'search', 'list', 'get'],
          description: 'Action to perform',
        },
        contact: {
          type: 'object',
          description: 'Contact data (partial for search/update, full for add)',
        },
      },
      required: ['action'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      try {
        const action = args.action as string;
        const contact = args.contact as Partial<Contact> | undefined;

        switch (action) {
          case 'list': {
            const output = mockContacts
              .map((c) => `- ${c.name} (${c.email ?? 'no email'}) @ ${c.company ?? 'N/A'} [${c.tags.join(', ')}]`)
              .join('\n');
            return { success: true, output: `${mockContacts.length} contacts:\n${output}` };
          }

          case 'get': {
            const id = contact?.id ?? contact?.name;
            const found = mockContacts.find((c) => c.id === id || c.name === id);
            if (!found) return { success: false, output: '', error: `Contact not found: ${id}` };
            return { success: true, output: JSON.stringify(found, null, 2) };
          }

          case 'search': {
            const query = (contact?.name ?? contact?.email ?? '').toLowerCase();
            const results = mockContacts.filter(
              (c) =>
                c.name.toLowerCase().includes(query) ||
                c.email?.toLowerCase().includes(query) ||
                c.company?.toLowerCase().includes(query) ||
                c.tags.some((t) => t.includes(query)),
            );
            if (results.length === 0) return { success: true, output: 'No contacts match your search.' };
            const output = results.map((c) => `- ${c.name} (${c.email ?? 'no email'})`).join('\n');
            return { success: true, output: `Found ${results.length} contacts:\n${output}` };
          }

          case 'add': {
            if (!contact?.name) return { success: false, output: '', error: 'Contact name is required' };
            return { success: true, output: `Contact "${contact.name}" added successfully.` };
          }

          case 'update': {
            if (!contact?.id) return { success: false, output: '', error: 'Contact id is required for update' };
            return { success: true, output: `Contact "${contact.id}" updated successfully.` };
          }

          default:
            return { success: false, output: '', error: `Unknown action: ${action}` };
        }
      } catch (error) {
        return { success: false, output: '', error: error instanceof Error ? error.message : String(error) };
      }
    },
  };
}
