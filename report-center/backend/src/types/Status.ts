export interface SystemStatus {
  scheduler: 'running' | 'stopped';
  evolutionApi: 'connected' | 'disconnected';
  crmApi: 'connected' | 'disconnected';
  averageExecutionTimeMs: number;
  sentToday: number;
  failedToday: number;
  lastSendSuccessAt?: string;
  lastSendErrorAt?: string;
  lastSendErrorMsg?: string;
}
