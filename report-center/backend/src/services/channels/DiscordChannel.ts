import { IMessageProvider, IMessageContent } from '../../interfaces/IMessageProvider';

export class DiscordChannel implements IMessageProvider {
  public async sendMessage(recipient: string, content: IMessageContent): Promise<boolean> {
    console.log(`[Discord Channel] Enviando reporte a Webhook/Usuario ${recipient}...`);
    // Stub implementation
    return true;
  }
}
