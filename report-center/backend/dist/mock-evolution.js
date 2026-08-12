"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const path_1 = __importDefault(require("path"));
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const qrcode_1 = __importDefault(require("qrcode"));
const app = (0, express_1.default)();
const PORT = 8080;
const API_KEY = 'dreamteam_secret_key';
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '100mb' }));
// WhatsApp connection socket instance
let sock = null;
let connectionState = 'connecting';
let currentQr = null;
async function connectToWhatsApp() {
    const authDir = path_1.default.join(__dirname, '../whatsapp_auth');
    const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(authDir);
    sock = (0, baileys_1.default)({
        auth: state
    });
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            currentQr = qr;
            console.log('\n📱 [WhatsApp Bridge] ¡Código QR Generado! Escanéalo para conectar tu teléfono:\n');
            qrcode_terminal_1.default.generate(qr, { small: true });
        }
        if (connection === 'close') {
            connectionState = 'disconnected';
            currentQr = null;
            console.log('🔴 [WhatsApp Bridge] Conexión cerrada.');
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== baileys_1.DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('🔄 [WhatsApp Bridge] Reconectando...');
                connectToWhatsApp();
            }
        }
        else if (connection === 'open') {
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
const checkApiKey = (req, res, next) => {
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
app.get('/instance/qr/:instance', async (req, res) => {
    if (connectionState === 'connected') {
        return res.json({ state: 'connected', qr: null });
    }
    if (!currentQr) {
        return res.json({ state: connectionState, qr: null });
    }
    try {
        const dataUrl = await qrcode_1.default.toDataURL(currentQr);
        res.json({ state: connectionState, qr: dataUrl });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Send Text Message
app.post('/message/sendText/:instance', async (req, res) => {
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
    }
    catch (error) {
        console.error('Error sending text:', error);
        res.status(500).json({ error: error.message });
    }
});
// Send Media Message (Image)
app.post('/message/sendMedia/:instance', async (req, res) => {
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
    }
    catch (error) {
        console.error('Error sending media:', error);
        res.status(500).json({ error: error.message });
    }
});
app.listen(PORT, () => {
    console.log(`🚀 Servidor WhatsApp Bridge corriendo en http://localhost:${PORT}`);
    console.log(`💡 Escanea el código QR que aparecerá a continuación para conectar tu número real.`);
});
