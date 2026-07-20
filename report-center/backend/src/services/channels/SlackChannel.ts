import { IMessageProvider, IMessageContent } from '../../interfaces/IMessageProvider';

export class SlackChannel implements IMessageProvider {
  public async sendMessage(recipient: string, content: IMessageContent): Promise<boolean> {
    console.log(`[Slack Channel] Enviando reporte a Canal ${recipient}...`);
    // Stub implementation
    return true;
  }
}
