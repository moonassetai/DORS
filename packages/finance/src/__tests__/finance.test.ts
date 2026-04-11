import { describe, it, expect } from 'vitest';
import { createInvoiceTool } from '../tools/invoice.js';
import { createExpenseTool } from '../tools/expense.js';
import { createRevenueTool } from '../tools/revenue.js';
import { createDashboardTool } from '../tools/dashboard.js';
import { createFinanceExtension } from '../index.js';

describe('finance extension', () => {
  it('should create an extension with 4 tools', () => {
    const ext = createFinanceExtension();
    expect(ext.name).toBe('dors-ext-finance');
    expect(ext.version).toBe('0.1.0');
    expect(ext.tools).toHaveLength(4);
  });

  it('should activate and deactivate without error', async () => {
    const ext = createFinanceExtension();
    await expect(ext.activate()).resolves.toBeUndefined();
    await expect(ext.deactivate()).resolves.toBeUndefined();
  });
});

describe('finance_invoice', () => {
  const tool = createInvoiceTool();

  it('should have correct name and parameters', () => {
    expect(tool.name).toBe('finance_invoice');
    expect(tool.parameters).toBeDefined();
  });

  it('should create a draft invoice', async () => {
    const result = await tool.execute({
      action: 'create',
      invoice: { clientName: 'Acme Corp', total: 5000, currency: 'USD' },
    });
    expect(result.success).toBe(true);
    const data = JSON.parse(result.output);
    expect(data.id).toMatch(/^INV-/);
    expect(data.status).toBe('draft');
    expect(data.clientName).toBe('Acme Corp');
    expect(data.total).toBe(5000);
  });

  it('should warn on send action (critical risk)', async () => {
    const result = await tool.execute({
      action: 'send',
      invoice: { id: 'INV-123', clientEmail: 'test@acme.com' },
    });
    expect(result.success).toBe(true);
    const data = JSON.parse(result.output);
    expect(data.warning).toContain('CRITICAL');
  });

  it('should return status for an invoice', async () => {
    const result = await tool.execute({
      action: 'status',
      invoice: { id: 'INV-123' },
    });
    expect(result.success).toBe(true);
    const data = JSON.parse(result.output);
    expect(data.invoiceId).toBe('INV-123');
  });

  it('should list invoices', async () => {
    const result = await tool.execute({ action: 'list' });
    expect(result.success).toBe(true);
    const data = JSON.parse(result.output);
    expect(data.invoices).toEqual([]);
  });

  it('should fail on unknown action', async () => {
    const result = await tool.execute({ action: 'delete' });
    expect(result.success).toBe(false);
    expect(result.error).toContain('Unknown action');
  });
});

describe('finance_expense', () => {
  const tool = createExpenseTool();

  it('should have correct name', () => {
    expect(tool.name).toBe('finance_expense');
  });

  it('should log an expense', async () => {
    const result = await tool.execute({
      action: 'log',
      expense: {
        category: 'software',
        amount: 99,
        currency: 'USD',
        vendor: 'GitHub',
        taxDeductible: true,
      },
    });
    expect(result.success).toBe(true);
    const data = JSON.parse(result.output);
    expect(data.id).toMatch(/^EXP-/);
    expect(data.category).toBe('software');
    expect(data.vendor).toBe('GitHub');
    expect(data.taxDeductible).toBe(true);
  });

  it('should list expenses', async () => {
    const result = await tool.execute({ action: 'list' });
    expect(result.success).toBe(true);
    const data = JSON.parse(result.output);
    expect(data.expenses).toEqual([]);
  });

  it('should return expense categories', async () => {
    const result = await tool.execute({ action: 'categorize' });
    expect(result.success).toBe(true);
    const data = JSON.parse(result.output);
    expect(data.categories).toHaveLength(5);
  });

  it('should fail on unknown action', async () => {
    const result = await tool.execute({ action: 'remove' });
    expect(result.success).toBe(false);
    expect(result.error).toContain('Unknown action');
  });
});

describe('finance_revenue', () => {
  const tool = createRevenueTool();

  it('should have correct name', () => {
    expect(tool.name).toBe('finance_revenue');
  });

  it('should log a revenue entry', async () => {
    const result = await tool.execute({ action: 'log' });
    expect(result.success).toBe(true);
    const data = JSON.parse(result.output);
    expect(data.id).toMatch(/^REV-/);
  });

  it('should generate a revenue report with mock data', async () => {
    const result = await tool.execute({ action: 'report', period: '2026-Q1' });
    expect(result.success).toBe(true);
    const data = JSON.parse(result.output);
    expect(data.period).toBe('2026-Q1');
    expect(data.revenue).toBe(12500);
    expect(data.entries).toHaveLength(2);
  });

  it('should generate a revenue forecast', async () => {
    const result = await tool.execute({ action: 'forecast', period: '2026-Q2' });
    expect(result.success).toBe(true);
    const data = JSON.parse(result.output);
    expect(data.projected).toBe(15000);
    expect(data.trend).toBe('up');
  });

  it('should fail on unknown action', async () => {
    const result = await tool.execute({ action: 'export' });
    expect(result.success).toBe(false);
    expect(result.error).toContain('Unknown action');
  });
});

describe('finance_dashboard', () => {
  const tool = createDashboardTool();

  it('should have correct name', () => {
    expect(tool.name).toBe('finance_dashboard');
  });

  it('should return a monthly financial summary', async () => {
    const result = await tool.execute({ period: 'month' });
    expect(result.success).toBe(true);
    const data = JSON.parse(result.output);
    expect(data.period).toBe('month');
    expect(data.revenue).toBeGreaterThan(0);
    expect(data.expenses).toBeGreaterThan(0);
    expect(data.profit).toBe(data.revenue - data.expenses);
    expect(data.topClients).toHaveLength(3);
    expect(data.topCategories).toHaveLength(3);
  });

  it('should scale values by period', async () => {
    const weekResult = await tool.execute({ period: 'week' });
    const yearResult = await tool.execute({ period: 'year' });
    const weekData = JSON.parse(weekResult.output);
    const yearData = JSON.parse(yearResult.output);
    // year = 48x, week = 1x
    expect(yearData.revenue).toBe(weekData.revenue * 48);
  });

  it('should return YTD summary', async () => {
    const result = await tool.execute({ period: 'ytd' });
    expect(result.success).toBe(true);
    const data = JSON.parse(result.output);
    expect(data.period).toBe('ytd');
    expect(data.taxEstimate).toBeGreaterThan(0);
  });
});
