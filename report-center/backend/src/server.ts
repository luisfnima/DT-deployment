import express from 'express';
import cors from 'cors';
import reportsRouter from './routes/reports';
import statusRouter from './routes/status';
import recipientsRouter from './routes/recipients';

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/reports', reportsRouter);
app.use('/api/status', statusRouter);
app.use('/api/recipients', recipientsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
