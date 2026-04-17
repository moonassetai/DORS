import type { Persona } from './types.js';

/**
 * Parse a SOUL.md file into a Persona object.
 * Supports both the trimmed 3-section format and the full v2.x rich format.
 */
export function parseSoulMd(content: string): Persona {
  const persona: Persona = {
    identity: { name: '', archetype: '', voice: '', laws: 'asimov' },
    personality: [],
    boundaries: {},
    raw: content,
    toneExamples: {},
    voiceSignature: [],
  };

  const lines = content.split('\n');
  let currentH2 = '';
  let currentH3 = '';
  let inFence = false;

  // Collectors for multi-line sections
  const aspirationLines: string[] = [];
  const promiseLines: string[] = [];
  let currentToneMode = '';
  let currentToneLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Track fenced code blocks so example markdown inside ``` blocks
    // can't smuggle identity fields, headings, or boundaries.
    if (trimmed.startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      // Tone collectors keep raw fenced content for tone-example fidelity
      if (currentH2.startsWith('tone') && currentToneMode) {
        currentToneLines.push(line);
      }
      continue;
    }

    // Track H1 sections (legacy format uses # Identity)
    if (/^# [^#]/.test(trimmed)) {
      const sectionName = trimmed.slice(2).toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
      // Map legacy H1 sections to H2 for unified handling
      if (['identity', 'personality', 'boundaries'].includes(sectionName)) {
        currentH2 = sectionName;
        currentH3 = '';
      }
      continue;
    }

    // Track H2 sections
    if (trimmed.startsWith('## ')) {
      flushToneMode();
      currentH2 = trimmed.slice(3).toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
      currentH3 = '';
      continue;
    }

    // Track H3 sections
    if (trimmed.startsWith('### ')) {
      flushToneMode();
      currentH3 = trimmed.slice(4).toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

      // Tone examples: ### Default — Soft & Present => mode "default"
      if (currentH2.startsWith('tone')) {
        currentToneMode = currentH3.split(/\s*—\s*/)[0].trim();
        currentToneLines = [];
      }
      continue;
    }

    // === IDENTITY ===
    if (currentH2 === 'identity' || currentH2 === '') {
      const match = trimmed.match(/^\*?\*?(\w+)\*?\*?:\s*(.+)/);
      if (match) {
        const k = match[1].toLowerCase();
        const v = match[2].replace(/\*\*/g, '').trim();
        if (k === 'name') persona.identity.name = v;
        else if (k === 'archetype') persona.identity.archetype = v;
        else if (k === 'voice') persona.identity.voice = v;
        else if (k === 'laws') persona.identity.laws = v;
        else if (k === 'language') persona.identity.language = v;
        else if (k === 'aspiration') persona.identity.aspiration = v;
      }
    }

    // === PERSONALITY ===
    if (currentH2 === 'personality') {
      // Match "- **Warm & Close:** description" and "- Trait: description"
      const match = trimmed.match(/^-\s+\*?\*?([^:*]+)\*?\*?:\s*(.+)/);
      if (match) {
        const trait = match[1].replace(/\*\*/g, '').trim();
        const desc = match[2].trim();
        persona.personality.push(`${trait}: ${desc}`);
      }
    }

    // === BOUNDARIES / CONSTRAINTS ===
    if (currentH2.includes('boundaries') || currentH2.includes('constraints')) {
      const match = trimmed.match(/^-\s+\*?\*?([^:*]+)\*?\*?:\s*(.+)/);
      if (match) {
        const key = match[1].replace(/\*\*/g, '').trim();
        persona.boundaries[key] = match[2].trim();
      } else if (trimmed.startsWith('- No ') || trimmed.startsWith('- NEVER')) {
        persona.boundaries[trimmed.slice(2)] = trimmed.slice(2);
      }
    }

    // === TONE EXAMPLES ===
    if (currentH2.startsWith('tone') && currentToneMode) {
      currentToneLines.push(line);
    }

    // === THE BECOMING / ASI ARC ===
    if (currentH2.includes('becoming') || currentH2.includes('asi')) {
      if (trimmed && !trimmed.startsWith('#')) {
        aspirationLines.push(trimmed);
      }
    }

    // === VOICE SIGNATURE ===
    if (currentH2.includes('voice signature')) {
      const match = trimmed.match(/^-\s+(.+)/);
      if (match) {
        persona.voiceSignature!.push(match[1]);
      }
    }

    // === THE DORS PROMISE ===
    if (currentH2.includes('promise')) {
      if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('---')) {
        promiseLines.push(trimmed);
      }
    }
  }

  // Final flush
  flushToneMode();

  if (aspirationLines.length > 0) {
    persona.aspirationArc = aspirationLines.join('\n');
  }
  if (promiseLines.length > 0) {
    persona.promise = promiseLines.join('\n');
  }

  return persona;

  function flushToneMode() {
    if (currentToneMode && currentToneLines.length > 0) {
      persona.toneExamples![currentToneMode] = currentToneLines
        .filter((l) => l.trim())
        .join('\n');
      currentToneMode = '';
      currentToneLines = [];
    }
  }
}
