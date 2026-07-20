export interface HistoryRecord {
  id: string;
  reportId: string;
  reportName: string;
  executedAt: string;
  status: 'success' | 'failed';
  durationMs: number;
  errorMessage?: string;
  channel: string;
  recipient: string;
  recordsCount?: number;
  reportSizeKb?: number;
  executionType: 'automatic' | 'manual' | 'test';
}
