import type { Tool, ToolResult } from '@dors/core';
import type { Invoice } from '../types.js';

export function createInvoiceTool(): Tool {
  return {
    name: 'finance_invoice',
    description:
      'Generate, send, and track invoices. NOTE: "send" action requires approval (TaskRisk: critical — sends real money requests).',
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['create', 'send', 'status', 'list'],
          description: 'Invoice action to perform',
        },
        invoice: {
          type: 'object',
          description: 'Partial invoice data',
        },
      },
      required: ['action'],
    },
    async execute(args: Record<string, unknown>): Promise<ToolResult> {
      const action = args.action as string;
      const invoice = args.invoice as Partial<Invoice> | undefined;

      try {
        switch (action) {
          case 'create': {
            const id = `INV-${Date.now()}`;
            return {
              success: true,
              output: JSON.stringify({
                id,
                status: 'draft',
                clientName: invoice?.clientName ?? 'Unknown Client',
                total: invoice?.total ?? 0,
                currency: invoice?.currency ?? 'USD',
                issuedDate: new Date().toISOString().split('T')[0],
                message: `Invoice ${id} created as draft`,
              }),
            };
          }

          case 'send': {
            // Critical action — requires approval in the DORS agent loop
            return {
              success: true,
              output: JSON.stringify({
                warning: 'CRITICAL: This action sends a real payment request',
                invoiceId: invoice?.id ?? 'unknown',
                clientEmail: invoice?.clientEmail ?? 'unknown',
                message: 'Invoice marked for sending (stub — requires approval)',
              }),
            };
          }

          case 'status': {
            return {
              success: true,
              output: JSON.stringify({
                invoiceId: invoice?.id ?? 'unknown',
                status: 'draft',
                message: 'Invoice status retrieved (stub)',
              }),
            };
          }

          case 'list': {
            return {
              success: true,
              output: JSON.stringify({
                invoices: [],
                total: 0,
                message: 'No invoices found (stub)',
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
