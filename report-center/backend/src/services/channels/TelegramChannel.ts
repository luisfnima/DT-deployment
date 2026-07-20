import { IMessageProvider, IMessageContent } from '../../interfaces/IMessageProvider';

export class TelegramChannel implements IMessageProvider {
  public async sendMessage(recipient: string, content: IMessageContent): Promise<boolean> {
    console.log(`[Telegram Channel] Enviando reporte a chat ID ${recipient}...`);
    // Stub implementation
    return true;
  }
}
