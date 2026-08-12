"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReportRepository_1 = require("../repositories/ReportRepository");
const ReportEngine_1 = require("../services/reports/ReportEngine");
const router = (0, express_1.Router)();
const engine = new ReportEngine_1.ReportEngine();
// Get all reports
router.get('/', (req, res) => {
    res.json(ReportRepository_1.ReportRepository.getReports());
});
// Create report
router.post('/', (req, res) => {
    const { name, description, status, time, frequency, channel, recipientIds, timezone, retryCount, template, isScreenshot, loginUrl, username, password, usernameSelector, passwordSelector, submitSelector, targetUrls, screenshotTargets } = req.body;
    if (!name || !time || !frequency) {
        return res.status(400).json({ error: 'Faltan campos requeridos (nombre, hora, frecuencia)' });
    }
    const report = ReportRepository_1.ReportRepository.addReport({
        name,
        description: description || '',
        status: status || 'inactive',
        time,
        frequency,
        channel: channel || 'whatsapp',
        recipientIds: Array.isArray(recipientIds) ? recipientIds : [],
        timezone: timezone || 'America/Lima',
        retryCount: typeof retryCount === 'number' ? retryCount : 3,
        template: template || 'default',
        isScreenshot: !!isScreenshot,
        loginUrl: loginUrl || '',
        username: username || '',
        password: password || '',
        usernameSelector: usernameSelector || '',
        passwordSelector: passwordSelector || '',
        submitSelector: submitSelector || '',
        targetUrls: Array.isArray(targetUrls) ? targetUrls : [],
        screenshotTargets: Array.isArray(screenshotTargets) ? screenshotTargets : []
    });
    res.status(201).json(report);
});
// Update report
router.put('/:id', (req, res) => {
    const updated = ReportRepository_1.ReportRepository.updateReport(req.params.id, req.body);
    if (!updated) {
        return res.status(404).json({ error: 'Reporte no encontrado' });
    }
    res.json(updated);
});
// Delete report
router.delete('/:id', (req, res) => {
    const deleted = ReportRepository_1.ReportRepository.deleteReport(req.params.id);
    if (!deleted) {
        return res.status(404).json({ error: 'Reporte no encontrado' });
    }
    res.json({ success: true });
});
// Execute report manually (Production trigger)
router.post('/:id/run', async (req, res) => {
    const success = await engine.executeReport(req.params.id, 'manual');
    if (success) {
        res.json({ success: true, message: 'Reporte ejecutado y enviado con éxito.' });
    }
    else {
        res.status(500).json({ success: false, error: 'La ejecución del reporte falló. Revisa los logs.' });
    }
});
// Execute report as a test (Prueba trigger)
router.post('/:id/run-test', async (req, res) => {
    const success = await engine.executeReport(req.params.id, 'test');
    if (success) {
        res.json({ success: true, message: 'Reporte de prueba enviado con éxito.' });
    }
    else {
        res.status(500).json({ success: false, error: 'Fallo al enviar reporte de prueba. Revisa los logs.' });
    }
});
// Generate HTML preview for UI rendering
router.get('/:id/preview', async (req, res) => {
    try {
        const html = await engine.generatePreview(req.params.id);
        res.json({ success: true, html });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message || 'Fallo al generar vista previa.' });
    }
});
exports.default = router;
