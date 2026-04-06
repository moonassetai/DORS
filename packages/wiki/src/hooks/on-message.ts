import type { Message } from '@dors/ai';
import type { WikiConfig } from '../types.js';
import { resolveWikiPath } from '../config.js';
import { searchWiki } from '../search.js';
import { join } from 'node:path';

export function createOnMessageHook(config: WikiConfig) {
  return async (msg: Message): Promise<Message | null> => {
    if (msg.role !== 'user') return msg;

    try {
      const root = resolveWikiPath(config);
      const wikiDir = join(root, 'wiki');

      // Search wiki for terms in the user message
      const results = searchWiki(msg.content, wikiDir, root, 2);

      if (results.length === 0) return msg;

      // Inject wiki context
      const context = results
        .map((r) => `[[${r.page.frontmatter.title}]]: ${r.matchedLines[0] || r.page.content.slice(0, 100)}`)
        .join('\n');

      return {
        ...msg,
        content: `${msg.content}\n\n[Wiki context]\n${context}`,
      };
    } catch {
      return msg;
    }
  };
}
