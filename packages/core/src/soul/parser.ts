import type { Persona } from './types.js';

export function parseSoulMd(content: string): Persona {
  const persona: Persona = {
    identity: { name: '', archetype: '', voice: '', laws: 'asimov' },
    personality: [],
    boundaries: {},
  };

  let currentSection = '';

  for (const line of content.split('\n')) {
    const trimmed = line.trim();

    if (trimmed.startsWith('# ')) {
      currentSection = trimmed.slice(2).toLowerCase();
      continue;
    }

    if (currentSection === 'identity') {
      const match = trimmed.match(/^(\w+):\s*(.+)/);
      if (match) {
        const [, key, value] = match;
        const k = key.toLowerCase();
        if (k === 'name') persona.identity.name = value;
        else if (k === 'archetype') persona.identity.archetype = value;
        else if (k === 'voice') persona.identity.voice = value;
        else if (k === 'origin') { /* metadata, skip */ }
        else if (k === 'laws') persona.identity.laws = value;
      }
    }

    if (currentSection === 'personality') {
      const match = trimmed.match(/^-\s+\*?\*?(\w+)\*?\*?:\s*(.+)/);
      if (match) {
        persona.personality.push(`${match[1]}: ${match[2]}`);
      }
    }

    if (currentSection === 'boundaries') {
      const match = trimmed.match(/^-\s+(\w+):\s*(.+)/);
      if (match) {
        persona.boundaries[match[1]] = match[2];
      }
    }
  }

  return persona;
}
