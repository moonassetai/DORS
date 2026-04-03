export interface SoulSection {
  heading: string;
  level: number;
  content: string;
  items: string[];
}

export interface ParsedSoul {
  name: string;
  raw: string;
  preamble: string;
  sections: SoulSection[];
  identity: string[];
  communication: string[];
  specializations: string[];
  boundaries: string[];
  laws: string[];
}

export function parseSoul(markdown: string): ParsedSoul {
  const lines = markdown.split("\n");
  const sections: SoulSection[] = [];
  let currentSection: SoulSection | null = null;
  let preamble = "";
  let name = "";

  for (const line of lines) {
    const h1Match = line.match(/^#\s+(?:SOUL\.md\s*[—–-]\s*)?(.+)/);
    if (h1Match) {
      name = h1Match[1].trim();
      continue;
    }

    const headingMatch = line.match(/^(#{2,6})\s+(.+)/);
    if (headingMatch) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        heading: headingMatch[2].trim(),
        level: headingMatch[1].length,
        content: "",
        items: [],
      };
      continue;
    }

    const bulletMatch = line.match(/^[-*]\s+(.+)/);
    if (bulletMatch && currentSection) {
      currentSection.items.push(bulletMatch[1].trim());
      continue;
    }

    const numberedMatch = line.match(/^\d+\.\s+(.+)/);
    if (numberedMatch && currentSection) {
      currentSection.items.push(numberedMatch[1].trim());
      continue;
    }

    const trimmed = line.trim();
    if (trimmed) {
      if (currentSection) {
        currentSection.content += (currentSection.content ? "\n" : "") + trimmed;
      } else {
        preamble += (preamble ? "\n" : "") + trimmed;
      }
    }
  }

  if (currentSection) sections.push(currentSection);

  const findSection = (name: string): SoulSection | undefined =>
    sections.find((s) => s.heading.toLowerCase().includes(name.toLowerCase()));

  return {
    name,
    raw: markdown,
    preamble,
    sections,
    identity: findSection("identity")?.items ?? [],
    communication: findSection("communication")?.items ?? [],
    specializations: findSection("specialization")?.items ?? [],
    boundaries: findSection("boundaries")?.items ?? findSection("boundary")?.items ?? [],
    laws: findSection("laws")?.items ?? findSection("law")?.items ?? [],
  };
}

export function soulToSystemPrompt(soul: ParsedSoul): string {
  const parts: string[] = [];

  if (soul.preamble) {
    parts.push(soul.preamble);
  }

  if (soul.identity.length > 0) {
    parts.push(`\nIdentity:\n${soul.identity.map((i) => `- ${i}`).join("\n")}`);
  }

  if (soul.communication.length > 0) {
    parts.push(
      `\nCommunication style:\n${soul.communication.map((c) => `- ${c}`).join("\n")}`
    );
  }

  if (soul.specializations.length > 0) {
    parts.push(
      `\nSpecializations:\n${soul.specializations.map((s) => `- ${s}`).join("\n")}`
    );
  }

  if (soul.laws.length > 0) {
    parts.push(
      `\nCore laws (always obey):\n${soul.laws.map((l, i) => `${i + 1}. ${l}`).join("\n")}`
    );
  }

  if (soul.boundaries.length > 0) {
    parts.push(
      `\nBoundaries (never violate):\n${soul.boundaries.map((b) => `- ${b}`).join("\n")}`
    );
  }

  return parts.join("\n");
}
