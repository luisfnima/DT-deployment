import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  EVOLUTION_API_KEY: process.env.EVOLUTION_API_KEY || 'NEXO_SECRET_KEY_2026',
  EVOLUTION_API_URL: process.env.EVOLUTION_API_URL || 'http://localhost:8080',
  CRM_API_KEY: process.env.CRM_API_KEY || 'crm_secret_key',
  CRM_API_URL: process.env.CRM_API_URL || 'https://api.crm.dreamteam.com',
  WHATSAPP_RECIPIENT: process.env.WHATSAPP_RECIPIENT || '+51 987 654 321'
};
