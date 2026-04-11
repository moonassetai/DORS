import type { Tool, ToolResult } from '@dors/core';
import type { FinancialSummary } from '../types.js';

export type DashboardPeriod = 'week' | 'month' | 'quarter' | 'year' | 'ytd';

export function createDashboardTool(): Tool {
  return {
    name: 'finance_dashboard',
    description: 'Generate a financial overview dashboard with revenue, expenses, profit, and tax estimates.',
    parameters: {
      type: 'object',
      properties: {
        period: {
          type: 'string',
          enum: ['week', 'month', 'quarter', 'year', 'ytd'],
          description: 'Dashboard time period',
        },
      },
      required: ['period'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      const period = args.period as DashboardPeriod;

      try {
        const summary: FinancialSummary = buildMockSummary(period);

        return {
          success: true,
          output: JSON.stringify(summary),
        };
      } catch (error) {
        return {
          success: false,
          output: '',
          error: error instanceof Error ? error.message : String(error),
        };
      }
    },
  };
}

function buildMockSummary(period: DashboardPeriod): FinancialSummary {
  const multiplier: Record<DashboardPeriod, number> = {
    week: 1,
    month: 4,
    quarter: 12,
    year: 48,
    ytd: 36,
  };

  const m = multiplier[period];

  return {
    period,
    revenue: 3200 * m,
    expenses: 1800 * m,
    profit: 1400 * m,
    taxEstimate: 350 * m,
    topClients: [
      { name: 'Acme Corp', total: 1800 * m },
      { name: 'Globex Inc', total: 900 * m },
      { name: 'Initech', total: 500 * m },
    ],
    topCategories: [
      { category: 'software', total: 800 * m },
      { category: 'services', total: 600 * m },
      { category: 'hardware', total: 400 * m },
    ],
  };
}
