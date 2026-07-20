import express, { Request, Response } from 'express';
import cors from 'cors';
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import path from 'path';
import qrcode from 'qrcode-terminal';
import QRCode from 'qrcode';

const app = express();
const PORT = 8080;
const API_KEY = 'dreamteam_secret_key';

app.use(cors());
app.use(express.json({ limit: '100mb' }));

// WhatsApp connection socket instance
let sock: any = null;
let connectionState = 'connecting';
let currentQr: string | null = null;

async function connectToWhatsApp() {
  const authDir = path.join(__dirname, '../whatsapp_auth');
  const { state, saveCreds } = await useMultiFileAuthState(authDir);

  sock = makeWASocket({
    auth: state
  });

  sock.ev.on('connection.update', (update: any) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      currentQr = qr;
      console.log('\n📱 [WhatsApp Bridge] ¡Código QR Generado! Escanéalo para conectar tu teléfono:\n');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      connectionState = 'disconnected';
      currentQr = null;
      console.log('🔴 [WhatsApp Bridge] Conexión cerrada.');
      const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        console.log('🔄 [WhatsApp Bridge] Reconectando...');
        connectToWhatsApp();
      }
    } else if (connection === 'open') {
      connectionState = 'connected';
      currentQr = null;
      console.log('✅ [WhatsApp Bridge] ¡Conectado con éxito a WhatsApp!');
    }
  });

  sock.ev.on('creds.update', saveCreds);
}

// Start WhatsApp connection
connectToWhatsApp().catch(err => {
  console.error('Error starting WhatsApp connection:', err);
});

// Middleware to check API key (allow connection check endpoints without API key to simplify frontend query)
const checkApiKey = (req: Request, res: Response, next: any) => {
  // Allow GET /instance/qr/:instance bypass API key for ease of use in local iframe/image queries
  if (req.method === 'GET' && req.path.startsWith('/instance/qr')) {
    return next();
  }
  const key = req.headers['apikey'] || req.headers['x-api-key'];
  if (key !== API_KEY) {
    return res.status(403).json({ error: 'Unauthorized: Invalid api key' });
  }
  next();
};

app.use(checkApiKey);

// Get QR Code Image
app.get('/instance/qr/:instance', async (req: Request, res: Response) => {
  if (connectionState === 'connected') {
    return res.json({ state: 'connected', qr: null });
  }
  if (!currentQr) {
    return res.json({ state: connectionState, qr: null });
  }
  try {
    const dataUrl = await QRCode.toDataURL(currentQr);
    res.json({ state: connectionState, qr: dataUrl });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Send Text Message
app.post('/message/sendText/:instance', async (req: Request, res: Response) => {
  const { number, textMessage } = req.body;
  
  if (connectionState !== 'connected') {
    return res.status(400).json({ error: 'WhatsApp session is not connected yet. Please scan the QR code in the server terminal.' });
  }

  try {
    const cleanNumber = number.replace(/\+/g, '').replace(/\s+/g, '');
    const jid = `${cleanNumber}@s.whatsapp.net`;
    
    await sock.sendMessage(jid, { text: textMessage.text });
    console.log(`✅ [WhatsApp Bridge] Mensaje enviado a ${number}: ${textMessage.text}`);
    
    res.json({
      status: 'SUCCESS',
      message: 'Mensaje de texto enviado con éxito'
    });
  } catch (error: any) {
    console.error('Error sending text:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send Media Message (Image)
app.post('/message/sendMedia/:instance', async (req: Request, res: Response) => {
  const { number, mediaMessage } = req.body;

  if (connectionState !== 'connected') {
    return res.status(400).json({ error: 'WhatsApp session is not connected yet. Please scan the QR code in the server terminal.' });
  }

  try {
    const cleanNumber = number.replace(/\+/g, '').replace(/\s+/g, '');
    const jid = `${cleanNumber}@s.whatsapp.net`;
    
    // Parse base64 image data
    let base64Data = mediaMessage.media;
    if (base64Data.startsWith('data:')) {
      base64Data = base64Data.split(';base64,').pop() || '';
    }
    
    const buffer = Buffer.from(base64Data, 'base64');
    
    await sock.sendMessage(jid, {
      image: buffer,
      caption: mediaMessage.caption || ''
    });
    
    console.log(`✅ [WhatsApp Bridge] Mensaje de imagen enviado a ${number}`);
    
    res.json({
      status: 'SUCCESS',
      message: 'Mensaje de media enviado con éxito'
    });
  } catch (error: any) {
    console.error('Error sending media:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor WhatsApp Bridge corriendo en http://localhost:${PORT}`);
  console.log(`💡 Escanea el código QR que aparecerá a continuación para conectar tu número real.`);
});
