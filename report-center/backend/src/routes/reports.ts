import { Router, Request, Response } from 'express';
import { ReportRepository } from '../repositories/ReportRepository';
import { ReportEngine } from '../services/reports/ReportEngine';

const router = Router();
const engine = new ReportEngine();

// Get all reports
router.get('/', (req: Request, res: Response) => {
  res.json(ReportRepository.getReports());
});

// Create report
router.post('/', (req: Request, res: Response) => {
  const { name, description, status, time, frequency, channel, recipientIds, timezone, retryCount, template } = req.body;
  if (!name || !time || !frequency) {
    return res.status(400).json({ error: 'Faltan campos requeridos (nombre, hora, frecuencia)' });
  }
  const report = ReportRepository.addReport({
    name,
    description: description || '',
    status: status || 'inactive',
    time,
    frequency,
    channel: channel || 'whatsapp',
    recipientIds: Array.isArray(recipientIds) ? recipientIds : [],
    timezone: timezone || 'America/Lima',
    retryCount: typeof retryCount === 'number' ? retryCount : 3,
    template: template || 'default'
  });
  res.status(201).json(report);
});

// Update report
router.put('/:id', (req: Request, res: Response) => {
  const updated = ReportRepository.updateReport(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Reporte no encontrado' });
  }
  res.json(updated);
});

// Delete report
router.delete('/:id', (req: Request, res: Response) => {
  const deleted = ReportRepository.deleteReport(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Reporte no encontrado' });
  }
  res.json({ success: true });
});

// Execute report manually (Production trigger)
router.post('/:id/run', async (req: Request, res: Response) => {
  const success = await engine.executeReport(req.params.id, 'manual');
  if (success) {
    res.json({ success: true, message: 'Reporte ejecutado y enviado con éxito.' });
  } else {
    res.status(500).json({ success: false, error: 'La ejecución del reporte falló. Revisa los logs.' });
  }
});

// Execute report as a test (Prueba trigger)
router.post('/:id/run-test', async (req: Request, res: Response) => {
  const success = await engine.executeReport(req.params.id, 'test');
  if (success) {
    res.json({ success: true, message: 'Reporte de prueba enviado con éxito.' });
  } else {
    res.status(500).json({ success: false, error: 'Fallo al enviar reporte de prueba. Revisa los logs.' });
  }
});

// Generate HTML preview for UI rendering
router.get('/:id/preview', async (req: Request, res: Response) => {
  try {
    const html = await engine.generatePreview(req.params.id);
    res.json({ success: true, html });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Fallo al generar vista previa.' });
  }
});

export default router;
