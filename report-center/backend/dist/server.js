"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const reports_1 = __importDefault(require("./routes/reports"));
const status_1 = __importDefault(require("./routes/status"));
const recipients_1 = __importDefault(require("./routes/recipients"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API Routes
app.use('/api/reports', reports_1.default);
app.use('/api/status', status_1.default);
app.use('/api/recipients', recipients_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
exports.default = app;
