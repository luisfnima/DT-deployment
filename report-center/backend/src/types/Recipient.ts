export interface Recipient {
  id: string;
  name: string;
  description?: string;
  channel: 'whatsapp' | 'whatsapp_group' | 'email' | 'telegram' | 'discord' | 'slack';
  value: string;
  status: 'active' | 'inactive';
  priority: number;
  tags: string[];
  allowedWindow?: { start: string; end: string };
  observations?: string;
  lastDeliveryAt?: string;
  createdAt: string;
}
