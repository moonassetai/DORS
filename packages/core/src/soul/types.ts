export interface Persona {
  identity: {
    name: string;
    archetype: string;
    voice: string;
    laws: string;
  };
  personality: string[];
  boundaries: Record<string, string>;
}
