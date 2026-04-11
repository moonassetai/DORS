/**
 * Coding extension types — integrates OpenCode (coding agent) and OpenSpec (spec-driven dev).
 *
 * OpenCode: open-source AI coding agent (terminal + desktop)
 * OpenSpec: specification-driven development framework
 *
 * @see https://github.com/anomalyco/opencode
 * @see https://github.com/Fission-AI/OpenSpec
 */

/** Supported coding agent backends */
export type CodingAgent = 'opencode' | 'dors' | 'custom';

/** OpenCode agent modes */
export type AgentMode = 'build' | 'plan';

/** OpenSpec workflow phases */
export type SpecPhase = 'propose' | 'apply' | 'archive' | 'verify';

/** A specification proposal from OpenSpec */
export interface Specification {
  id: string;
  title: string;
  description: string;
  phase: SpecPhase;
  /** Change folder path (OpenSpec artifact structure) */
  changePath: string | null;
  /** Generated artifacts: proposal, design, spec, checklist */
  artifacts: SpecArtifact[];
  createdAt: string;
  updatedAt: string;
}

/** An artifact within a specification */
export interface SpecArtifact {
  type: 'proposal' | 'design' | 'spec' | 'checklist' | 'task';
  name: string;
  content: string;
  path: string;
}

/** A coding task for the agent to execute */
export interface CodingTask {
  id: string;
  specId: string | null;
  description: string;
  files: string[];
  mode: AgentMode;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'review';
  output: string | null;
  diff: string | null;
  startedAt: string | null;
  completedAt: string | null;
}

/** Code review result */
export interface CodeReview {
  taskId: string;
  files: ReviewedFile[];
  summary: string;
  issues: ReviewIssue[];
  approved: boolean;
}

/** A file that was reviewed */
export interface ReviewedFile {
  path: string;
  changes: number;
  status: 'added' | 'modified' | 'deleted';
}

/** An issue found during review */
export interface ReviewIssue {
  file: string;
  line: number | null;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  suggestion: string | null;
}

/** Project analysis/exploration result */
export interface CodeAnalysis {
  totalFiles: number;
  languages: Record<string, number>;
  dependencies: string[];
  architecture: string;
  suggestions: string[];
}
