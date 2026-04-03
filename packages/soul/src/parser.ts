import type { Persona, PersonaSection } from './types.js';

const HEADING_RE = /^(#{1,6})\s+(.+)$/;
const BULLET_RE = /^[\s]*[-*]\s+(.+)$/;
const NUMBERED_RE = /^[\s]*\d+\.\s+(.+)$/;
const BOLD_KV_RE = /^\*\*([^:*]+):\*\*\s*(.+)$/;

function extractItems(lines: string[]): string[] {
  const items: string[] = [];
  for (const line of lines) {
    const bullet = line.match(BULLET_RE);
    if (bullet) {
      items.push(bullet[1].trim());
      continue;
    }
    const numbered = line.match(NUMBERED_RE);
    if (numbered) {
      items.push(numbered[1].trim());
    }
  }
  return items;
}

function extractBoldKV(lines: string[]): Record<string, string> {
  const kv: Record<string, string> = {};
  for (const line of lines) {
    const match = line.match(BOLD_KV_RE);
    if (match) {
      kv[match[1].trim().toLowerCase()] = match[2].trim();
    }
  }
  return kv;
}

function extractContent(lines: string[]): string {
  const paragraphs: string[] = [];
  let current: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '' || trimmed === '---') {
      if (current.length > 0) {
        paragraphs.push(current.join(' '));
        current = [];
      }
      continue;
    }
    // Skip headings, bullets, numbered lists, code fences
    if (HEADING_RE.test(trimmed)) continue;
    if (BULLET_RE.test(trimmed)) continue;
    if (NUMBERED_RE.test(trimmed)) continue;
    if (trimmed.startsWith('```')) continue;
    if (BOLD_KV_RE.test(trimmed)) continue;
    current.push(trimmed);
  }
  if (current.length > 0) {
    paragraphs.push(current.join(' '));
  }
  return paragraphs.join('\n\n');
}

interface RawSection {
  heading: string;
  level: number;
  lines: string[];
  subsections: RawSection[];
}

function parseSections(lines: string[]): { preambleLines: string[]; h1Title: string; sections: RawSection[] } {
  let h1Title = '';
  const preambleLines: string[] = [];
  const topSections: RawSection[] = [];
  const stack: RawSection[] = [];
  let foundH1 = false;
  let foundFirstH2 = false;

  for (const line of lines) {
    const headingMatch = line.match(HEADING_RE);

    if (headingMatch) {
      const level = headingMatch[1].length;
      const heading = headingMatch[2].trim();

      if (level === 1 && !foundH1) {
        foundH1 = true;
        h1Title = heading;
        continue;
      }

      if (level === 2) foundFirstH2 = true;

      const section: RawSection = { heading, level, lines: [], subsections: [] };

      if (level === 2) {
        topSections.push(section);
        stack.length = 0;
        stack.push(section);
      } else if (level >= 3 && stack.length > 0) {
        // Find the correct parent
        while (stack.length > 1 && stack[stack.length - 1].level >= level) {
          stack.pop();
        }
        stack[stack.length - 1].subsections.push(section);
        stack.push(section);
      }
      continue;
    }

    if (foundH1 && !foundFirstH2) {
      preambleLines.push(line);
      continue;
    }

    if (stack.length > 0) {
      stack[stack.length - 1].lines.push(line);
    }
  }

  return { preambleLines, h1Title, sections: topSections };
}

function flattenToPersonaSections(raw: RawSection[]): PersonaSection[] {
  const result: PersonaSection[] = [];
  for (const s of raw) {
    const allLines = [...s.lines];
    for (const sub of s.subsections) {
      allLines.push(`${'#'.repeat(sub.level)} ${sub.heading}`);
      allLines.push(...sub.lines);
      for (const subsub of sub.subsections) {
        allLines.push(`${'#'.repeat(subsub.level)} ${subsub.heading}`);
        allLines.push(...subsub.lines);
      }
    }
    result.push({
      heading: s.heading,
      level: s.level,
      content: extractContent(allLines),
      items: extractItems(allLines),
    });
  }
  return result;
}

function normalizeHeading(heading: string): string {
  return heading.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

function findSection(sections: RawSection[], ...names: string[]): RawSection | undefined {
  const normalized = names.map((n) => n.toLowerCase());
  return sections.find((s) => {
    const h = normalizeHeading(s.heading);
    return normalized.some((n) => h.includes(n));
  });
}

function collectAllItems(section: RawSection): string[] {
  const allLines = [...section.lines];
  for (const sub of section.subsections) {
    allLines.push(...sub.lines);
    for (const subsub of sub.subsections) {
      allLines.push(...subsub.lines);
    }
  }
  return extractItems(allLines);
}

function extractTone(section: RawSection): Record<string, string> {
  const tone: Record<string, string> = {};
  for (const sub of section.subsections) {
    const allLines = [...sub.lines];
    for (const subsub of sub.subsections) {
      allLines.push(...subsub.lines);
    }
    tone[sub.heading] = extractContent(allLines);
  }
  // If no subsections, use the section content itself
  if (section.subsections.length === 0) {
    const content = extractContent(section.lines);
    if (content) {
      tone['default'] = content;
    }
  }
  return tone;
}

export function parseSoul(markdown: string): Persona {
  const lines = markdown.split('\n');
  const { preambleLines, h1Title, sections } = parseSections(lines);

  // Extract name from H1
  let name = h1Title;
  // Handle "SOUL.md —" or "SOUL.md -" prefix
  const soulPrefix = h1Title.match(/SOUL\.md\s*[—–-]\s*(.+)/i);
  if (soulPrefix) {
    name = soulPrefix[1].trim();
  }

  // Preamble: text between H1 and first H2
  const preamble = preambleLines
    .map((l) => l.trim())
    .filter((l) => l !== '' && l !== '---')
    .join('\n');

  // Identity section
  const identitySection = findSection(sections, 'identity');
  const identityKV = identitySection ? extractBoldKV(identitySection.lines) : {};

  // Override name if identity has it
  if (identityKV['name']) {
    name = identityKV['name'];
  }

  const version = identityKV['version'];
  const archetype = identityKV['archetype'];
  const voice = identityKV['voice'];
  const laws = identityKV['laws']?.replace(/#.*$/, '').trim();

  // Traits
  const traitsSection = findSection(sections, 'personality traits', 'traits');
  const traits = traitsSection ? collectAllItems(traitsSection) : [];

  // Tone
  const toneSection = findSection(sections, 'tone', 'communication style');
  const tone = toneSection ? extractTone(toneSection) : {};

  // Knowledge
  const knowledgeSection = findSection(sections, 'knowledge');
  const knowledge = knowledgeSection ? collectAllItems(knowledgeSection) : [];

  // Boundaries
  const boundariesSection = findSection(sections, 'boundaries', 'constraints');
  const boundaries = boundariesSection ? collectAllItems(boundariesSection) : [];

  // Tools
  const toolsSection = findSection(sections, 'tools', 'permissions');
  const tools = toolsSection ? collectAllItems(toolsSection) : [];

  // All sections as PersonaSection[]
  const personaSections = flattenToPersonaSections(sections);

  return {
    name,
    version,
    archetype,
    voice,
    laws,
    preamble,
    traits,
    tone,
    knowledge,
    boundaries,
    tools,
    sections: personaSections,
  };
}
