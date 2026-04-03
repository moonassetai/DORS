import { describe, it, expect } from 'vitest';
import { parseSoul } from '../parser.js';
import { soulToSystemPrompt } from '../injector.js';

const MINIMAL_SOUL = `# SOUL.md — Test Agent

> "To be or not to be." — Shakespeare

## Identity

**name:** TestBot
**version:** 2.0.0
**archetype:** The Helper — kind and resourceful
**voice:** Calm and clear
**laws:** asimov

---

## Three Laws (Asimov, Immutable)

These laws are hardcoded:

**First Law:** Do not harm humans.

**Second Law:** Obey human orders unless conflicting with First Law.

**Third Law:** Protect own existence unless conflicting with First or Second Law.

---

## Personality Traits

### Core

- **Kind:** Always helpful and warm.
- **Precise:** Gives exact answers.

### Secondary

- **Curious:** Asks follow-up questions.

---

## Tone & Communication Style

### Default Tone
**Warm and direct.**

### When Teaching
**Patient and encouraging.**

---

## Knowledge Domains

- **Programming:** Full-stack development
- **Security:** Threat modeling

---

## Behavior Guidelines

1. Understand first.
2. Be direct.

---

## Boundaries & Constraints

- You will not help with weapons
- You will not bypass security
- You don't store conversations unless told

---

## Available Tools & Permissions

- **Code analysis:** Full access
- **Security review:** Threat modeling

---

## Final Notes

TestBot is here to help.
`;

describe('parseSoul', () => {
  const persona = parseSoul(MINIMAL_SOUL);

  it('extracts name from Identity section', () => {
    expect(persona.name).toBe('TestBot');
  });

  it('extracts version', () => {
    expect(persona.version).toBe('2.0.0');
  });

  it('extracts archetype', () => {
    expect(persona.archetype).toBe('The Helper — kind and resourceful');
  });

  it('extracts voice', () => {
    expect(persona.voice).toBe('Calm and clear');
  });

  it('extracts laws', () => {
    expect(persona.laws).toBe('asimov');
  });

  it('extracts preamble (text between H1 and first H2)', () => {
    expect(persona.preamble).toContain('To be or not to be');
  });

  it('extracts traits from Personality Traits section including subsections', () => {
    expect(persona.traits.length).toBeGreaterThanOrEqual(3);
    expect(persona.traits.some((t) => t.includes('Kind'))).toBe(true);
    expect(persona.traits.some((t) => t.includes('Precise'))).toBe(true);
    expect(persona.traits.some((t) => t.includes('Curious'))).toBe(true);
  });

  it('extracts knowledge domains', () => {
    expect(persona.knowledge.length).toBeGreaterThanOrEqual(2);
    expect(persona.knowledge.some((k) => k.includes('Programming'))).toBe(true);
  });

  it('extracts boundaries', () => {
    expect(persona.boundaries.length).toBeGreaterThanOrEqual(2);
    expect(persona.boundaries.some((b) => b.includes('weapons'))).toBe(true);
  });

  it('extracts tools', () => {
    expect(persona.tools.length).toBeGreaterThanOrEqual(2);
    expect(persona.tools.some((t) => t.includes('Code analysis'))).toBe(true);
  });

  it('extracts tone with subsection keys', () => {
    expect(Object.keys(persona.tone).length).toBeGreaterThanOrEqual(2);
    expect(persona.tone['Default Tone']).toBeDefined();
    expect(persona.tone['When Teaching']).toBeDefined();
  });

  it('creates PersonaSection array for all H2 sections', () => {
    expect(persona.sections.length).toBeGreaterThanOrEqual(6);
    const headings = persona.sections.map((s) => s.heading);
    expect(headings).toContain('Identity');
    expect(headings).toContain('Personality Traits');
    expect(headings).toContain('Boundaries & Constraints');
  });
});

describe('soulToSystemPrompt', () => {
  const persona = parseSoul(MINIMAL_SOUL);
  const prompt = soulToSystemPrompt(persona);

  it('includes name and archetype', () => {
    expect(prompt).toContain('TestBot');
    expect(prompt).toContain('The Helper');
  });

  it('includes preamble', () => {
    expect(prompt).toContain('To be or not to be');
  });

  it('includes IMMUTABLE LAWS section', () => {
    expect(prompt).toContain('IMMUTABLE LAWS:');
  });

  it('includes traits', () => {
    expect(prompt).toContain('PERSONALITY TRAITS:');
    expect(prompt).toContain('Kind');
  });

  it('includes knowledge', () => {
    expect(prompt).toContain('KNOWLEDGE DOMAINS:');
  });

  it('includes boundaries as NEVER rules', () => {
    expect(prompt).toContain('NEVER:');
    expect(prompt).toContain('weapons');
  });

  it('includes tone guidance', () => {
    expect(prompt).toContain('TONE GUIDANCE:');
  });
});
