"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportRepository = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const helpers_1 = require("../services/reports/helpers");
const DATA_DIR = path_1.default.join(__dirname, '../../data');
const REPORTS_DIR = path_1.default.join(DATA_DIR, 'reports');
const RECIPIENTS_PATH = path_1.default.join(DATA_DIR, 'recipients.json');
const CONFIG_PATH = path_1.default.join(DATA_DIR, 'config.json');
const HISTORY_PATH = path_1.default.join(DATA_DIR, 'history.json');
const LOGS_PATH = path_1.default.join(DATA_DIR, 'logs.json');
class ReportRepository {
    static ensureDataDir() {
        if (!fs_1.default.existsSync(DATA_DIR)) {
            fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
        }
        if (!fs_1.default.existsSync(REPORTS_DIR)) {
            fs_1.default.mkdirSync(REPORTS_DIR, { recursive: true });
        }
    }
    static initialize() {
        if (this.initialized)
            return;
        this.ensureDataDir();
        // 1. Seed Recipients
        if (!fs_1.default.existsSync(RECIPIENTS_PATH)) {
            const defaultRecipients = [
                {
                    id: '1',
                    name: 'Pruebas Generales',
                    description: 'Destinatario de pruebas por defecto',
                    channel: 'whatsapp',
                    value: '+51 987 654 321',
                    status: 'active',
                    priority: 1,
                    tags: ['pruebas', 'dev'],
                    allowedWindow: { start: '08:00', end: '22:00' },
                    observations: 'Número de prueba inicial para el MVP',
                    createdAt: new Date().toISOString()
                }
            ];
            fs_1.default.writeFileSync(RECIPIENTS_PATH, JSON.stringify(defaultRecipients, null, 2), 'utf8');
        }
        // 2. Seed Reports (individual files)
        const reportSeeds = [
            {
                id: '1',
                name: 'PDT Instalar',
                description: 'Reporte diario matutino de ventas en estado PDT DE INSTALAR con fecha de instalación pendiente.',
                status: 'active',
                time: '08:00',
                frequency: 'daily',
                channel: 'whatsapp',
                recipientIds: ['1'],
                timezone: 'America/Lima',
                retryCount: 3,
                template: 'default'
            },
            {
                id: '2',
                name: 'Seguimiento BO',
                description: 'Reporte nocturno de seguimiento de Back Office, mostrando fidelizaciones y contraofertas.',
                status: 'active',
                time: '18:00',
                frequency: 'daily',
                channel: 'whatsapp',
                recipientIds: ['1'],
                timezone: 'America/Lima',
                retryCount: 3,
                template: 'default'
            },
            {
                id: '3',
                name: 'Instaladas Hoy',
                description: 'Reporte consolidado de ventas que han sido confirmadas e instaladas durante el día.',
                status: 'inactive',
                time: '18:30',
                frequency: 'daily',
                channel: 'whatsapp',
                recipientIds: ['1'],
                timezone: 'America/Lima',
                retryCount: 3,
                template: 'default'
            },
            {
                id: '4',
                name: 'Canceladas Hoy',
                description: 'Reporte diario de bajas y cancelaciones de ventas registradas en el CRM.',
                status: 'inactive',
                time: '19:00',
                frequency: 'daily',
                channel: 'whatsapp',
                recipientIds: ['1'],
                timezone: 'America/Lima',
                retryCount: 3,
                template: 'default'
            },
            {
                id: '5',
                name: 'Proceso Hoy',
                description: 'Reporte general de ventas que continúan en proceso de validación o espera.',
                status: 'inactive',
                time: '19:30',
                frequency: 'daily',
                channel: 'whatsapp',
                recipientIds: ['1'],
                timezone: 'America/Lima',
                retryCount: 3,
                template: 'default'
            }
        ];
        reportSeeds.forEach(seed => {
            const filePath = path_1.default.join(REPORTS_DIR, `${seed.id}.json`);
            if (!fs_1.default.existsSync(filePath)) {
                const fullReport = {
                    ...seed,
                    createdAt: new Date().toISOString(),
                    nextExecutionAt: seed.status === 'active'
                        ? (0, helpers_1.calculateNextExecution)(seed.time || '08:00', seed.daysOfWeek, seed.timezone || 'America/Lima')
                        : undefined
                };
                fs_1.default.writeFileSync(filePath, JSON.stringify(fullReport, null, 2), 'utf8');
            }
        });
        // 3. Seed Config / SystemStatus
        if (!fs_1.default.existsSync(CONFIG_PATH)) {
            const defaultStatus = {
                scheduler: 'running',
                evolutionApi: 'connected',
                crmApi: 'connected',
                averageExecutionTimeMs: 1546,
                sentToday: 1,
                failedToday: 0
            };
            fs_1.default.writeFileSync(CONFIG_PATH, JSON.stringify(defaultStatus, null, 2), 'utf8');
        }
        // 4. Seed History
        if (!fs_1.default.existsSync(HISTORY_PATH)) {
            const defaultHistory = [
                {
                    id: 'h1',
                    reportId: '1',
                    reportName: 'PDT Instalar',
                    executedAt: new Date(Date.now() - 1800000).toISOString(),
                    status: 'success',
                    durationMs: 1540,
                    channel: 'WhatsApp (Evolution API)',
                    recipient: 'Pruebas Generales (+51 987 654 321)',
                    executionType: 'automatic'
                }
            ];
            fs_1.default.writeFileSync(HISTORY_PATH, JSON.stringify(defaultHistory, null, 2), 'utf8');
        }
        // 5. Seed Logs
        if (!fs_1.default.existsSync(LOGS_PATH)) {
            const defaultLogs = [
                {
                    id: 'l1',
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    level: 'info',
                    source: 'System',
                    message: 'Servicio de distribución de reportes iniciado correctamente.'
                }
            ];
            fs_1.default.writeFileSync(LOGS_PATH, JSON.stringify(defaultLogs, null, 2), 'utf8');
        }
        this.initialized = true;
        // Recalculate nextExecutionAt on startup for active reports
        try {
            const files = fs_1.default.readdirSync(REPORTS_DIR);
            files.forEach(file => {
                if (file.endsWith('.json')) {
                    const filePath = path_1.default.join(REPORTS_DIR, file);
                    const content = fs_1.default.readFileSync(filePath, 'utf8');
                    const report = JSON.parse(content);
                    if (report.status === 'active') {
                        const nextExec = (0, helpers_1.calculateNextExecution)(report.time, report.daysOfWeek, report.timezone);
                        if (report.nextExecutionAt !== nextExec) {
                            const updatedReport = { ...report, nextExecutionAt: nextExec };
                            fs_1.default.writeFileSync(filePath, JSON.stringify(updatedReport, null, 2), 'utf8');
                        }
                    }
                }
            });
        }
        catch (err) {
            console.error('Failed to recalculate next executions on initialization:', err);
        }
    }
    // --- REPORTS ---
    static getReports() {
        this.initialize();
        try {
            const files = fs_1.default.readdirSync(REPORTS_DIR);
            const reports = [];
            files.forEach(file => {
                if (file.endsWith('.json')) {
                    const content = fs_1.default.readFileSync(path_1.default.join(REPORTS_DIR, file), 'utf8');
                    reports.push(JSON.parse(content));
                }
            });
            return reports.sort((a, b) => Number(a.id) - Number(b.id));
        }
        catch (e) {
            console.error('Error reading reports directory:', e);
            return [];
        }
    }
    static getReportById(id) {
        this.initialize();
        const filePath = path_1.default.join(REPORTS_DIR, `${id}.json`);
        if (!fs_1.default.existsSync(filePath))
            return undefined;
        try {
            return JSON.parse(fs_1.default.readFileSync(filePath, 'utf8'));
        }
        catch (e) {
            return undefined;
        }
    }
    static addReport(report) {
        this.initialize();
        const reports = this.getReports();
        const nextId = reports.length > 0 ? String(Math.max(...reports.map(r => Number(r.id))) + 1) : '1';
        const newReport = {
            ...report,
            id: nextId,
            createdAt: new Date().toISOString()
        };
        if (newReport.status === 'active') {
            newReport.nextExecutionAt = (0, helpers_1.calculateNextExecution)(newReport.time, newReport.daysOfWeek, newReport.timezone);
        }
        const filePath = path_1.default.join(REPORTS_DIR, `${nextId}.json`);
        fs_1.default.writeFileSync(filePath, JSON.stringify(newReport, null, 2), 'utf8');
        this.addLog('Scheduler', `Nuevo reporte registrado: "${newReport.name}"`, 'success');
        return newReport;
    }
    static updateReport(id, updated) {
        this.initialize();
        const report = this.getReportById(id);
        if (!report)
            return undefined;
        const newReport = { ...report, ...updated };
        if (newReport.status === 'active') {
            newReport.nextExecutionAt = (0, helpers_1.calculateNextExecution)(newReport.time, newReport.daysOfWeek, newReport.timezone);
        }
        else if (newReport.status === 'inactive') {
            newReport.nextExecutionAt = undefined;
        }
        const filePath = path_1.default.join(REPORTS_DIR, `${id}.json`);
        fs_1.default.writeFileSync(filePath, JSON.stringify(newReport, null, 2), 'utf8');
        this.addLog('Scheduler', `Reporte "${newReport.name}" actualizado.`, 'info');
        return newReport;
    }
    static deleteReport(id) {
        this.initialize();
        const filePath = path_1.default.join(REPORTS_DIR, `${id}.json`);
        if (!fs_1.default.existsSync(filePath))
            return false;
        try {
            const report = this.getReportById(id);
            fs_1.default.unlinkSync(filePath);
            if (report) {
                this.addLog('Scheduler', `Reporte "${report.name}" eliminado.`, 'warning');
            }
            return true;
        }
        catch (e) {
            return false;
        }
    }
    // --- RECIPIENTS ---
    static getRecipients() {
        this.initialize();
        try {
            if (!fs_1.default.existsSync(RECIPIENTS_PATH))
                return [];
            return JSON.parse(fs_1.default.readFileSync(RECIPIENTS_PATH, 'utf8'));
        }
        catch (e) {
            return [];
        }
    }
    static getRecipientById(id) {
        return this.getRecipients().find(r => r.id === id);
    }
    static addRecipient(recipient) {
        this.initialize();
        const recipients = this.getRecipients();
        const nextId = recipients.length > 0 ? String(Math.max(...recipients.map(r => Number(r.id))) + 1) : '1';
        const newRecipient = {
            ...recipient,
            id: nextId,
            createdAt: new Date().toISOString()
        };
        recipients.push(newRecipient);
        fs_1.default.writeFileSync(RECIPIENTS_PATH, JSON.stringify(recipients, null, 2), 'utf8');
        this.addLog('System', `Destinatario creado: "${newRecipient.name}"`, 'success');
        return newRecipient;
    }
    static updateRecipient(id, updated) {
        this.initialize();
        const recipients = this.getRecipients();
        const index = recipients.findIndex(r => r.id === id);
        if (index === -1)
            return undefined;
        const updatedRecipient = { ...recipients[index], ...updated };
        recipients[index] = updatedRecipient;
        fs_1.default.writeFileSync(RECIPIENTS_PATH, JSON.stringify(recipients, null, 2), 'utf8');
        this.addLog('System', `Destinatario "${updatedRecipient.name}" actualizado.`, 'info');
        return updatedRecipient;
    }
    static deleteRecipient(id) {
        this.initialize();
        const recipients = this.getRecipients();
        const index = recipients.findIndex(r => r.id === id);
        if (index === -1)
            return false;
        const name = recipients[index].name;
        recipients.splice(index, 1);
        fs_1.default.writeFileSync(RECIPIENTS_PATH, JSON.stringify(recipients, null, 2), 'utf8');
        this.addLog('System', `Destinatario "${name}" eliminado.`, 'warning');
        return true;
    }
    // --- HISTORY ---
    static getHistory() {
        this.initialize();
        try {
            if (!fs_1.default.existsSync(HISTORY_PATH))
                return [];
            return JSON.parse(fs_1.default.readFileSync(HISTORY_PATH, 'utf8'));
        }
        catch (e) {
            return [];
        }
    }
    static addHistoryRecord(record, htmlPreview) {
        this.initialize();
        const history = this.getHistory();
        const newRecord = {
            ...record,
            id: `h_${Date.now()}`,
            executedAt: new Date().toISOString()
        };
        history.push(newRecord);
        fs_1.default.writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2), 'utf8');
        // Update system status file
        const status = this.getStatus();
        if (newRecord.status === 'success') {
            status.sentToday += 1;
            status.lastSendSuccessAt = newRecord.executedAt;
        }
        else {
            status.failedToday += 1;
            status.lastSendErrorAt = newRecord.executedAt;
            status.lastSendErrorMsg = newRecord.errorMessage;
        }
        const allSuccess = history.filter(h => h.status === 'success');
        if (allSuccess.length > 0) {
            const sum = allSuccess.reduce((acc, curr) => acc + curr.durationMs, 0);
            status.averageExecutionTimeMs = Math.round(sum / allSuccess.length);
        }
        this.updateStatus(status);
        // Save html previews
        const previewsPath = path_1.default.join(DATA_DIR, 'previews.json');
        let previews = {};
        if (fs_1.default.existsSync(previewsPath)) {
            try {
                previews = JSON.parse(fs_1.default.readFileSync(previewsPath, 'utf8'));
            }
            catch (e) { }
        }
        if (htmlPreview) {
            previews[newRecord.id] = htmlPreview;
            fs_1.default.writeFileSync(previewsPath, JSON.stringify(previews, null, 2), 'utf8');
        }
        return newRecord;
    }
    static getPreview(id) {
        this.initialize();
        const previewsPath = path_1.default.join(DATA_DIR, 'previews.json');
        if (!fs_1.default.existsSync(previewsPath))
            return undefined;
        try {
            const previews = JSON.parse(fs_1.default.readFileSync(previewsPath, 'utf8'));
            return previews[id];
        }
        catch (e) {
            return undefined;
        }
    }
    // --- LOGS ---
    static getLogs() {
        this.initialize();
        try {
            if (!fs_1.default.existsSync(LOGS_PATH))
                return [];
            return JSON.parse(fs_1.default.readFileSync(LOGS_PATH, 'utf8')).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }
        catch (e) {
            return [];
        }
    }
    static addLog(source, message, level = 'info', reportId) {
        this.initialize();
        const logs = this.getLogs();
        const log = {
            id: `l_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            timestamp: new Date().toISOString(),
            level,
            source,
            message,
            reportId
        };
        logs.unshift(log); // Add at the start since sorted desc
        if (logs.length > 200) {
            logs.pop();
        }
        fs_1.default.writeFileSync(LOGS_PATH, JSON.stringify(logs, null, 2), 'utf8');
        return log;
    }
    // --- SYSTEM STATUS ---
    static getStatus() {
        this.initialize();
        try {
            if (!fs_1.default.existsSync(CONFIG_PATH)) {
                return {
                    scheduler: 'running',
                    evolutionApi: 'connected',
                    crmApi: 'connected',
                    averageExecutionTimeMs: 0,
                    sentToday: 0,
                    failedToday: 0
                };
            }
            return JSON.parse(fs_1.default.readFileSync(CONFIG_PATH, 'utf8'));
        }
        catch (e) {
            return {
                scheduler: 'running',
                evolutionApi: 'connected',
                crmApi: 'connected',
                averageExecutionTimeMs: 0,
                sentToday: 0,
                failedToday: 0
            };
        }
    }
    static updateStatus(updated) {
        this.initialize();
        const status = this.getStatus();
        const newStatus = { ...status, ...updated };
        fs_1.default.writeFileSync(CONFIG_PATH, JSON.stringify(newStatus, null, 2), 'utf8');
        return newStatus;
    }
}
exports.ReportRepository = ReportRepository;
ReportRepository.initialized = false;
