export interface WikiConfig {
  wikiPath: string;
}

export interface WikiFrontmatter {
  title: string;
  type: 'concept' | 'entity' | 'source-summary' | 'comparison' | 'implementation';
  sources: string[];
  related: string[];
  created: string;
  updated: string;
  confidence: 'high' | 'medium' | 'low';
  tags?: string[];
}

export interface WikiPage {
  path: string;
  frontmatter: WikiFrontmatter;
  content: string;
}

export interface SearchResult {
  page: WikiPage;
  score: number;
  matchedLines: string[];
}

export const DEFAULT_WIKI_PATH = '~/.dors/wiki';

export const WIKI_DIRS = {
  raw: 'raw',
  rawArticles: 'raw/articles',
  rawPapers: 'raw/papers',
  rawNotes: 'raw/notes',
  wiki: 'wiki',
  concepts: 'wiki/concepts',
  entities: 'wiki/entities',
  sources: 'wiki/sources',
} as const;
