"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramChannel = void 0;
class TelegramChannel {
    async sendMessage(recipient, content) {
        console.log(`[Telegram Channel] Enviando reporte a chat ID ${recipient}...`);
        // Stub implementation
        return true;
    }
}
exports.TelegramChannel = TelegramChannel;
