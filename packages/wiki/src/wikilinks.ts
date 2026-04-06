import { listPages, readPage } from './fs-utils.js';

const WIKILINK_RE = /\[\[([^\]]+)\]\]/g;

export function extractWikilinks(content: string): string[] {
  const links: string[] = [];
  let match: RegExpExecArray | null;
  const re = new RegExp(WIKILINK_RE.source, 'g');
  while ((match = re.exec(content)) !== null) {
    links.push(match[1]);
  }
  return links;
}

export function findBacklinks(targetTitle: string, wikiDir: string, wikiRoot: string): string[] {
  const backlinks: string[] = [];
  const normalizedTarget = targetTitle.toLowerCase();

  for (const pagePath of listPages(wikiDir)) {
    const page = readPage(pagePath, wikiRoot);
    const links = extractWikilinks(page.content);
    const relatedLinks = extractWikilinks(page.frontmatter.related.join(' '));

    const allLinks = [...links, ...relatedLinks];
    if (allLinks.some((link) => link.toLowerCase() === normalizedTarget)) {
      backlinks.push(page.frontmatter.title || page.path);
    }
  }

  return backlinks;
}

export function resolveLink(linkName: string, wikiDir: string, wikiRoot: string): string | null {
  const normalized = linkName.toLowerCase().replace(/\s+/g, '-');

  for (const pagePath of listPages(wikiDir)) {
    const page = readPage(pagePath, wikiRoot);
    if (
      page.frontmatter.title.toLowerCase() === linkName.toLowerCase() ||
      page.path.toLowerCase().includes(normalized)
    ) {
      return pagePath;
    }
  }

  return null;
}
