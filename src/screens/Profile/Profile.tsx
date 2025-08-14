import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Avatar, Card, Text, Button, Divider, Switch, RadioButton, List, IconButton } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { useTheme as useAppTheme } from '../../theme/ThemeContext';
import { i18n, changeLanguage, supportedLanguages, SupportedLanguage } from '../../i18n';
import { ThemeType } from '../../theme/ThemeContext';

const Profile = () => {
  const { theme, toggleTheme, themeType } = useAppTheme();
  const { colors } = useTheme();
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('English');
  const [isLoading, setIsLoading] = useState(false);
  const [themeExpanded, setThemeExpanded] = useState(false);
  const [languageExpanded, setLanguageExpanded] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  
  const themeOptions = [
    { label: i18n.t('theme.system', 'System Default'), value: 'system' as const },
    { label: i18n.t('theme.light', 'Light'), value: 'light' as const },
    { label: i18n.t('theme.dark', 'Dark'), value: 'dark' as const },
  ];
  
  const handleLanguageChange = async (langCode: string) => {
    try {
      // Type assertion since we know the value will be a valid language code
      const language = langCode as SupportedLanguage;
      await changeLanguage(language);
      setCurrentLanguage(language);
      setLanguageExpanded(false);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };
  
  // Load user data from storage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // TODO: Load user data from AsyncStorage
        // const userData = await AsyncStorage.getItem('user_data');
        // if (userData) {
        //   setUser(JSON.parse(userData));
        // }
        // 
        // const settings = await AsyncStorage.getItem('user_settings');
        // if (settings) {
        //   const parsedSettings = JSON.parse(settings);
        //   setNotificationsEnabled(parsedSettings.notificationsEnabled || true);
        //   setLanguage(parsedSettings.language || 'English');
        // }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              // TODO: Implement logout logic
              // await authService.logout();
              // Navigate to auth screen
            } catch (error) {
              console.error('Error logging out:', error);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      i18n.t('clearHistory.title', 'Clear History'),
      i18n.t('clearHistory.message', 'Are you sure you want to clear your chat history? This action cannot be undone.'),
      [
        {
          text: i18n.t('common.cancel', 'Cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('common.clear', 'Clear'),
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Clear chat history from storage
              // await AsyncStorage.removeItem('chat_history');
              Alert.alert(
                i18n.t('common.success', 'Success'), 
                i18n.t('clearHistory.success', 'Chat history has been cleared.')
              );
            } catch (error) {
              console.error('Error clearing chat history:', error);
              Alert.alert(
                i18n.t('common.error', 'Error'), 
                i18n.t('clearHistory.error', 'Failed to clear chat history. Please try again.')
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    
    try {
      // TODO: Save notification preference
      // const settings = { notificationsEnabled: newValue, language };
      // await AsyncStorage.setItem('user_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      // Revert if save fails
      setNotificationsEnabled(!newValue);
    }
  };

  const changeLanguage = () => {
    const newLanguage = language === 'English' ? 'Русский' : 'English';
    setLanguage(newLanguage);
    
    // TODO: Implement language change logic
    // i18n.changeLanguage(newLanguage === 'English' ? 'en' : 'ru');
    
    try {
      // Save language preference
      // const settings = { notificationsEnabled, language: newLanguage };
      // await AsyncStorage.setItem('user_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving language preference:', error);
      // Revert if save fails
      setLanguage(language);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Avatar.Image 
            size={100} 
            source={{ uri: user.avatar }} 
            style={styles.avatar}
          />
          <IconButton
            icon="camera"
            size={24}
            onPress={() => {}}
            style={styles.editAvatarButton}
            mode="contained"
          />
        </View>
        <Text variant="headlineMedium" style={[styles.userName, { color: colors.onSurface }]}>
          {user.name}
        </Text>
        <Text variant="bodyMedium" style={[styles.userEmail, { color: colors.onSurfaceVariant }]}>
          {user.email}
        </Text>
      </View>

      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: colors.primary, marginBottom: 8 }}>
            Account Settings
          </Text>
          
          <List.Item
            title="Edit Profile"
            left={props => <List.Icon {...props} icon="account-edit" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
            style={styles.listItem}
          />
          <Divider />
          
          <List.Item
            title="Change Password"
            left={props => <List.Icon {...props} icon="lock-reset" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {}}
            style={styles.listItem}
          />
          <Divider />
          
          <List.Item
            title="Language"
            description={language}
            left={props => <List.Icon {...props} icon="translate" />}
            right={props => (
              <View style={styles.languageContainer}>
                <Text style={{ color: colors.onSurfaceVariant, marginRight: 8 }}>
                  {language}
                </Text>
                <List.Icon {...props} icon="chevron-right" />
              </View>
            )}
            onPress={changeLanguage}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: colors.primary, marginBottom: 8 }}>
            App Settings
          </Text>
          
          <List.Section>
            <List.Subheader>Preferences</List.Subheader>
            
            <List.Item
              title={i18n.t('notifications', 'Notifications')}
              description={i18n.t('notificationsDescription', 'Enable push notifications')}
              left={props => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  thumbColor={colors.primary}
                />
              )}
            />
            
            <List.Accordion
              title={i18n.t('theme.title', 'Theme')}
              left={props => <List.Icon {...props} icon="theme-light-dark" />}
              expanded={themeExpanded}
              onPress={() => setThemeExpanded(!themeExpanded)}
            >
              <RadioButton.Group 
                onValueChange={(value: string) => toggleTheme(value as ThemeType)} 
                value={themeType}
              >
                {themeOptions.map((option) => (
                  <RadioButton.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                    labelStyle={styles.radioLabel}
                    position="leading"
                  />
                ))}
              </RadioButton.Group>
            </List.Accordion>
            
            <List.Accordion
              title={i18n.t('language', 'Language')}
              left={props => <List.Icon {...props} icon="translate" />}
              expanded={languageExpanded}
              onPress={() => setLanguageExpanded(!languageExpanded)}
            >
              <RadioButton.Group onValueChange={handleLanguageChange} value={currentLanguage}>
                {supportedLanguages.map((lang) => {
                  // Explicitly type the value as string to satisfy RadioButton.Item
                  const value = lang.code as string;
                  return (
                    <RadioButton.Item
                      key={lang.code}
                      label={lang.name}
                      value={value}
                      labelStyle={styles.radioLabel}
                      position="leading"
                    />
                  );
                })}
              </RadioButton.Group>
            </List.Accordion>
          </List.Section>
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleLogout}
          loading={isLoading}
          disabled={isLoading}
          style={styles.logoutButton}
          labelStyle={styles.logoutButtonLabel}
        >
          Logout
        </Button>
        
        <Text style={[styles.versionText, { color: colors.onSurfaceVariant }]}>
          Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  radioLabel: {
    textAlign: 'left',
    marginLeft: 8,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    borderWidth: 2,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
  userName: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  userEmail: {
    opacity: 0.8,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  listItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
    borderRadius: 8,
    paddingVertical: 6,
    marginBottom: 16,
  },
  logoutButtonLabel: {
    fontSize: 16,
    paddingVertical: 4,
  },
  versionText: {
    fontSize: 12,
    opacity: 0.7,
  },
});

export default Profile;
