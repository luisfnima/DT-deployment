"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const env_1 = require("./config/env");
const ReportRepository_1 = require("./repositories/ReportRepository");
const port = env_1.env.PORT;
server_1.default.listen(port, () => {
    console.log(`[DreamTeam Server] Running on http://localhost:${port}`);
    ReportRepository_1.ReportRepository.addLog('System', `Servidor iniciado en el puerto ${port}`, 'success');
});
