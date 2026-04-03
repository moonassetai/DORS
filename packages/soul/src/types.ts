export interface Persona {
  name: string;
  version?: string;
  archetype?: string;
  voice?: string;
  laws?: string;
  preamble: string;
  traits: string[];
  tone: Record<string, string>;
  knowledge: string[];
  boundaries: string[];
  tools: string[];
  sections: PersonaSection[];
}

export interface PersonaSection {
  heading: string;
  level: number;
  content: string;
  items: string[];
}
