import Constants from 'expo-constants';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class OpenAIService {
  private static instance: OpenAIService;
  private apiKey: string | undefined;
  private baseUrl = 'https://api.openai.com/v1';
  private maxTokens = 500;
  private model = 'gpt-3.5-turbo';

  private constructor() {
    this.apiKey =
      (process.env.EXPO_PUBLIC_OPENAI_API_KEY as string | undefined) ||
      (Constants.expoConfig?.extra as any)?.openaiApiKey;

    if (!this.apiKey) {
      console.warn('OpenAI API key not found. Set EXPO_PUBLIC_OPENAI_API_KEY or app.json -> extra.openaiApiKey');
    }
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) OpenAIService.instance = new OpenAIService();
    return OpenAIService.instance;
  }

  public async chat(messages: Message[]): Promise<string> {
    if (!this.apiKey) throw new Error('OpenAI API key not configured');

    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'system', content: 'You are a concise helpful assistant.' }, ...messages],
        max_tokens: this.maxTokens,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      let msg = 'Failed to get response from OpenAI';
      try {
        const err = await res.json();
        msg = err?.error?.message || msg;
      } catch {}
      throw new Error(msg);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || '…';
  }

  public setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }
}

export const openAIService = OpenAIService.getInstance();
