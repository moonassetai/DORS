import type { Tool, ToolResult } from '@dors/core';

export function createInsightsTool(): Tool {
  return {
    name: 'crm_insights',
    description: 'CRM analytics and insights: pipeline health, activity summary, stale deals, top contacts',
    parameters: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['pipeline_health', 'activity_summary', 'stale_deals', 'top_contacts'],
          description: 'Type of insight to generate',
        },
      },
      required: ['type'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      try {
        const insightType = args.type as string;

        switch (insightType) {
          case 'pipeline_health':
            return {
              success: true,
              output: [
                'Pipeline Health Report',
                '=====================',
                'Active deals: 3',
                'Total pipeline value: $195,000',
                'Weighted value: $126,000',
                'Avg deal size: $65,000',
                'Conversion rate: 67% (last 90 days)',
                '',
                'Warnings:',
                '- 1 deal stalled in "proposal" for 14+ days',
                '- No new leads added this week',
              ].join('\n'),
            };

          case 'activity_summary':
            return {
              success: true,
              output: [
                'Activity Summary (Last 7 Days)',
                '==============================',
                'Emails sent: 5',
                'Calls made: 2',
                'Meetings held: 1',
                'Follow-ups completed: 3',
                'Follow-ups overdue: 1',
                'New contacts added: 0',
                'Deals advanced: 1',
              ].join('\n'),
            };

          case 'stale_deals':
            return {
              success: true,
              output: [
                'Stale Deals (No activity 14+ days)',
                '===================================',
                '1. Foundation Consulting — $50,000 (proposal)',
                '   Last activity: 2026-03-28',
                '   Contact: Hari Seldon',
                '   Recommendation: Send follow-up email or schedule call',
              ].join('\n'),
            };

          case 'top_contacts':
            return {
              success: true,
              output: [
                'Top Contacts (By deal value)',
                '============================',
                '1. Hari Seldon — $170,000 across 2 deals',
                '   Latest: Seldon Plan License (negotiation)',
                '   Last contacted: 2026-04-01',
                '',
                '2. Dors Venabili — $25,000 across 1 deal',
                '   Latest: Streeling Research Grant (qualified)',
                '   Last contacted: N/A',
              ].join('\n'),
            };

          default:
            return { success: false, output: '', error: `Unknown insight type: ${insightType}` };
        }
      } catch (error) {
        return { success: false, output: '', error: error instanceof Error ? error.message : String(error) };
      }
    },
  };
}
