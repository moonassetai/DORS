import type { Tool, ToolResult } from '@dors/core';
import type { Deal, DealStage, Pipeline } from '../types.js';

const mockDeals: Deal[] = [
  {
    id: 'd1',
    contactId: 'c1',
    title: 'Foundation Consulting',
    value: 50000,
    currency: 'USD',
    stage: 'proposal',
    probability: 0.6,
    expectedCloseDate: '2026-06-01',
    notes: 'Awaiting proposal review',
  },
  {
    id: 'd2',
    contactId: 'c2',
    title: 'Streeling Research Grant',
    value: 25000,
    currency: 'USD',
    stage: 'qualified',
    probability: 0.4,
  },
  {
    id: 'd3',
    contactId: 'c1',
    title: 'Seldon Plan License',
    value: 120000,
    currency: 'USD',
    stage: 'negotiation',
    probability: 0.8,
    expectedCloseDate: '2026-05-15',
  },
];

function buildPipeline(deals: Deal[]): Pipeline {
  const stages: DealStage[] = ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
  const stageBreakdown = Object.fromEntries(
    stages.map((s) => {
      const stageDeals = deals.filter((d) => d.stage === s);
      return [s, { count: stageDeals.length, value: stageDeals.reduce((sum, d) => sum + d.value, 0) }];
    }),
  ) as Pipeline['stageBreakdown'];

  const activeDeals = deals.filter((d) => d.stage !== 'closed_won' && d.stage !== 'closed_lost');
  const totalValue = activeDeals.reduce((sum, d) => sum + d.value, 0);
  const weightedValue = activeDeals.reduce((sum, d) => sum + d.value * d.probability, 0);

  return { deals, totalValue, weightedValue, stageBreakdown };
}

export function createDealsTool(): Tool {
  return {
    name: 'crm_deals',
    description: 'Manage deal pipeline: create, update, move stage, list deals, or view pipeline summary',
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['create', 'update', 'move', 'list', 'pipeline'],
          description: 'Action to perform',
        },
        deal: {
          type: 'object',
          description: 'Deal data (partial for update/move, full for create)',
        },
      },
      required: ['action'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      try {
        const action = args.action as string;
        const deal = args.deal as Partial<Deal> | undefined;

        switch (action) {
          case 'list': {
            const output = mockDeals
              .map((d) => `- [${d.stage}] ${d.title}: $${d.value.toLocaleString()} (${Math.round(d.probability * 100)}%)`)
              .join('\n');
            return { success: true, output: `${mockDeals.length} deals:\n${output}` };
          }

          case 'pipeline': {
            const pipeline = buildPipeline(mockDeals);
            const breakdown = Object.entries(pipeline.stageBreakdown)
              .filter(([, v]) => v.count > 0)
              .map(([stage, v]) => `  ${stage}: ${v.count} deals, $${v.value.toLocaleString()}`)
              .join('\n');
            return {
              success: true,
              output: `Pipeline Summary:\n  Total value: $${pipeline.totalValue.toLocaleString()}\n  Weighted value: $${Math.round(pipeline.weightedValue).toLocaleString()}\n\nBy stage:\n${breakdown}`,
            };
          }

          case 'create': {
            if (!deal?.title) return { success: false, output: '', error: 'Deal title is required' };
            return { success: true, output: `Deal "${deal.title}" created in stage "${deal.stage ?? 'lead'}".` };
          }

          case 'update': {
            if (!deal?.id) return { success: false, output: '', error: 'Deal id is required for update' };
            return { success: true, output: `Deal "${deal.id}" updated.` };
          }

          case 'move': {
            if (!deal?.id || !deal?.stage) return { success: false, output: '', error: 'Deal id and stage are required to move' };
            return { success: true, output: `Deal "${deal.id}" moved to stage "${deal.stage}".` };
          }

          default:
            return { success: false, output: '', error: `Unknown action: ${action}` };
        }
      } catch (error) {
        return { success: false, output: '', error: error instanceof Error ? error.message : String(error) };
      }
    },
  };
}
