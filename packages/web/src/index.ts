import type { Extension } from '@dors/ext';
import type { Tool } from '@dors/core';
import { createBrowseTool } from './tools/browse.js';
import { createSearchTool } from './tools/search.js';
import { createResearchTool } from './tools/research.js';
import { createMonitorTool } from './tools/monitor.js';

export function createWebExtension(): Extension {
  const tools: Tool[] = [
    createBrowseTool(),
    createSearchTool(),
    createResearchTool(),
    createMonitorTool(),
  ];

  return {
    name: 'dors-ext-web',
    version: '0.1.0',
    tools,
    async activate() {
      // Future: initialize browser pool, API keys, etc.
    },
    async deactivate() {
      // Future: close browser instances, flush caches
    },
  };
}

export default createWebExtension;

export type {
  WebPage,
  SearchResult,
  CompetitorProfile,
  CompetitorChange,
  ResearchReport,
} from './types.js';

export { createBrowseTool } from './tools/browse.js';
export { createSearchTool } from './tools/search.js';
export { createResearchTool } from './tools/research.js';
export { createMonitorTool } from './tools/monitor.js';
