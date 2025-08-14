import { OPENAI_API_KEY } from '@env';
import { Platform } from 'react-native';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class OpenAIService {
  private static instance: OpenAIService;
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';
  private maxTokens = 500;
  private model = 'gpt-3.5-turbo';

  private constructor() {
    this.apiKey = OPENAI_API_KEY;
    
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. Please set OPENAI_API_KEY in your .env file');
    }
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  public async chat(messages: Message[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant. Keep your responses concise and to the point.',
            },
            ...messages,
          ],
          max_tokens: this.maxTokens,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from OpenAI');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content?.trim() || 'No response from AI';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to get response from AI. Please try again later.');
    }
  }

  // For text completion (if needed)
  public async complete(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'text-davinci-003',
          prompt,
          max_tokens: this.maxTokens,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from OpenAI');
      }

      const data = await response.json();
      return data.choices[0]?.text?.trim() || 'No response from AI';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to get response from AI. Please try again later.');
    }
  }

  // Set a custom API key at runtime if needed
  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }
}

export const openAIService = OpenAIService.getInstance();
