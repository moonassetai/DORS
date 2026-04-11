export type CalendarProvider = 'google' | 'outlook' | 'caldav' | 'local';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  location?: string;
  attendees?: string[];
  reminders?: number[];
  recurrence?: string;
}

export type TimeBlockLabel = 'deep_work' | 'meetings' | 'admin' | 'break' | 'personal';

export interface TimeBlock {
  start: string;
  end: string;
  label: TimeBlockLabel;
}

export interface MeetingPrepParticipant {
  name: string;
  context: string;
}

export interface MeetingPrep {
  eventId: string;
  agenda: string[];
  participants: MeetingPrepParticipant[];
  documents: string[];
  talkingPoints: string[];
}

/** Score 0-100 based on energy/context fit */
export interface AvailabilitySlot {
  start: string;
  end: string;
  score: number;
}
