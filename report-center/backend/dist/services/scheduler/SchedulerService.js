"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const ReportRepository_1 = require("../../repositories/ReportRepository");
const ReportEngine_1 = require("../reports/ReportEngine");
const scheduler_1 = require("../../config/scheduler");
class SchedulerService {
    constructor() {
        this.intervalId = null;
        this.running = false;
        this.executedMinutes = new Set(); // Keep track of executed time slots to avoid double runs
        this.lastKeepAliveTime = 0;
        this.reportEngine = new ReportEngine_1.ReportEngine();
    }
    start() {
        if (this.running)
            return;
        this.running = true;
        ReportRepository_1.ReportRepository.updateStatus({ scheduler: 'running' });
        ReportRepository_1.ReportRepository.addLog('Scheduler', 'Servicio del Scheduler iniciado en producción.', 'success');
        this.intervalId = setInterval(async () => {
            await this.checkAndExecute();
        }, scheduler_1.schedulerConfig.checkIntervalMs);
    }
    stop() {
        if (!this.running)
            return;
        this.running = false;
        ReportRepository_1.ReportRepository.updateStatus({ scheduler: 'stopped' });
        ReportRepository_1.ReportRepository.addLog('Scheduler', 'Servicio del Scheduler detenido.', 'warning');
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    isRunning() {
        return this.running;
    }
    sendKeepAlivePings() {
        const instances = ['smart-telco', 'contraofertas-dreamteam', 'dreamteam'];
        const evolutionUrl = 'https://evolution-api-smart.onrender.com';
        const evolutionApiKey = 'NEXO_SECRET_KEY_2026';
        instances.forEach(instance => {
            fetch(`${evolutionUrl}/instance/connectionState/${instance}`, {
                headers: { 'apikey': evolutionApiKey }
            }).catch(() => { });
        });
    }
    async checkAndExecute() {
        const nowTime = Date.now();
        if (nowTime - this.lastKeepAliveTime > 300000) { // Keep-Alive every 5 minutes
            this.lastKeepAliveTime = nowTime;
            this.sendKeepAlivePings();
        }
        const now = new Date();
        // Get time in America/Lima timezone format HH:MM
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Lima',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        let timeStr = '';
        try {
            timeStr = formatter.format(now); // e.g. "08:00"
        }
        catch (e) {
            timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        }
        const todayStr = now.toISOString().split('T')[0];
        const timeKey = `${todayStr}_${timeStr}`;
        // Skip if we already checked/ran this specific minute slot
        if (this.executedMinutes.has(timeKey)) {
            return;
        }
        this.executedMinutes.add(timeKey);
        // Keep set size reasonable
        if (this.executedMinutes.size > 1440) {
            this.executedMinutes.clear();
        }
        const reports = ReportRepository_1.ReportRepository.getReports();
        const activeReports = reports.filter(r => r.status === 'active');
        if (activeReports.length === 0) {
            return;
        }
        // Calculate current day of the week in Lima timezone
        const tempFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Lima',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
        const limaDateStr = tempFormatter.format(now);
        const dayOfWeek = new Date(limaDateStr).getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        // Find reports whose configured trigger time and day matches current slot
        const matchedReports = activeReports.filter(r => {
            // 1. Check time (support comma-separated multiple times e.g. "08:00, 18:00, 22:30")
            const times = (r.time || '').split(',').map(t => t.trim());
            const timeMatches = times.includes(timeStr);
            // 2. Check days of week (if defined, check if today is active)
            const days = r.daysOfWeek && r.daysOfWeek.length > 0
                ? r.daysOfWeek
                : [0, 1, 2, 3, 4, 5, 6]; // Default to all days
            const dayMatches = days.includes(dayOfWeek);
            return timeMatches && dayMatches;
        });
        for (const report of matchedReports) {
            ReportRepository_1.ReportRepository.addLog('Scheduler', `⏰ Hora programada coincidente (${timeStr}) encontrada para "${report.name}". Iniciando flujo...`, 'info', report.id);
            // Execute with built-in retry logic: try up to 3 times if error occurs
            let success = false;
            const maxRetries = 3;
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    if (attempt > 1) {
                        ReportRepository_1.ReportRepository.addLog('Scheduler', `🔄 Reintento de ejecución ${attempt}/${maxRetries} para "${report.name}"...`, 'warning', report.id);
                    }
                    success = await this.reportEngine.executeReport(report.id);
                    if (success) {
                        break;
                    }
                }
                catch (err) {
                    ReportRepository_1.ReportRepository.addLog('System', `❌ Intento ${attempt} fallido para "${report.name}": ${err.message}`, 'error', report.id);
                }
                if (!success && attempt < maxRetries) {
                    // Wait 2 seconds before retry
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
            if (!success) {
                ReportRepository_1.ReportRepository.addLog('System', `🚨 Fallo crítico: Reporte "${report.name}" agotó todos los reintentos (${maxRetries}) sin éxito.`, 'error', report.id);
            }
        }
    }
}
exports.SchedulerService = SchedulerService;
