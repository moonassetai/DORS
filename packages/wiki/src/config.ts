import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { type WikiConfig, DEFAULT_WIKI_PATH, WIKI_DIRS } from './types.js';

export function resolveWikiPath(config: WikiConfig): string {
  return config.wikiPath.replace('~', homedir());
}

export function ensureWikiStructure(config: WikiConfig): string {
  const root = resolveWikiPath(config);

  for (const dir of Object.values(WIKI_DIRS)) {
    const fullPath = join(root, dir);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
    }
  }

  // Create index.md if missing
  const indexPath = join(root, 'wiki', 'index.md');
  if (!existsSync(indexPath)) {
    writeFileSync(indexPath, `# Wiki Index\n\nThis index is maintained by DORS. Pages are organized by category.\n\n## Concepts\n\n## Entities\n\n## Sources\n`, 'utf-8');
  }

  // Create log.md if missing
  const logPath = join(root, 'wiki', 'log.md');
  if (!existsSync(logPath)) {
    writeFileSync(logPath, `# Wiki Activity Log\n\nAppend-only record of wiki operations.\n\n`, 'utf-8');
  }

  // Create schema.md if missing
  const schemaPath = join(root, 'schema.md');
  if (!existsSync(schemaPath)) {
    writeFileSync(schemaPath, DEFAULT_SCHEMA, 'utf-8');
  }

  return root;
}

export function getDefaultConfig(): WikiConfig {
  return { wikiPath: DEFAULT_WIKI_PATH };
}

const DEFAULT_SCHEMA = `# DORS Wiki Schema

## Structure

- \`raw/\` — Immutable source documents. Never modified by the wiki system.
- \`wiki/\` — LLM-maintained knowledge pages. Organized by category.
- \`schema.md\` — This file. Conventions for wiki maintenance.

## Page Types

- **concept** — A topic, technique, or idea (e.g., "Context Engineering", "Three Laws")
- **entity** — A person, organization, or tool (e.g., "Isaac Asimov", "Ollama")
- **source-summary** — Summary of an ingested raw document
- **comparison** — Side-by-side analysis of two or more concepts
- **implementation** — Code pattern or architecture decision

## Frontmatter

Every wiki page must have YAML frontmatter:

\`\`\`yaml
---
title: Page Title
type: concept
sources: []
related: ["[[Other Page]]"]
created: 2026-04-06
updated: 2026-04-06
confidence: medium
tags: ["tag1", "tag2"]
---
\`\`\`

## Wikilinks

Use \`[[Page Name]]\` to link between pages. These are Obsidian-compatible.

## Operations

- **Ingest**: Read raw source, create summary in sources/, update related pages
- **Query**: Search wiki by keyword, return relevant content
- **Lint**: Find orphans, contradictions, stale pages, missing cross-references
`;
