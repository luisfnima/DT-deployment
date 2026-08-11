import { Router } from 'express';
import { ReportRepository } from '../repositories/ReportRepository';
import { ReportEngine } from '../services/reports/ReportEngine';

const router = Router();
const engine = new ReportEngine();

// Obtener todos los reportes
router.get('/', (req, res) => {
  try {
    const reports = ReportRepository.getAllReports();
    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un reporte por ID
router.get('/:id', (req, res) => {
  try {
    const report = ReportRepository.getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }
    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un reporte
router.post('/', (req, res) => {
  try {
    const { 
      name, description, status, time, frequency, channel, recipientIds, timezone, retryCount, template, daysOfWeek,
      isScreenshot, loginUrl, username, password, usernameSelector, passwordSelector, submitSelector, targetUrls, screenshotTargets
    } = req.body;

    if (!name || !time || !frequency || !channel || !template) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const newReport = ReportRepository.saveReport({
      name,
      description: description || '',
      status: status || 'active',
      time,
      frequency,
      channel,
      recipientIds: recipientIds || [],
      timezone: timezone || 'America/Lima',
      retryCount: retryCount || 3,
      template,
      daysOfWeek: daysOfWeek || [0, 1, 2, 3, 4, 5, 6],
      isScreenshot: isScreenshot || false,
      loginUrl: loginUrl || '',
      username: username || '',
      password: password || '',
      usernameSelector: usernameSelector || '',
      passwordSelector: passwordSelector || '',
      submitSelector: submitSelector || '',
      targetUrls: targetUrls || [],
      screenshotTargets: screenshotTargets || []
    });

    res.status(201).json(newReport);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un reporte
router.put('/:id', (req, res) => {
  try {
    const existing = ReportRepository.getReportById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }

    const { 
      name, description, status, time, frequency, channel, recipientIds, timezone, retryCount, template, daysOfWeek,
      isScreenshot, loginUrl, username, password, usernameSelector, passwordSelector, submitSelector, targetUrls, screenshotTargets
    } = req.body;

    const updated = ReportRepository.saveReport({
      ...existing,
      name: name ?? existing.name,
      description: description ?? existing.description,
      status: status ?? existing.status,
      time: time ?? existing.time,
      frequency: frequency ?? existing.frequency,
      channel: channel ?? existing.channel,
      recipientIds: recipientIds ?? existing.recipientIds,
      timezone: timezone ?? existing.timezone,
      retryCount: retryCount ?? existing.retryCount,
      template: template ?? existing.template,
      daysOfWeek: daysOfWeek ?? existing.daysOfWeek,
      isScreenshot: isScreenshot ?? existing.isScreenshot,
      loginUrl: loginUrl ?? existing.loginUrl,
      username: username ?? existing.username,
      password: password ?? existing.password,
      usernameSelector: usernameSelector ?? existing.usernameSelector,
      passwordSelector: passwordSelector ?? existing.passwordSelector,
      submitSelector: submitSelector ?? existing.submitSelector,
      targetUrls: targetUrls ?? existing.targetUrls,
      screenshotTargets: screenshotTargets ?? existing.screenshotTargets
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un reporte
router.delete('/:id', (req, res) => {
  try {
    const success = ReportRepository.deleteReport(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Reporte no encontrado' });
    }
    res.json({ message: 'Reporte eliminado' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Ejecución manual inmediata de un reporte
router.post('/:id/run', async (req, res) => {
  try {
    const reportId = req.params.id;
    // Responder inmediatamente para no bloquear el cliente HTTP
    res.json({ message: `Ejecución manual iniciada para el reporte #${reportId}` });

    // Ejecutar en segundo plano
    engine.executeReport(reportId).catch(err => {
      console.error(`Error en ejecución manual del reporte #${reportId}:`, err);
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener previsualización HTML formateada del reporte
router.get('/:id/preview', async (req, res) => {
  try {
    const reportId = req.params.id;
    const html = await engine.generatePreview(reportId);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error: any) {
    res.status(500).send(`<h3>Error generando previsualización: ${error.message}</h3>`);
  }
});

export default router;
