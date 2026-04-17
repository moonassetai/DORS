/**
 * Tokscale bridge — reads AI agent usage data as XP source.
 *
 * Primary: reads directly from ~/.claude/projects/ (same source tokscale uses)
 * Future: tokscale API or data exchange format
 *
 * @see https://github.com/junhoyeo/tokscale
 */

import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';

const CLAUDE_PROJECTS_DIR = join(homedir(), '.claude', 'projects');
const TOKENS_PER_XP = 100; // 100 tokens = 1 XP

export class TokscaleBridge {
  private projectsDir: string;

  constructor(projectsDir?: string) {
    this.projectsDir = projectsDir ?? CLAUDE_PROJECTS_DIR;
  }

  /** Check if Claude Code usage data is available */
  async isAvailable(): Promise<boolean> {
    try {
      await stat(this.projectsDir);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Estimate total tokens from Claude Code project data.
   * This is a simplified implementation — reads JSONL conversation files
   * and estimates token count from file sizes.
   *
   * For precise counts, integrate with tokscale CLI:
   *   const result = Bun.$`tokscale --json`.text()
   */
  async estimateTotalTokens(): Promise<number> {
    if (!(await this.isAvailable())) return 0;

    try {
      const entries = await readdir(this.projectsDir, { withFileTypes: true });
      let totalBytes = 0;

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const projectPath = join(this.projectsDir, entry.name);
          totalBytes += await this.getDirectorySize(projectPath);
        }
      }

      // Rough estimate: ~4 chars per token, ~1 byte per char in JSONL
      const estimatedTokens = Math.floor(totalBytes / 4);
      return estimatedTokens;
    } catch {
      return 0;
    }
  }

  /** Convert token count to XP */
  tokensToXP(tokens: number): number {
    return Math.floor(tokens / TOKENS_PER_XP);
  }

  /** Get XP from all available sources */
  async getTotalXP(): Promise<number> {
    const tokens = await this.estimateTotalTokens();
    return this.tokensToXP(tokens);
  }

  private async getDirectorySize(dirPath: string): Promise<number> {
    let size = 0;
    try {
      const entries = await readdir(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(dirPath, entry.name);
        if (entry.isFile() && entry.name.endsWith('.jsonl')) {
          const fileStat = await stat(fullPath);
          size += fileStat.size;
        }
      }
    } catch {
      // ignore unreadable directories
    }
    return size;
  }
}
