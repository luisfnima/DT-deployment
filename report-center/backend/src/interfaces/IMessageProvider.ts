export interface IMessageContent {
  text?: string;
  html?: string;
  imageBuffer?: Buffer;
  fileName?: string;
}

export interface IMessageProvider {
  sendMessage(recipient: string, content: IMessageContent): Promise<boolean>;
}
