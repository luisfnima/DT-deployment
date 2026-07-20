import { Router, Request, Response } from 'express';
import { ReportRepository } from '../repositories/ReportRepository';
import { schedulerService } from '../services/scheduler';
import { env } from '../config/env';

const router = Router();

let cachedQr: string | null = null;
let lastQrFetchTime = 0;
const QR_COOLDOWN_MS = 25000; // 25 seconds cache cooldown

// Proxy QR code from WhatsApp Bridge
router.get('/whatsapp/qr', async (req: Request, res: Response) => {
  try {
    const stateUrl = `${env.EVOLUTION_API_URL}/instance/connectionState/dreamteam`;
    const headers = {
      'Content-Type': 'application/json',
      'apikey': env.EVOLUTION_API_KEY
    };

    let stateResponse = await fetch(stateUrl, { headers });
    
    // 1. If instance is not found (404), create it automatically
    if (stateResponse.status === 404) {
      console.log('📢 [Backend] Instancia "dreamteam" no encontrada. Creándola automáticamente en Evolution API...');
      const createUrl = `${env.EVOLUTION_API_URL}/instance/create`;
      const createResponse = await fetch(createUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          instanceName: 'dreamteam',
          token: env.EVOLUTION_API_KEY,
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS'
        })
      });

      if (!createResponse.ok) {
        const errText = await createResponse.text();
        throw new Error(`Fallo al crear la instancia: ${errText}`);
      }

      // Wait a moment and fetch connect state again
      await new Promise(resolve => setTimeout(resolve, 1500));
      stateResponse = await fetch(stateUrl, { headers });
    }

    if (!stateResponse.ok) {
      const errText = await stateResponse.text();
      return res.json({ state: 'error', qr: null, error: `Error checking connectionState: ${errText}` });
    }

    const stateData = await stateResponse.json() as any;
    const isConnected = stateData.instance?.state === 'open';

    if (isConnected) {
      cachedQr = null;
      lastQrFetchTime = 0;
      return res.json({
        state: 'connected',
        qr: null
      });
    }

    // 2. If connecting/disconnected, use cached QR if within cooldown (25s) to avoid Baileys regenerator loop
    const now = Date.now();
    if (cachedQr && (now - lastQrFetchTime < QR_COOLDOWN_MS)) {
      return res.json({
        state: 'connecting',
        qr: cachedQr
      });
    }

    // 3. Grab the new QR code data URL from connect
    const connectUrl = `${env.EVOLUTION_API_URL}/instance/connect/dreamteam`;
    const connectResponse = await fetch(connectUrl, { headers });
    
    if (!connectResponse.ok) {
      return res.json({
        state: 'connecting',
        qr: cachedQr // fallback to cached QR on API error
      });
    }

    const connectData = await connectResponse.json() as any;
    cachedQr = connectData.base64 || null;
    lastQrFetchTime = Date.now();

    res.json({
      state: 'connecting',
      qr: cachedQr
    });
  } catch (err: any) {
    res.json({ state: 'error', qr: null, error: err.message });
  }
});

// Get general status + logs + history in a single stats object or separate endpoints
router.get('/', async (req: Request, res: Response) => {
  const history = ReportRepository.getHistory();
  const recipients = ReportRepository.getRecipients();
  const reports = ReportRepository.getReports();
  const systemStatus = ReportRepository.getStatus();

  // Validate real-time Evolution API connection status asynchronously
  let realEvolutionStatus = 'disconnected';
  try {
    const stateUrl = `${env.EVOLUTION_API_URL}/instance/connectionState/dreamteam`;
    const response = await fetch(stateUrl, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': env.EVOLUTION_API_KEY
      },
      signal: AbortSignal.timeout(2500) // Timeout of 2.5s to prevent freezing if Render is asleep
    });
    if (response.ok) {
      const data = await response.json() as any;
      if (data.instance?.state === 'open') {
        realEvolutionStatus = 'connected';
      }
    }
  } catch (err) {
    // API is offline, unreachable or timed out
    realEvolutionStatus = 'disconnected';
  }

  // Calculate stats in the last 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const executedToday = history.filter(h => new Date(h.executedAt) >= oneDayAgo);
  const sentToday = executedToday.filter(h => h.status === 'success').length;
  const failedToday = executedToday.filter(h => h.status === 'failed').length;

  // Calculate real average latency
  const successRuns = history.filter(h => h.status === 'success');
  const averageExecutionTimeMs = successRuns.length > 0
    ? Math.round(successRuns.reduce((acc, h) => acc + h.durationMs, 0) / successRuns.length)
    : 0;

  // Group executions by day (last 7 days)
  const executionsByDay: Record<string, number> = {};
  const dayFormatter = (dStr: string) => dStr.substring(5, 10); // "MM-DD"
  
  // Initialize last 7 days with 0
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().substring(0, 10);
    executionsByDay[dayFormatter(key)] = 0;
  }

  history.forEach(h => {
    const dateKey = h.executedAt.substring(0, 10);
    const formatted = dayFormatter(dateKey);
    if (executionsByDay[formatted] !== undefined) {
      executionsByDay[formatted]++;
    }
  });

  // Group executions by channel
  const executionsByChannel: Record<string, number> = {
    'whatsapp': 0,
    'whatsapp_group': 0,
    'email': 0
  };
  recipients.forEach(r => {
    const key = r.channel;
    if (executionsByChannel[key] !== undefined) {
      executionsByChannel[key]++;
    }
  });

  // Sincronizar system config status real-time counters & real API connection state
  ReportRepository.updateStatus({
    sentToday,
    failedToday,
    averageExecutionTimeMs,
    evolutionApi: realEvolutionStatus as any
  });

  res.json({
    status: {
      ...systemStatus,
      sentToday,
      failedToday,
      averageExecutionTimeMs
    },
    reportsCount: reports.length,
    activeReportsCount: reports.filter(r => r.status === 'active').length,
    recipientsCount: recipients.length,
    activeRecipientsCount: recipients.filter(r => r.status === 'active').length,
    charts: {
      byDay: Object.entries(executionsByDay).map(([name, value]) => ({ name, value })),
      byChannel: Object.entries(executionsByChannel).map(([name, value]) => ({ name, value })),
      successCount: history.filter(h => h.status === 'success').length,
      failedCount: history.filter(h => h.status === 'failed').length
    }
  });
});

// Toggle Scheduler State
router.post('/scheduler/toggle', (req: Request, res: Response) => {
  if (schedulerService.isRunning()) {
    schedulerService.stop();
  } else {
    schedulerService.start();
  }
  res.json({ status: ReportRepository.getStatus() });
});

// Toggle API States (for simulation)
router.post('/api/toggle', (req: Request, res: Response) => {
  const { target } = req.body; // 'crm' or 'evolution'
  const currentStatus = ReportRepository.getStatus();
  
  if (target === 'crm') {
    const newState = currentStatus.crmApi === 'connected' ? 'disconnected' : 'connected';
    ReportRepository.updateStatus({ crmApi: newState });
    ReportRepository.addLog('CRM', `Estado del CRM cambiado manualmente a: ${newState}`, newState === 'connected' ? 'success' : 'error');
  } else if (target === 'evolution') {
    const newState = currentStatus.evolutionApi === 'connected' ? 'disconnected' : 'connected';
    ReportRepository.updateStatus({ evolutionApi: newState });
    ReportRepository.addLog('Sender', `Estado de Evolution API cambiado manualmente a: ${newState}`, newState === 'connected' ? 'success' : 'error');
  }
  
  res.json({ status: ReportRepository.getStatus() });
});

// Get all logs
router.get('/logs', (req: Request, res: Response) => {
  res.json(ReportRepository.getLogs());
});

// Get execution history
router.get('/history', (req: Request, res: Response) => {
  res.json(ReportRepository.getHistory());
});

// Get report preview HTML by history record ID
router.get('/history/:id/preview', (req: Request, res: Response) => {
  const preview = ReportRepository.getPreview(req.params.id);
  if (!preview) {
    return res.status(404).send('<h3>Vista previa no disponible para esta ejecución o reporte fallido.</h3>');
  }
  res.setHeader('Content-Type', 'text/html');
  res.send(preview);
});

// Reconnect WhatsApp Instance (checks connectionState and refreshes)
router.post('/whatsapp/reconnect', async (req: Request, res: Response) => {
  try {
    const stateUrl = `${env.EVOLUTION_API_URL}/instance/connectionState/dreamteam`;
    const headers = {
      'Content-Type': 'application/json',
      'apikey': env.EVOLUTION_API_KEY
    };
    const response = await fetch(stateUrl, { headers });
    const data = await response.json() as any;
    const isOpen = data.instance?.state === 'open';

    ReportRepository.addLog('Sender', `🔄 Reconexión gatillada. Estado actual: ${data.instance?.state || 'desconocido'}`, isOpen ? 'success' : 'info');
    res.json({ success: true, state: isOpen ? 'connected' : 'connecting' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Reset WhatsApp Instance (Force fresh QR)
router.post('/whatsapp/reset', async (req: Request, res: Response) => {
  try {
    ReportRepository.addLog('Sender', `🗑️ Reseteando sesión de WhatsApp "dreamteam"...`, 'warning');
    const deleteUrl = `${env.EVOLUTION_API_URL}/instance/delete/dreamteam`;
    const headers = {
      'Content-Type': 'application/json',
      'apikey': env.EVOLUTION_API_KEY
    };
    
    // 1. Delete instance
    const deleteRes = await fetch(deleteUrl, { method: 'DELETE', headers });
    
    // 2. Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 3. Create fresh instance
    const createUrl = `${env.EVOLUTION_API_URL}/instance/create`;
    const createResponse = await fetch(createUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        instanceName: 'dreamteam',
        token: env.EVOLUTION_API_KEY,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS'
      })
    });

    if (!createResponse.ok) {
      const errText = await createResponse.text();
      throw new Error(`Fallo al crear la instancia limpia: ${errText}`);
    }

    ReportRepository.addLog('Sender', `✨ Sesión "dreamteam" restablecida. Nuevo código QR listo para escaneo.`, 'success');
    res.json({ success: true });
  } catch (err: any) {
    ReportRepository.addLog('System', `❌ Fallo al resetear sesión de WhatsApp: ${err.message}`, 'error');
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
