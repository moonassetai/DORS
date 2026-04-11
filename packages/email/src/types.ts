/** Email provider account configuration. */
export interface EmailAccount {
  /** Provider name (e.g. 'gmail', 'outlook', 'imap'). */
  provider: string;
  /** Reference to stored credentials (never the secret itself). */
  credentialsRef: string;
  /** Human-readable display name for the account. */
  displayName: string;
}

/** A single email message. */
export interface EmailMessage {
  id: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  attachments?: EmailAttachment[];
  threadId?: string;
  date: string;
  labels?: string[];
}

/** Email attachment metadata. */
export interface EmailAttachment {
  filename: string;
  mimeType: string;
  size: number;
}

/** Filter rules for auto-triage. */
export interface EmailFilter {
  /** Glob or regex patterns to match sender addresses. */
  senderPatterns?: string[];
  /** Glob or regex patterns to match subject lines. */
  subjectPatterns?: string[];
  /** Only include emails with these labels. */
  labels?: string[];
  /** Minimum priority threshold. */
  priority?: TriageCategory;
}

/** Draft email ready for review / scheduling. */
export interface EmailDraft {
  id: string;
  subject: string;
  body: string;
  to: string[];
  cc?: string[];
  replyTo?: string;
  /** ISO-8601 datetime for scheduled send. Undefined = send immediately. */
  scheduledSend?: string;
}

/** Triage category from most to least urgent. */
export type TriageCategory = 'urgent' | 'actionable' | 'fyi' | 'archive';

/** Result of triaging a single email. */
export interface TriageResult {
  messageId: string;
  category: TriageCategory;
  suggestedAction: string;
  reason: string;
}
