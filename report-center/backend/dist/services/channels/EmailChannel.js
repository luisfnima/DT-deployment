"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailChannel = void 0;
class EmailChannel {
    async sendMessage(recipient, content) {
        console.log(`[Email Channel] Enviando reporte por correo a ${recipient}...`);
        // Stub implementation
        return true;
    }
}
exports.EmailChannel = EmailChannel;
