export interface WebPage {
  url: string;
  title: string;
  content: string;
  screenshot?: string;
  fetchedAt: string;
}

export interface SearchResult {
  url: string;
  title: string;
  snippet: string;
  score: number;
}

export interface CompetitorChange {
  date: string;
  type: 'pricing' | 'feature' | 'content' | 'design';
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface CompetitorProfile {
  name: string;
  url: string;
  description: string;
  lastChecked: string;
  changes: CompetitorChange[];
}

export interface ResearchReport {
  query: string;
  sources: SearchResult[];
  summary: string;
  keyFindings: string[];
  recommendations: string[];
}
