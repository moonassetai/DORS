import type { Tool } from '@dors/core';
import type { Extension } from '@dors/ext';

import { triageTool } from './tools/triage.js';
import { draftTool } from './tools/draft.js';
import { sendTool } from './tools/send.js';
import { searchTool } from './tools/search.js';

// Re-export types
export type {
  EmailAccount,
  EmailMessage,
  EmailAttachment,
  EmailFilter,
  EmailDraft,
  TriageCategory,
  TriageResult,
} from './types.js';

// Re-export tools
export { triageTool } from './tools/triage.js';
export { draftTool } from './tools/draft.js';
export { sendTool } from './tools/send.js';
export { searchTool } from './tools/search.js';

/** DORS email extension — triage, draft, send, search for a 1-person corp. */
export const emailExtension: Extension = {
  name: 'dors-ext-email',
  version: '0.1.0',
  tools: [triageTool, draftTool, sendTool, searchTool],
  hooks: {
    onMessage: async (msg) => msg, // future: auto-detect "email me X" patterns
  },
  async activate() {
    /* connect to email provider */
  },
  async deactivate() {
    /* disconnect */
  },
};

export default emailExtension;
