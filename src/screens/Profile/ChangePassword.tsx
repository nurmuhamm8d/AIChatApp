import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import { authService } from '../../services/auth';
import { useTranslation } from 'react-i18next';

export default function ChangePassword() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const change = async () => {
    if (!currentPassword || !newPassword || newPassword !== confirm) return;
    setLoading(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.wrap, { backgroundColor: colors.background }]}>
      <TextInput mode="outlined" label={t('password', 'Password')} value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry={secure} left={<TextInput.Icon icon="lock" />} style={styles.input} />
      <TextInput mode="outlined" label={t('newPassword', 'New Password')} value={newPassword} onChangeText={setNewPassword} secureTextEntry={secure} left={<TextInput.Icon icon="lock-reset" />} style={styles.input} />
      <TextInput mode="outlined" label={t('confirmPassword', 'Confirm Password')} value={confirm} onChangeText={setConfirm} secureTextEntry={secure} left={<TextInput.Icon icon="lock-check" />} style={styles.input} />
      <Button mode="contained" onPress={change} loading={loading} style={styles.btn}>{t('save', 'Save')}</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 16 },
  input: { marginTop: 12 },
  btn: { marginTop: 24, height: 48, justifyContent: 'center' },
});
