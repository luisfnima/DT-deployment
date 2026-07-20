export interface Log {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  source: 'Scheduler' | 'CRM' | 'Renderer' | 'Sender' | 'System';
  message: string;
  reportId?: string;
}
