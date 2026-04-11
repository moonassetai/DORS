export type DealStage =
  | 'lead'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  tags: string[];
  notes?: string;
  lastContactedAt?: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  contactId: string;
  title: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number;
  expectedCloseDate?: string;
  notes?: string;
}

export interface FollowUp {
  id: string;
  contactId: string;
  dealId?: string;
  type: 'email' | 'call' | 'meeting' | 'task';
  dueDate: string;
  description: string;
  completed: boolean;
}

export interface Pipeline {
  deals: Deal[];
  totalValue: number;
  weightedValue: number;
  stageBreakdown: Record<DealStage, { count: number; value: number }>;
}
