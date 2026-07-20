export interface Report {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  time: string; // e.g. "18:00"
  frequency: 'daily' | 'weekly' | 'monthly';
  channel: 'whatsapp' | 'email' | 'telegram';
  recipientIds: string[];
  timezone: string;
  retryCount: number;
  template: string;
  createdAt: string;
  daysOfWeek?: number[]; // [0 = Sunday, 1 = Monday, ..., 6 = Saturday]
  lastExecutedAt?: string;
  nextExecutionAt?: string;
}
