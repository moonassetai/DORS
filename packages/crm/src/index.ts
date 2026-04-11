import type { Extension } from '@dors/ext';
import type { Tool } from '@dors/core';
import { createContactsTool } from './tools/contacts.js';
import { createDealsTool } from './tools/deals.js';
import { createFollowUpTool } from './tools/followup.js';
import { createInsightsTool } from './tools/insights.js';

export function createCrmExtension(): Extension {
  const tools: Tool[] = [
    createContactsTool(),
    createDealsTool(),
    createFollowUpTool(),
    createInsightsTool(),
  ];

  return {
    name: 'dors-ext-crm',
    version: '0.1.0',
    tools,
    async activate() {
      // Future: initialize SQLite store, load contacts from disk
    },
    async deactivate() {
      // Future: flush pending writes, close db connection
    },
  };
}

export default createCrmExtension;

export type { Contact, Deal, DealStage, FollowUp, Pipeline } from './types.js';
export { createContactsTool } from './tools/contacts.js';
export { createDealsTool } from './tools/deals.js';
export { createFollowUpTool } from './tools/followup.js';
export { createInsightsTool } from './tools/insights.js';
