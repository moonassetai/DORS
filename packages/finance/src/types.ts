/** ISO 4217 currency code (e.g., 'USD', 'KRW', 'EUR') */
export type Currency = string;

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: Currency;
  status: InvoiceStatus;
  dueDate: string;
  issuedDate: string;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  currency: Currency;
  date: string;
  receipt?: string;
  vendor: string;
  taxDeductible: boolean;
}

export interface RevenueEntry {
  id: string;
  source: string;
  amount: number;
  currency: Currency;
  date: string;
  invoiceId?: string;
  description: string;
}

export interface FinancialSummary {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  taxEstimate: number;
  topClients: { name: string; total: number }[];
  topCategories: { category: string; total: number }[];
}
