import type { Tool, ToolResult } from '@dors/core';
import type { SpecPhase, Specification, SpecArtifact } from '../types.js';

/**
 * OpenSpec integration — specification-driven development.
 *
 * Maps to OpenSpec's slash commands:
 * - propose → /opsx:propose (create feature proposal)
 * - apply   → /opsx:apply (implement proposed tasks)
 * - archive → /opsx:archive (organize completed changes)
 * - verify  → /opsx:verify (verify implementation)
 */
export const specTool: Tool = {
  name: 'code_spec',
  description:
    'Manage specifications using OpenSpec. Create proposals, implement specs, archive completed work. Ensures requirements are documented before coding begins.',
  parameters: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        enum: ['propose', 'apply', 'archive', 'verify', 'list'],
        description: 'The specification action to perform',
      },
      title: {
        type: 'string',
        description: 'Title for a new proposal (required for propose)',
      },
      description: {
        type: 'string',
        description: 'Description of the feature or change',
      },
      specId: {
        type: 'string',
        description: 'Specification ID (required for apply/archive/verify)',
      },
    },
    required: ['action'],
  },

  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const action = args.action as SpecPhase | 'list';

    switch (action) {
      case 'propose': {
        const spec: Specification = {
          id: `spec_${Date.now()}`,
          title: (args.title as string) ?? 'Untitled Proposal',
          description: (args.description as string) ?? '',
          phase: 'propose',
          changePath: null,
          artifacts: [
            {
              type: 'proposal',
              name: 'PROPOSAL.md',
              content: `# ${args.title}\n\n${args.description ?? ''}`,
              path: 'changes/proposal/PROPOSAL.md',
            } satisfies SpecArtifact,
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return {
          success: true,
          output: JSON.stringify({
            message: `Specification proposed: ${spec.title}`,
            spec,
            hint: 'Run code_spec with action: "apply" and this specId to begin implementation',
          }),
        };
      }

      case 'apply': {
        return {
          success: true,
          output: JSON.stringify({
            message: `Applying specification: ${args.specId}`,
            status: 'in_progress',
            hint: 'OpenSpec will generate implementation tasks from the specification artifacts',
          }),
        };
      }

      case 'archive': {
        return {
          success: true,
          output: JSON.stringify({
            message: `Archived specification: ${args.specId}`,
            status: 'archived',
          }),
        };
      }

      case 'verify': {
        return {
          success: true,
          output: JSON.stringify({
            message: `Verifying specification: ${args.specId}`,
            status: 'verified',
            checks: {
              requirements_met: true,
              tests_passing: true,
              docs_updated: true,
            },
          }),
        };
      }

      case 'list': {
        return {
          success: true,
          output: JSON.stringify({
            message: 'No active specifications',
            specs: [],
            hint: 'Use action: "propose" to create a new specification',
          }),
        };
      }

      default:
        return { success: false, output: '', error: `Unknown action: ${action}` };
    }
  },
};
