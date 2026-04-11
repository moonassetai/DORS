export type DocumentType =
  | 'proposal'
  | 'contract'
  | 'sow'
  | 'invoice_letter'
  | 'nda'
  | 'report'
  | 'memo';

export interface Document {
  id: string;
  type: DocumentType;
  title: string;
  content: string;
  variables: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface DocumentTemplate {
  id: string;
  type: DocumentType;
  name: string;
  /** Content with {{variable}} placeholders */
  content: string;
  requiredVars: string[];
}

export type ExportFormat = 'pdf' | 'docx' | 'md' | 'html';

export interface ReviewFinding {
  category: 'completeness' | 'tone' | 'legal';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  location?: string;
}
