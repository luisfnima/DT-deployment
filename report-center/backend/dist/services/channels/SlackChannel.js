"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackChannel = void 0;
class SlackChannel {
    async sendMessage(recipient, content) {
        console.log(`[Slack Channel] Enviando reporte a Canal ${recipient}...`);
        // Stub implementation
        return true;
    }
}
exports.SlackChannel = SlackChannel;
