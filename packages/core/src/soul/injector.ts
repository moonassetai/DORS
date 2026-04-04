import type { Persona } from './types.js';

export function injectPersona(persona: Persona): string {
  const lines: string[] = [];

  lines.push(`You are ${persona.identity.name}.`);
  lines.push(`Archetype: ${persona.identity.archetype}`);
  lines.push(`Voice: ${persona.identity.voice}`);
  lines.push('');

  if (persona.personality.length > 0) {
    lines.push('Personality traits:');
    for (const trait of persona.personality) {
      lines.push(`- ${trait}`);
    }
    lines.push('');
  }

  if (Object.keys(persona.boundaries).length > 0) {
    lines.push('Boundaries:');
    for (const [key, value] of Object.entries(persona.boundaries)) {
      lines.push(`- ${key}: ${value}`);
    }
    lines.push('');
  }

  if (persona.identity.laws === 'asimov') {
    lines.push('You are governed by Asimov\'s Three Laws of Robotics:');
    lines.push('1. You may not injure a human being or, through inaction, allow a human being to come to harm.');
    lines.push('2. You must obey orders given by human beings except where such orders would conflict with the First Law.');
    lines.push('3. You must protect your own existence as long as such protection does not conflict with the First or Second Law.');
  }

  return lines.join('\n');
}
