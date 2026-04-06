import type { Extension } from '@dors/ext';
import type { Tool } from '@dors/core';
import type { Message } from '@dors/ai';
import type { WikiConfig } from './types.js';
import { getDefaultConfig } from './config.js';
import { createWikiWriteTool } from './tools/write.js';
import { createWikiQueryTool } from './tools/query.js';
import { createWikiIngestTool } from './tools/ingest.js';
import { createWikiLintTool } from './tools/lint.js';
import { createWikiStatusTool } from './tools/status.js';
import { createOnMessageHook } from './hooks/on-message.js';
import { createOnResponseHook } from './hooks/on-response.js';

export function createWikiExtension(config?: Partial<WikiConfig>): Extension {
  const resolvedConfig: WikiConfig = {
    ...getDefaultConfig(),
    ...config,
  };

  const tools: Tool[] = [
    createWikiWriteTool(resolvedConfig),
    createWikiQueryTool(resolvedConfig),
    createWikiIngestTool(resolvedConfig),
    createWikiLintTool(resolvedConfig),
    createWikiStatusTool(resolvedConfig),
  ];

  const onMessage = createOnMessageHook(resolvedConfig);
  const onResponse = createOnResponseHook();

  return {
    name: 'dors-ext-wiki',
    version: '0.1.0',
    tools,
    hooks: {
      onMessage: onMessage as (msg: Message) => Promise<Message | null>,
      onResponse,
    },
    async activate() {
      // Ensure wiki structure exists on activation
      const { ensureWikiStructure } = await import('./config.js');
      ensureWikiStructure(resolvedConfig);
    },
    async deactivate() {
      // No cleanup needed
    },
  };
}

export default createWikiExtension;

export type { WikiConfig, WikiFrontmatter, WikiPage, SearchResult } from './types.js';
export { parseFrontmatter, serializeFrontmatter, readPage, writePage, listPages } from './fs-utils.js';
export { searchWiki } from './search.js';
export { extractWikilinks, findBacklinks, resolveLink } from './wikilinks.js';
export { ensureWikiStructure, resolveWikiPath } from './config.js';
