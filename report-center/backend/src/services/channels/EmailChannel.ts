import { IMessageProvider, IMessageContent } from '../../interfaces/IMessageProvider';

export class EmailChannel implements IMessageProvider {
  public async sendMessage(recipient: string, content: IMessageContent): Promise<boolean> {
    console.log(`[Email Channel] Enviando reporte por correo a ${recipient}...`);
    // Stub implementation
    return true;
  }
}
