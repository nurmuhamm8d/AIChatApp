import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  TextInput as RNTextInput,
  Keyboard,
  StatusBar,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { 
  TextInput, 
  Text, 
  useTheme as usePaperTheme, 
  ActivityIndicator, 
  IconButton, 
  Menu,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme as useAppTheme } from '../../theme/ThemeContext';
import { openAIService } from '../../services/openai';
import { i18n } from '../../i18n';
import ChatHistoryService from '../../services/ChatHistoryService';
import { Message } from '../../types';
import { responsiveStyles } from '../../theme/responsiveStyles';

// Constants
const { width, height } = Dimensions.get('window');
const isLandscape = width > height;
const rs = responsiveStyles;

interface ChatProps {}

const Chat: React.FC<ChatProps> = () => {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  
  // Refs
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<RNTextInput>(null);
  
  // Hooks
  const { theme, themeType } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { colors } = usePaperTheme();
  const windowDimensions = useWindowDimensions();
  
  // Load messages on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        // TODO: Load messages from storage
        // const savedMessages = await ChatHistoryService.getMessages();
        // if (savedMessages) {
        //   setMessages(savedMessages);
        // }
      } catch (error) {
        console.error('Error loading messages', error);
        setError('Failed to load messages');
      }
    };
    
    loadMessages();
  }, []);
  
  // Save messages when they change
  useEffect(() => {
    const saveMessages = async () => {
      try {
        // await ChatHistoryService.saveMessages(messages);
      } catch (error) {
        console.error('Error saving messages', error);
      }
    };
    
    if (messages.length > 0) {
      saveMessages();
    }
  }, [messages]);
  
  // Handle sending a message
  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    
    // Add user message to chat
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsSending(true);
    setError(null);
    
    try {
      // Get AI response
      const aiResponse = await openAIService.chat(
        updatedMessages.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant' as const,
          content: msg.text
        }))
      );
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages([...updatedMessages, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response', error);
      setError('Failed to get response');
    } finally {
      setIsSending(false);
    }
  };
  
  // Clear chat history
  const handleClearHistory = async () => {
    try {
      await ChatHistoryService.clearHistory();
      setMessages([]);
      setMenuVisible(false);
    } catch (error) {
      console.error('Failed to clear history', error);
      setError('Failed to clear history');
    }
  };
  
  // Render a single message
  const renderMessage = ({ item }: { item: Message }) => (
    <View 
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
      ]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${item.isUser ? 'You' : 'AI'} said: ${item.text} at ${new Date(item.timestamp).toLocaleTimeString()}`}
    >
      <View 
        style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text 
          style={[
            styles.messageText,
            item.isUser ? styles.userMessageText : styles.aiMessageText,
          ]}
          selectable
          selectionColor={item.isUser ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)'}
        >
          {item.text}
        </Text>
        <Text 
          style={styles.timestamp}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {i18n.t('newChat')}
      </Text>
    </View>
  );
  
  // Render header with menu
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{i18n.t('newChat')}</Text>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <IconButton
            icon="dots-vertical"
            onPress={() => setMenuVisible(true)}
            style={styles.menuButton}
            size={24}
            accessibilityLabel="Menu"
          />
        }
      >
        <Menu.Item 
          onPress={handleClearHistory} 
          title={i18n.t('clearChat')}
          titleStyle={{ color: colors.error }}
        />
      </Menu>
    </View>
  );
  
  // Render input area
  const renderInput = () => (
    <View 
      style={[styles.inputContainer, { paddingBottom: insets.bottom + 8 }]}
      accessible
      accessibilityRole="toolbar"
    >
      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder={i18n.t('typeMessage')}
          placeholderTextColor={colors.onSurfaceDisabled}
          multiline
          mode="outlined"
          disabled={isSending}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
          returnKeyType="send"
          accessibilityLabel={i18n.t('typeMessage')}
          accessibilityHint={i18n.t('pressEnterToSend')}
          right={
            isSending ? (
              <ActivityIndicator 
                style={styles.loadingIndicator} 
                color={colors.primary} 
                size="small" 
                accessibilityLabel={i18n.t('sending')}
              />
            ) : (
              <TextInput.Icon 
                icon="send" 
                onPress={handleSend} 
                disabled={!input.trim() || isSending}
                forceTextInputFocus={false}
                accessibilityLabel={i18n.t('sendMessage')}
                accessibilityRole="button"
                accessibilityState={{ disabled: !input.trim() || isSending }}
                hitSlop={{
                  top: 15,
                  bottom: 15,
                  left: 15,
                  right: 15,
                }}
              />
            )
          }
          theme={{
            colors: {
              text: colors.onSurface,
              placeholder: colors.onSurfaceDisabled,
              primary: colors.primary,
              background: colors.surface,
            },
            roundness: 24,
          }}
        />
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
  
  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle={themeType === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.innerContainer}>
          {renderHeader()}
          
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContainer}
            onContentSizeChange={() => {
              if (messages.length > 0) {
                flatListRef.current?.scrollToEnd({ animated: true });
              }
            }}
            onLayout={() => {
              if (messages.length > 0) {
                flatListRef.current?.scrollToEnd({ animated: false });
              }
            }}
            ListEmptyComponent={renderEmptyState}
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
          
          {renderInput()}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const makeStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  innerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 8 : 16,
    paddingBottom: 8,
    backgroundColor: colors.background,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.onBackground,
  },
  menuButton: {
    marginRight: -8,
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 16,
  },
  messageContainer: {
    marginVertical: 8,
    maxWidth: '85%',
    alignSelf: 'flex-start',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderTopRightRadius: 4,
    alignSelf: 'flex-end',
  },
  aiBubble: {
    backgroundColor: colors.surfaceVariant,
    borderTopLeftRadius: 4,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: colors.onPrimary,
  },
  aiMessageText: {
    color: colors.onSurface,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    opacity: 0.6,
  },
  inputContainer: {
    padding: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.outline,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    fontSize: 16,
    maxHeight: 150,
    minHeight: 56,
  },
  loadingIndicator: {
    position: 'absolute',
    right: 12,
  },
  error: {
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
});

const styles = makeStyles(usePaperTheme().colors);

export default Chat;
