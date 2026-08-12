import app from './server';
import { env } from './config/env';
import { ReportRepository } from './repositories/ReportRepository';

const port = env.PORT;

app.listen(port, () => {
  console.log(`[DreamTeam Server] Running on http://localhost:${port}`);
  ReportRepository.addLog('System', `Servidor iniciado en el puerto ${port}`, 'success');
});
