export interface Persona {
  identity: {
    name: string;
    archetype: string;
    voice: string;
    laws: string;
    language?: string;
    aspiration?: string;
  };
  personality: string[];
  boundaries: Record<string, string>;
  /** Full raw SOUL.md content for rich injection */
  raw?: string;
  /** Parsed tone examples keyed by mode name */
  toneExamples?: Record<string, string>;
  /** The Becoming / ASI arc text */
  aspirationArc?: string;
  /** Voice signature traits */
  voiceSignature?: string[];
  /** The closing promise text */
  promise?: string;
}
