
export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface OpenAIMessage {
  role: MessageRole;
  content: string;
}
