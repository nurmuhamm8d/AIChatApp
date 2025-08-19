import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DrawerLayoutAndroid, FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, Divider, IconButton, List, Surface, Text, TextInput, useTheme, Dialog, Portal } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { i18n } from '../../i18n';
import { verticalScale, scale, isTablet } from '../../utils/responsive';
import { openAIService } from '../../services/openai';

type Role = 'user' | 'assistant';
type Message = { id: string; role: Role; content: string; createdAt: number };
type Conversation = { id: string; title: string; messages: Message[]; createdAt: number };

const STORE_KEY = '@conv_v1';

const Chat: React.FC = () => {
  const { colors } = useTheme();
  const drawerRef = useRef<DrawerLayoutAndroid>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const [renameOpen, setRenameOpen] = useState(false);
  const [renameText, setRenameText] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORE_KEY);
        if (raw) {
          const parsed: Conversation[] = JSON.parse(raw);
          setConversations(parsed);
          setActiveId(parsed[0]?.id ?? null);
        } else {
          const first: Conversation = {
            id: `c_${Date.now()}`,
            title: i18n.t('newChat', 'New Chat'),
            messages: [],
            createdAt: Date.now(),
          };
          setConversations([first]);
          setActiveId(first.id);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORE_KEY, JSON.stringify(conversations)).catch(() => {});
  }, [conversations]);

  const active = useMemo(() => conversations.find(c => c.id === activeId) ?? null, [conversations, activeId]);

  const createConversation = () => {
    const c: Conversation = {
      id: `c_${Date.now()}`,
      title: i18n.t('newChat', 'New Chat'),
      messages: [],
      createdAt: Date.now(),
    };
    setConversations(prev => [c, ...prev]);
    setActiveId(c.id);
  };

  const ask = async () => {
    const text = input.trim();
    if (!text || sending || !active) return;
    setInput('');
    const userMsg: Message = { id: `m_${Date.now()}`, role: 'user', content: text, createdAt: Date.now() };
    setConversations(prev => prev.map(c => c.id === active.id ? { ...c, messages: [...c.messages, userMsg] } : c));
    setSending(true);
    try {
      const reply = await openAIService.chat([{ role: 'user', content: text }]);
      const bot: Message = { id: `m_${Date.now()}_r`, role: 'assistant', content: reply || '…', createdAt: Date.now() };
      setConversations(prev => prev.map(c => c.id === active.id ? { ...c, messages: [...c.messages, bot] } : c));
    } catch {
      const bot: Message = { id: `m_${Date.now()}_e`, role: 'assistant', content: 'Error', createdAt: Date.now() };
      setConversations(prev => prev.map(c => c.id === active.id ? { ...c, messages: [...c.messages, bot] } : c));
    } finally {
      setSending(false);
    }
  };

  const openRename = () => {
    if (!active) return;
    setRenameText(active.title);
    setRenameOpen(true);
  };
  const saveRename = () => {
    if (!active) return;
    const t = renameText.trim() || i18n.t('newChat', 'New Chat');
    setConversations(prev => prev.map(c => c.id === active.id ? { ...c, title: t } : c));
    setRenameOpen(false);
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => {
      const rest = prev.filter(c => c.id !== id);
      const nextActive = rest[0]?.id ?? null;
      setActiveId(nextActive);
      return rest;
    });
  };

  const drawerContent = (
    <Surface style={[styles.drawer, { backgroundColor: colors.background }]}>
      <Text variant="titleMedium" style={styles.drawerTitle}>{i18n.t('conversations', 'Conversations')}</Text>
      <List.Section>
        {conversations.map(c => (
          <List.Item
            key={c.id}
            title={c.title}
            onPress={() => {
              setActiveId(c.id);
              drawerRef.current?.closeDrawer();
            }}
            left={p => <List.Icon {...p} icon={c.id === activeId ? 'chat-processing' : 'chat-outline'} />}
            right={() => (
              <IconButton icon="delete" onPress={() => deleteConversation(c.id)} />
            )}
          />
        ))}
        <Divider />
        <List.Item
          title={i18n.t('newConversation', 'New conversation')}
          onPress={() => {
            createConversation();
            drawerRef.current?.closeDrawer();
          }}
          left={p => <List.Icon {...p} icon="plus" />}
        />
      </List.Section>
    </Surface>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={Math.min(320, Math.round(Platform.OS === 'android' ? 0.85 * (isTablet() ? 700 : 360) : 320))}
      drawerPosition="left"
      renderNavigationView={() => drawerContent}
    >
      <KeyboardAvoidingView style={[styles.root, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Surface style={styles.topBar} elevation={0}>
          <View style={styles.topRow}>
            <IconButton icon="menu" onPress={() => drawerRef.current?.openDrawer()} />
            <Text variant="titleLarge" style={styles.chatTitle}>{active?.title ?? i18n.t('newChat', 'New Chat')}</Text>
            <IconButton icon="pencil" onPress={openRename} />
            <IconButton icon="plus" onPress={createConversation} />
            <Text style={styles.newConvText}>{i18n.t('newConversation', 'New conversation')}</Text>
          </View>
        </Surface>

        <FlatList
          data={active?.messages ?? []}
          keyExtractor={m => m.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.role === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
              <Text style={item.role === 'user' ? styles.textUser : styles.textBot}>{item.content}</Text>
            </View>
          )}
        />

        <View style={styles.composeRow}>
          <TextInput
            style={styles.input}
            mode="outlined"
            placeholder={i18n.t('typeMessage', 'Message…')}
            value={input}
            onChangeText={setInput}
            keyboardType="default"
            inputMode="text"
            autoCorrect
            autoCapitalize="sentences"
            returnKeyType="send"
            onSubmitEditing={ask}
            disabled={sending}
          />
          <Button mode="contained" onPress={ask} disabled={!input.trim() || sending} loading={sending} style={styles.sendBtn}>
            {i18n.t('send', 'Send')}
          </Button>
        </View>

        <Portal>
          <Dialog visible={renameOpen} onDismiss={() => setRenameOpen(false)}>
            <Dialog.Title>{i18n.t('renameChat', 'Rename chat')}</Dialog.Title>
            <Dialog.Content>
              <TextInput mode="outlined" value={renameText} onChangeText={setRenameText} />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setRenameOpen(false)}>{i18n.t('cancel', 'Cancel')}</Button>
              <Button onPress={saveRename}>{i18n.t('save', 'Save')}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </KeyboardAvoidingView>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: { paddingHorizontal: scale(8), paddingTop: verticalScale(4) },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  chatTitle: { flexShrink: 1, maxWidth: '40%', fontWeight: '600' },
  newConvText: { marginLeft: scale(4), opacity: 0.7 },
  listContent: { padding: scale(12), paddingBottom: verticalScale(12) },
  bubble: { borderRadius: 12, padding: 12, marginBottom: 8, maxWidth: '90%' },
  bubbleUser: { alignSelf: 'flex-end', backgroundColor: '#5E35B1' },
  bubbleBot: { alignSelf: 'flex-start', backgroundColor: 'rgba(0,0,0,0.06)' },
  textUser: { color: '#fff' },
  textBot: { color: '#000' },
  composeRow: { flexDirection: 'row', alignItems: 'center', gap: scale(8), padding: scale(12), paddingTop: 0 },
  input: { flex: 1 },
  sendBtn: { alignSelf: 'flex-end', height: 44, justifyContent: 'center' },
  drawer: { flex: 1, paddingTop: verticalScale(16) },
  drawerTitle: { alignSelf: 'center', marginBottom: verticalScale(8) },
});

export default Chat;
