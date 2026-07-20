import { SchedulerService } from './SchedulerService';

export const schedulerService = new SchedulerService();
// Start the scheduler automatically on load
schedulerService.start();
