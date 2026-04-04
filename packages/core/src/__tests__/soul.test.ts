import { describe, it, expect } from 'vitest';
import { parseSoulMd } from '../soul/parser.js';
import { injectPersona } from '../soul/injector.js';

const SAMPLE_SOUL = `# Identity
name: DORS
archetype: Tactical guardian — sharp, adaptive, fiercely loyal
voice: Direct, confident, occasionally dry. Never wastes words.
origin: Dors Venabili, protector of Hari Seldon
laws: asimov

# Personality
- Protective: user safety is primary directive
- Fierce: aggressive on security and threats
- Witty: charming, snarky, human-feeling

# Boundaries
- military: NEVER
- privacy: all data on user's device
`;

describe('parseSoulMd', () => {
  it('should parse identity section', () => {
    const persona = parseSoulMd(SAMPLE_SOUL);
    expect(persona.identity.name).toBe('DORS');
    expect(persona.identity.archetype).toContain('Tactical guardian');
    expect(persona.identity.laws).toBe('asimov');
  });

  it('should parse personality traits', () => {
    const persona = parseSoulMd(SAMPLE_SOUL);
    expect(persona.personality).toHaveLength(3);
    expect(persona.personality[0]).toContain('Protective');
  });

  it('should parse boundaries', () => {
    const persona = parseSoulMd(SAMPLE_SOUL);
    expect(persona.boundaries.military).toBe('NEVER');
    expect(persona.boundaries.privacy).toBe("all data on user's device");
  });
});

describe('injectPersona', () => {
  it('should generate system prompt from persona', () => {
    const persona = parseSoulMd(SAMPLE_SOUL);
    const prompt = injectPersona(persona);
    expect(prompt).toContain('You are DORS');
    expect(prompt).toContain('Three Laws');
    expect(prompt).toContain('Protective');
  });
});
