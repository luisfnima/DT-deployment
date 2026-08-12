"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReportRepository_1 = require("../repositories/ReportRepository");
const router = (0, express_1.Router)();
// Helper to sync report associations
const syncReportAssociations = (recipientId, reportIds) => {
    const reports = ReportRepository_1.ReportRepository.getReports();
    reports.forEach(report => {
        let changed = false;
        const isAssociated = reportIds.includes(report.id);
        const hasRecipient = report.recipientIds.includes(recipientId);
        if (isAssociated && !hasRecipient) {
            report.recipientIds.push(recipientId);
            changed = true;
        }
        else if (!isAssociated && hasRecipient) {
            report.recipientIds = report.recipientIds.filter(id => id !== recipientId);
            changed = true;
        }
        if (changed) {
            ReportRepository_1.ReportRepository.updateReport(report.id, { recipientIds: report.recipientIds });
        }
    });
};
// Get all recipients (enriched with associated reportIds)
router.get('/', (req, res) => {
    const recipients = ReportRepository_1.ReportRepository.getRecipients();
    const reports = ReportRepository_1.ReportRepository.getReports();
    const enriched = recipients.map(rec => {
        const associatedReportIds = reports
            .filter(rep => rep.recipientIds.includes(rec.id))
            .map(rep => rep.id);
        return {
            ...rec,
            reportIds: associatedReportIds
        };
    });
    res.json(enriched);
});
// Create recipient
router.post('/', (req, res) => {
    const { name, description, channel, value, status, priority, tags, allowedWindow, observations, reportIds } = req.body;
    if (!name || !channel || !value) {
        return res.status(400).json({ error: 'Faltan campos requeridos (nombre, canal, valor)' });
    }
    const recipient = ReportRepository_1.ReportRepository.addRecipient({
        name,
        description: description || '',
        channel,
        value,
        status: status || 'active',
        priority: typeof priority === 'number' ? priority : 1,
        tags: Array.isArray(tags) ? tags : [],
        allowedWindow: allowedWindow || undefined,
        observations: observations || ''
    });
    // Sync reports
    if (Array.isArray(reportIds)) {
        syncReportAssociations(recipient.id, reportIds);
    }
    res.status(201).json({
        ...recipient,
        reportIds: reportIds || []
    });
});
// Update recipient
router.put('/:id', (req, res) => {
    const updated = ReportRepository_1.ReportRepository.updateRecipient(req.params.id, req.body);
    if (!updated) {
        return res.status(404).json({ error: 'Destinatario no encontrado' });
    }
    // Sync reports if provided
    const { reportIds } = req.body;
    if (Array.isArray(reportIds)) {
        syncReportAssociations(req.params.id, reportIds);
    }
    res.json(updated);
});
// Delete recipient
router.delete('/:id', (req, res) => {
    // Sync and remove association first
    syncReportAssociations(req.params.id, []);
    const success = ReportRepository_1.ReportRepository.deleteRecipient(req.params.id);
    if (!success) {
        return res.status(404).json({ error: 'Destinatario no encontrado' });
    }
    res.json({ success: true });
});
exports.default = router;
