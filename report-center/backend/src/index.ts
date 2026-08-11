import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import reportsRouter from './routes/reports';
import recipientsRouter from './routes/recipients';
import statusRouter from './routes/status';
import { SchedulerService } from './services/scheduler/SchedulerService';
import { ReportRepository } from './repositories/ReportRepository';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Servir la carpeta public para imágenes estáticas si fuera necesario
app.use('/public', express.static(path.join(__dirname, '../public')));

// Rutas de la API
app.use('/api/reports', reportsRouter);
app.use('/api/recipients', recipientsRouter);
app.use('/api/status', statusRouter);

// Ruta de healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Inicializar Repositorio y Planificador
ReportRepository.init();
const scheduler = new SchedulerService();
scheduler.start();

app.listen(PORT, () => {
  console.log(`🚀 Report Center Backend escuchando en el puerto ${PORT}`);
});
