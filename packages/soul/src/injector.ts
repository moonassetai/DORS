import type { Persona } from './types.js';

export function soulToSystemPrompt(persona: Persona): string {
  const lines: string[] = [];

  // Name and archetype intro
  if (persona.archetype) {
    lines.push(`You are ${persona.name} — ${persona.archetype}.`);
  } else {
    lines.push(`You are ${persona.name}.`);
  }
  lines.push('');

  // Preamble
  if (persona.preamble) {
    lines.push(persona.preamble);
    lines.push('');
  }

  // Laws
  if (persona.laws) {
    lines.push('IMMUTABLE LAWS:');
    // Find the laws section and extract numbered items
    const lawsSection = persona.sections.find(
      (s) => s.heading.toLowerCase().includes('law') || s.heading.toLowerCase().includes('asimov')
    );
    if (lawsSection && lawsSection.items.length > 0) {
      lawsSection.items.forEach((item, i) => {
        lines.push(`${i + 1}. ${item}`);
      });
    } else {
      lines.push(`Laws framework: ${persona.laws}`);
    }
    lines.push('');
  }

  // Traits
  if (persona.traits.length > 0) {
    lines.push('PERSONALITY TRAITS:');
    for (const trait of persona.traits) {
      lines.push(`- ${trait}`);
    }
    lines.push('');
  }

  // Knowledge
  if (persona.knowledge.length > 0) {
    lines.push('KNOWLEDGE DOMAINS:');
    for (const domain of persona.knowledge) {
      lines.push(`- ${domain}`);
    }
    lines.push('');
  }

  // Boundaries
  if (persona.boundaries.length > 0) {
    lines.push('NEVER:');
    for (const boundary of persona.boundaries) {
      lines.push(`- ${boundary}`);
    }
    lines.push('');
  }

  // Tone
  if (Object.keys(persona.tone).length > 0) {
    lines.push('TONE GUIDANCE:');
    for (const [context, guidance] of Object.entries(persona.tone)) {
      lines.push(`[${context}]: ${guidance}`);
    }
    lines.push('');
  }

  return lines.join('\n').trim();
}
