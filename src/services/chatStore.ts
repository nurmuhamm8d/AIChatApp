import AsyncStorage from '@react-native-async-storage/async-storage';

export type Message = { id: string; role: 'user' | 'assistant'; content: string; ts: number };
export type Conversation = { id: string; title: string; messages: Message[]; createdAt: number; updatedAt: number };

const KEY = '@conversations_v1';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function loadConversations(): Promise<Conversation[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Conversation[]) : [];
  } catch {
    return [];
  }
}

async function saveConversations(list: Conversation[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

export async function createConversation(title: string): Promise<Conversation[]> {
  const list = await loadConversations();
  const now = Date.now();
  const conv: Conversation = { id: uid(), title, messages: [], createdAt: now, updatedAt: now };
  const next = [...list, conv];
  await saveConversations(next);
  return next;
}

export async function renameConversation(id: string, title: string): Promise<Conversation[]> {
  const list = await loadConversations();
  const next = list.map(c => (c.id === id ? { ...c, title, updatedAt: Date.now() } : c));
  await saveConversations(next);
  return next;
}

export async function appendMessage(id: string, msg: Message): Promise<Conversation[]> {
  const list = await loadConversations();
  const next = list.map(c => (c.id === id ? { ...c, messages: [...c.messages, msg], updatedAt: Date.now() } : c));
  await saveConversations(next);
  return next;
}
