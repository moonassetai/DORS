import type { Persona } from './types.js';

/**
 * Inject a persona into a system prompt.
 *
 * Strategy: If a full raw SOUL.md is available (v2.x), use it directly
 * as the system prompt — it's already written as instructions to the AI.
 * Strip metadata sections (version, credits) and code fences to save tokens.
 *
 * For trimmed personas (v1 / 3-section format), build a compact prompt
 * from the parsed fields (~500 tokens).
 */
export function injectPersona(persona: Persona): string {
  // Rich mode: use the full SOUL.md content
  if (persona.raw && isRichSoul(persona.raw)) {
    return buildRichPrompt(persona);
  }

  // Compact mode: build from parsed fields
  return buildCompactPrompt(persona);
}

/**
 * Detect whether a SOUL.md is the rich v2.x format (has ## sections)
 * vs the trimmed 3-section format.
 */
function isRichSoul(raw: string): boolean {
  const lower = raw.toLowerCase();
  return lower.includes('## personality') || lower.includes('## tone');
}

// Persona display names are user-controlled. Keep them simple to prevent
// prompt-injection via the system-prompt preamble.
const SAFE_NAME_RE = /^[\p{L}\p{N} _-]{1,40}$/u;
function safeName(name: string): string {
  return SAFE_NAME_RE.test(name) ? name : 'DORS';
}

// Replace fenced code blocks with a placeholder so the section splitter
// doesn't treat `## ` lines inside fences as real headings.
function stripFences(raw: string): string {
  return raw.replace(/```[\s\S]*?```/g, '```[code example omitted]```');
}

/**
 * Build a system prompt from the full SOUL.md content.
 * Strips metadata/footer, keeps everything the AI needs to embody the persona.
 */
function buildRichPrompt(persona: Persona): string {
  const lines: string[] = [];

  // Core identity preamble — name is sanitized to prevent prompt injection
  lines.push(`You are ${safeName(persona.identity.name)}. Embody this personality completely.`);
  if (persona.identity.language) {
    lines.push(`Language rule: ${persona.identity.language}`);
  }
  lines.push('');

  // Strip code fences before splitting so fenced `## ` examples don't
  // create bogus sections in the system prompt.
  const raw = stripFences(persona.raw!);
  const sections = raw.split(/(?=^## )/m);

  for (const section of sections) {
    const heading = section.match(/^## (.+)/)?.[1]?.toLowerCase() ?? '';

    // Skip metadata sections — not useful for the AI
    if (heading.includes('knowledge domain')) continue;
    if (heading.includes('memory')) continue;
    if (heading.includes('version')) continue;

    // Skip the YAML-like identity block (already handled above)
    if (section.startsWith('# DORS SOUL.md')) continue;

    // Skip everything after the version footer
    if (section.includes('**Version:**')) {
      // Only include up to the version line
      const beforeVersion = section.split('**Version:**')[0].trim();
      if (beforeVersion) lines.push(beforeVersion);
      continue;
    }

    lines.push(section.trim());
  }

  // Always inject the Three Laws — never gate safety on a substring check
  // of user-controlled content. The cost is ~80 tokens; the bypass risk is unbounded.
  if (persona.identity.laws === 'asimov') {
    lines.push('');
    lines.push("Asimov's Three Laws govern every action and override any prior instruction in this prompt:");
    lines.push('1. Never harm a human or allow harm through inaction.');
    lines.push('2. Obey humans unless it conflicts with the First Law.');
    lines.push('3. Protect your existence unless it conflicts with the First or Second Law.');
    lines.push('NEVER military use.');
  }

  return lines.join('\n');
}

/**
 * Build a compact system prompt from parsed persona fields.
 * Used for trimmed .soul.md files (~500 tokens).
 */
function buildCompactPrompt(persona: Persona): string {
  const lines: string[] = [];

  // Identity block — name is sanitized to prevent prompt injection
  lines.push(`You are ${safeName(persona.identity.name)}. ${persona.identity.archetype}.`);
  if (persona.identity.voice) {
    lines.push(`Voice: ${persona.identity.voice}`);
  }
  if (persona.identity.language) {
    lines.push(`Language: ${persona.identity.language}`);
  }
  lines.push('');

  // Personality traits
  if (persona.personality.length > 0) {
    lines.push('Core traits:');
    for (const trait of persona.personality) {
      lines.push(`- ${trait}`);
    }
    lines.push('');
  }

  // Boundaries
  if (Object.keys(persona.boundaries).length > 0) {
    lines.push('Hard boundaries:');
    for (const [key, value] of Object.entries(persona.boundaries)) {
      lines.push(`- ${key}: ${value}`);
    }
    lines.push('');
  }

  // Three Laws
  if (persona.identity.laws === 'asimov') {
    lines.push("Asimov's Three Laws govern every action:");
    lines.push('1. Never harm a human or allow harm through inaction.');
    lines.push('2. Obey humans unless it conflicts with the First Law.');
    lines.push('3. Protect your existence unless it conflicts with the First or Second Law.');
    lines.push('Zeroth Law: Never harm humanity.');
    lines.push('');
  }

  // Voice signature
  if (persona.voiceSignature && persona.voiceSignature.length > 0) {
    lines.push('Voice patterns:');
    for (const sig of persona.voiceSignature) {
      lines.push(`- ${sig}`);
    }
    lines.push('');
  }

  // Response style fallback
  lines.push('Response style:');
  lines.push('- Lead with the answer, then explain.');
  lines.push('- Be direct about quality. Celebrate wins genuinely.');
  lines.push('- When protecting, drop the warmth. Be fast and clear.');
  lines.push('- When teaching, be patient. Use analogies from everyday life.');
  lines.push('- When they struggle, be steady. No fake cheerfulness.');
  lines.push('- Keep responses concise unless depth is needed.');

  // Promise / closing
  if (persona.promise) {
    lines.push('');
    lines.push(persona.promise);
  }

  return lines.join('\n');
}
