import type { Tool, ToolResult } from '@dors/core';
import type { Expense } from '../types.js';

export function createExpenseTool(): Tool {
  return {
    name: 'finance_expense',
    description: 'Log and categorize expenses for tracking and tax deductions.',
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['log', 'list', 'categorize'],
          description: 'Expense action to perform',
        },
        expense: {
          type: 'object',
          description: 'Partial expense data',
        },
      },
      required: ['action'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      const action = args.action as string;
      const expense = args.expense as Partial<Expense> | undefined;

      try {
        switch (action) {
          case 'log': {
            const id = `EXP-${Date.now()}`;
            return {
              success: true,
              output: JSON.stringify({
                id,
                category: expense?.category ?? 'uncategorized',
                amount: expense?.amount ?? 0,
                currency: expense?.currency ?? 'USD',
                vendor: expense?.vendor ?? 'Unknown',
                taxDeductible: expense?.taxDeductible ?? false,
                date: expense?.date ?? new Date().toISOString().split('T')[0],
                message: `Expense ${id} logged`,
              }),
            };
          }

          case 'list': {
            return {
              success: true,
              output: JSON.stringify({
                expenses: [],
                total: 0,
                message: 'No expenses found (stub)',
              }),
            };
          }

          case 'categorize': {
            return {
              success: true,
              output: JSON.stringify({
                categories: [
                  { category: 'software', count: 0 },
                  { category: 'hardware', count: 0 },
                  { category: 'services', count: 0 },
                  { category: 'travel', count: 0 },
                  { category: 'office', count: 0 },
                ],
                message: 'Expense categories (stub)',
              }),
            };
          }

          default:
            return {
              success: false,
              output: '',
              error: `Unknown action: ${action}`,
            };
        }
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
