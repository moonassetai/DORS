import type { Extension } from '@dors/ext';
import { specTool } from './tools/spec.js';
import { developTool } from './tools/develop.js';
import { reviewTool } from './tools/review.js';
import { analyzeTool } from './tools/analyze.js';

export type {
  CodingAgent,
  AgentMode,
  SpecPhase,
  Specification,
  SpecArtifact,
  CodingTask,
  CodeReview,
  ReviewedFile,
  ReviewIssue,
  CodeAnalysis,
} from './types.js';

export { specTool } from './tools/spec.js';
export { developTool } from './tools/develop.js';
export { reviewTool } from './tools/review.js';
export { analyzeTool } from './tools/analyze.js';

/**
 * DORS Code Extension — free coding with OpenCode + OpenSpec.
 *
 * Integrates:
 * - OpenSpec (Fission AI) — specification-driven development
 * - OpenCode (Anomaly) — AI coding agent (build + plan modes)
 *
 * Four tools:
 * - code_spec: manage specifications (propose → apply → verify → archive)
 * - code_develop: execute coding tasks (build or plan mode)
 * - code_review: review code changes for quality + security
 * - code_analyze: explore and understand codebases
 *
 * @see https://github.com/Fission-AI/OpenSpec
 * @see https://github.com/anomalyco/opencode
 */
export function createCodeExtension(): Extension {
  return {
    name: 'dors-ext-code',
    version: '0.1.0',
    tools: [specTool, developTool, reviewTool, analyzeTool],
    hooks: {
      onMessage: async (msg) => msg,
    },
    async activate() {
      // TODO: Check if opencode and openspec CLIs are installed
      // If not, suggest: npm i -g opencode-ai@latest @fission-ai/openspec@latest
    },
    async deactivate() {
      // Cleanup
    },
  };
}

export const codeExtension = createCodeExtension();
export default codeExtension;
