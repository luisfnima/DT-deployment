import { Router, Request, Response } from 'express';
import { ReportRepository } from '../repositories/ReportRepository';

const router = Router();

// Helper to sync report associations
const syncReportAssociations = (recipientId: string, reportIds: string[]) => {
  const reports = ReportRepository.getReports();
  reports.forEach(report => {
    let changed = false;
    const isAssociated = reportIds.includes(report.id);
    const hasRecipient = report.recipientIds.includes(recipientId);

    if (isAssociated && !hasRecipient) {
      report.recipientIds.push(recipientId);
      changed = true;
    } else if (!isAssociated && hasRecipient) {
      report.recipientIds = report.recipientIds.filter(id => id !== recipientId);
      changed = true;
    }

    if (changed) {
      ReportRepository.updateReport(report.id, { recipientIds: report.recipientIds });
    }
  });
};

// Get all recipients (enriched with associated reportIds)
router.get('/', (req: Request, res: Response) => {
  const recipients = ReportRepository.getRecipients();
  const reports = ReportRepository.getReports();
  
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
router.post('/', (req: Request, res: Response) => {
  const { name, description, channel, value, status, priority, tags, allowedWindow, observations, reportIds } = req.body;
  
  if (!name || !channel || !value) {
    return res.status(400).json({ error: 'Faltan campos requeridos (nombre, canal, valor)' });
  }

  const recipient = ReportRepository.addRecipient({
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
router.put('/:id', (req: Request, res: Response) => {
  const updated = ReportRepository.updateRecipient(req.params.id, req.body);
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
router.delete('/:id', (req: Request, res: Response) => {
  // Sync and remove association first
  syncReportAssociations(req.params.id, []);
  
  const success = ReportRepository.deleteRecipient(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Destinatario no encontrado' });
  }
  res.json({ success: true });
});

export default router;
