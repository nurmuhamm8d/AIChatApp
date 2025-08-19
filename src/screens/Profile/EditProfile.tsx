import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth';
import { useTranslation } from 'react-i18next';

export default function EditProfile() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await authService.updateProfile({ name: name.trim(), email: email.trim() });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.wrap, { backgroundColor: colors.background }]}>
      <TextInput mode="outlined" label={t('name', 'Name')} value={name} onChangeText={setName} style={styles.input} left={<TextInput.Icon icon="account" />} />
      <TextInput mode="outlined" label={t('email', 'Email')} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} left={<TextInput.Icon icon="email" />} />
      <Button mode="contained" onPress={save} loading={saving} style={styles.btn}>{t('save', 'Save')}</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16 },
  input: { marginTop: 12 },
  btn: { marginTop: 24, height: 48, justifyContent: 'center' },
});
