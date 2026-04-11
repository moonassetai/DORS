import type { Extension } from '@dors/ext';
import type { Tool } from '@dors/core';
import { createInvoiceTool } from './tools/invoice.js';
import { createExpenseTool } from './tools/expense.js';
import { createRevenueTool } from './tools/revenue.js';
import { createDashboardTool } from './tools/dashboard.js';

export function createFinanceExtension(): Extension {
  const tools: Tool[] = [
    createInvoiceTool(),
    createExpenseTool(),
    createRevenueTool(),
    createDashboardTool(),
  ];

  return {
    name: 'dors-ext-finance',
    version: '0.1.0',
    tools,
    async activate() {
      // Future: initialize SQLite tables, load config, etc.
    },
    async deactivate() {
      // Future: close DB connections, flush pending writes
    },
  };
}

export const financeExtension = createFinanceExtension;
export default createFinanceExtension;

export type {
  Currency,
  Invoice,
  InvoiceItem,
  InvoiceStatus,
  Expense,
  RevenueEntry,
  FinancialSummary,
} from './types.js';

export { createInvoiceTool } from './tools/invoice.js';
export { createExpenseTool } from './tools/expense.js';
export { createRevenueTool } from './tools/revenue.js';
export { createDashboardTool } from './tools/dashboard.js';
