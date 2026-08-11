export interface ScreenshotTarget {
  url: string;
  loginUrl?: string;
  username?: string;
  password?: string;
  usernameSelector?: string;
  passwordSelector?: string;
  submitSelector?: string;
}

export interface Report {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  time: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  channel: 'whatsapp' | 'email' | 'telegram';
  recipientIds: string[];
  timezone: string;
  retryCount: number;
  template: string;
  createdAt: string;
  daysOfWeek?: number[];
  lastExecutedAt?: string;
  nextExecutionAt?: string;
  
  // Opciones para Capturas Web Dinámicas
  isScreenshot?: boolean;
  loginUrl?: string;
  username?: string;
  password?: string;
  usernameSelector?: string;
  passwordSelector?: string;
  submitSelector?: string;
  targetUrls?: string[];
  screenshotTargets?: ScreenshotTarget[];
}
