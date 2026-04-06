import { describe, it, expect } from 'vitest';
import { extractWikilinks } from '../wikilinks.js';

describe('extractWikilinks', () => {
  it('should extract wikilinks from content', () => {
    const content = 'See [[Context Engineering]] and [[Three Laws]] for more.';
    const links = extractWikilinks(content);
    expect(links).toEqual(['Context Engineering', 'Three Laws']);
  });

  it('should return empty array when no links', () => {
    expect(extractWikilinks('No links here.')).toEqual([]);
  });

  it('should handle multiple links on same line', () => {
    const content = '[[A]] connects to [[B]] and [[C]]';
    expect(extractWikilinks(content)).toEqual(['A', 'B', 'C']);
  });

  it('should handle links across multiple lines', () => {
    const content = '# Title\n\nSee [[First]].\n\nAlso [[Second]].';
    expect(extractWikilinks(content)).toEqual(['First', 'Second']);
  });
});
