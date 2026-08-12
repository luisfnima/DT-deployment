"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulerService = void 0;
const SchedulerService_1 = require("./SchedulerService");
exports.schedulerService = new SchedulerService_1.SchedulerService();
// Start the scheduler automatically on load
exports.schedulerService.start();
