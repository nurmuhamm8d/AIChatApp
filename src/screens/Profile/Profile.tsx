import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform, PermissionsAndroid } from 'react-native';
import { Avatar, Card, Text, Button, Divider, Switch, RadioButton, List, IconButton, useTheme } from 'react-native-paper';
import { launchImageLibrary, Asset, ImageLibraryOptions } from 'react-native-image-picker';
import { useAuth } from '../../contexts/AuthContext';
import { changeLanguage, supportedLanguages, SupportedLanguage } from '../../i18n';
import { useThemeContext, ThemeType } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const { themeType, toggleTheme } = useThemeContext();

  const [avatar, setAvatar] = useState<string | undefined>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [themeExpanded, setThemeExpanded] = useState(false);
  const [languageExpanded, setLanguageExpanded] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>((i18n.language as SupportedLanguage) || 'en');

  const themeOptions = [
    { label: t('system', 'System'), value: 'system' as const },
    { label: t('light', 'Light'), value: 'light' as const },
    { label: t('dark', 'Dark'), value: 'dark' as const },
  ];

  const askAndroidPermission = async () => {
    if (Platform.OS !== 'android') return true;
    const perm = Platform.Version >= 33
      ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    const res = await PermissionsAndroid.request(perm);
    return res === PermissionsAndroid.RESULTS.GRANTED;
  };

  const pickAvatar = async () => {
    const ok = await askAndroidPermission();
    if (!ok) {
      Alert.alert('Permission', 'Storage permission is required to pick an image.');
      return;
    }
    const options: ImageLibraryOptions = { mediaType: 'photo', selectionLimit: 1, quality: 0.8 };
    const result = await launchImageLibrary(options);
    if (result.didCancel) return;
    const asset: Asset | undefined = result.assets?.[0];
    if (asset?.uri) setAvatar(asset.uri);
  };

  const onChangeLanguage = async (code: string) => {
    const next = (code as SupportedLanguage) ?? 'en';
    const changed = await changeLanguage(next);
    if (changed) setCurrentLanguage(next);
  };

  const onLogout = () => {
    Alert.alert(
      t('logout', 'Logout'),
      'Are you sure you want to logout?',
      [
        { text: t('cancel', 'Cancel'), style: 'cancel' },
        { text: t('logout', 'Logout'), style: 'destructive', onPress: () => void signOut() },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {avatar ? (
            <Avatar.Image size={100} source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <Avatar.Text size={100} label={user?.name?.slice(0, 1)?.toUpperCase() || 'U'} style={styles.avatar} />
          )}
          <IconButton icon="camera" size={24} onPress={pickAvatar} style={styles.editAvatarButton} />
        </View>
        <Text variant="headlineMedium" style={[styles.userName, { color: colors.onSurface }]}>{user?.name ?? '—'}</Text>
        <Text variant="bodyMedium" style={[styles.userEmail, { color: colors.onSurfaceVariant }]}>{user?.email ?? '—'}</Text>
      </View>

      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: colors.primary, marginBottom: 8 }}>
            {t('account', 'Account Settings')}
          </Text>

          <List.Item
            title={t('editProfile', 'Edit Profile')}
            left={(p) => <List.Icon {...p} icon="account-edit" />}
            right={(p) => <List.Icon {...p} icon="chevron-right" />}
            onPress={() => {}}
            style={styles.listItem}
          />
          <Divider />
          <List.Item
            title={t('changePassword', 'Change Password')}
            left={(p) => <List.Icon {...p} icon="lock-reset" />}
            right={(p) => <List.Icon {...p} icon="chevron-right" />}
            onPress={() => {}}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: colors.primary, marginBottom: 8 }}>
            {t('settings', 'App Settings')}
          </Text>

          <List.Section>
            <List.Subheader>{t('notifications', 'Notifications')}</List.Subheader>
            <List.Item
              title={t('notifications', 'Notifications')}
              description="Enable push notifications"
              left={(p) => <List.Icon {...p} icon="bell" />}
              right={() => <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />}
            />

            <List.Accordion
              title={t('darkMode', 'Theme')}
              left={(p) => <List.Icon {...p} icon="theme-light-dark" />}
              expanded={themeExpanded}
              onPress={() => setThemeExpanded((v) => !v)}
            >
              <RadioButton.Group value={themeType} onValueChange={(v) => toggleTheme(v as ThemeType)}>
                {themeOptions.map((opt) => (
                  <RadioButton.Item key={opt.value} value={opt.value} label={opt.label} position="leading" />
                ))}
              </RadioButton.Group>
            </List.Accordion>

            <List.Accordion
              title={t('language', 'Language')}
              left={(p) => <List.Icon {...p} icon="translate" />}
              expanded={languageExpanded}
              onPress={() => setLanguageExpanded((v) => !v)}
            >
              <RadioButton.Group value={currentLanguage} onValueChange={onChangeLanguage}>
                {supportedLanguages.map((lang) => (
                  <RadioButton.Item
                    key={lang.code}
                    value={lang.code}
                    label={lang.name}
                    position="leading"
                    labelStyle={styles.radioLabel}
                  />
                ))}
              </RadioButton.Group>
            </List.Accordion>
          </List.Section>
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Button mode="contained" onPress={onLogout} style={styles.logoutButton} labelStyle={styles.logoutButtonLabel} contentStyle={{ height: 48 }}>
          {t('logout', 'Logout')}
        </Button>
        <Text style={[styles.versionText, { color: colors.onSurfaceVariant }]}>
          {t('version', 'Version')} 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 32 },
  header: { alignItems: 'center', marginBottom: 24 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { borderWidth: 2 },
  editAvatarButton: { position: 'absolute', right: 0, bottom: 0, backgroundColor: '#6200ee' },
  userName: { fontWeight: 'bold', marginTop: 8 },
  userEmail: { opacity: 0.8 },
  card: { marginBottom: 16, borderRadius: 12, elevation: 2 },
  listItem: { paddingVertical: 12, paddingHorizontal: 4 },
  radioLabel: { textAlign: 'left', marginLeft: 8 },
  footer: { marginTop: 24, alignItems: 'center' },
  logoutButton: { width: '100%', borderRadius: 8, marginBottom: 16 },
  logoutButtonLabel: { fontSize: 16 },
  versionText: { fontSize: 12, opacity: 0.7 },
});

export default Profile;
