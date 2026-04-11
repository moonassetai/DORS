/**
 * MemPalace Bridge — MCP tool interface for persistent palace-structured memory.
 *
 * MemPalace uses a palace architecture:
 *   Palace → Wings → Halls → Rooms → Closets → Drawers
 *
 * DORS conversations are mined into the palace automatically.
 * Wake-up loads L0 + L1 (~170 tokens) for instant context.
 *
 * This module is a bridge to MemPalace's MCP tools — not a reimplementation.
 * The actual MemPalace runs as a separate MCP server.
 *
 * @see https://github.com/milla-jovovich/mempalace
 */

/** Palace hierarchy levels */
export type PalaceLevel = 'wing' | 'hall' | 'room' | 'closet' | 'drawer';

/** A node in the palace tree */
export interface PalaceNode {
  id: string;
  name: string;
  level: PalaceLevel;
  parent_id: string | null;
  content: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/** Wake-up context returned at session start (~170 tokens) */
export interface WakeUpContext {
  /** L0: Palace structure overview */
  structure: string;
  /** L1: Recent activity summary */
  recent: string;
  /** Total token count */
  tokens: number;
}

/** Options for mining content into the palace */
export interface MineOptions {
  /** Target wing to mine into */
  wing: string;
  /** Mining mode */
  mode: 'files' | 'convos' | 'auto';
  /** File glob patterns to include */
  include?: string[];
  /** File glob patterns to exclude */
  exclude?: string[];
}

/** Search result from palace query */
export interface PalaceSearchResult {
  node: PalaceNode;
  score: number;
  path: string;
}

/**
 * MemPalace MCP bridge.
 *
 * Wraps MCP tool calls for palace operations. When MemPalace MCP server
 * is not available, operations gracefully degrade to no-ops with warnings.
 */
export class MemPalaceBridge {
  private available = false;

  constructor(
    private mcpCall: (tool: string, args: Record<string, unknown>) => Promise<unknown>,
  ) {}

  /** Check if MemPalace MCP server is reachable */
  async connect(): Promise<boolean> {
    try {
      await this.mcpCall('mempalace_list_agents', {});
      this.available = true;
      return true;
    } catch {
      this.available = false;
      return false;
    }
  }

  /** Load wake-up context (~170 tokens) for session start */
  async wakeUp(palace?: string): Promise<WakeUpContext | null> {
    if (!this.available) return null;
    try {
      const result = await this.mcpCall('mempalace_wake_up', { palace });
      return result as WakeUpContext;
    } catch {
      return null;
    }
  }

  /** Store a memory in the palace */
  async store(
    path: string,
    content: string,
    metadata?: Record<string, unknown>,
  ): Promise<PalaceNode | null> {
    if (!this.available) return null;
    try {
      const result = await this.mcpCall('mempalace_store', { path, content, metadata });
      return result as PalaceNode;
    } catch {
      return null;
    }
  }

  /** Recall a memory by path */
  async recall(path: string): Promise<PalaceNode | null> {
    if (!this.available) return null;
    try {
      const result = await this.mcpCall('mempalace_recall', { path });
      return result as PalaceNode;
    } catch {
      return null;
    }
  }

  /** Search the palace */
  async search(query: string, wing?: string): Promise<PalaceSearchResult[]> {
    if (!this.available) return [];
    try {
      const result = await this.mcpCall('mempalace_search', { query, wing });
      return result as PalaceSearchResult[];
    } catch {
      return [];
    }
  }

  /** Mine files or conversations into a wing */
  async mine(sourcePath: string, options: MineOptions): Promise<{ mined: number } | null> {
    if (!this.available) return null;
    try {
      const result = await this.mcpCall('mempalace_mine', { source: sourcePath, ...options });
      return result as { mined: number };
    } catch {
      return null;
    }
  }

  /** List wings in the palace */
  async listWings(): Promise<PalaceNode[]> {
    if (!this.available) return [];
    try {
      const result = await this.mcpCall('mempalace_list_wings', {});
      return result as PalaceNode[];
    } catch {
      return [];
    }
  }

  /** Whether MemPalace MCP server is connected */
  get isAvailable(): boolean {
    return this.available;
  }
}
