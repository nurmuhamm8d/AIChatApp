import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AuthLanguageToggle from '../../components/AuthLanguageToggle';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      await signIn(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.wrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Card style={styles.card}>
        <AuthLanguageToggle />
        <Text variant="headlineLarge" style={styles.title}>{t('welcome')}</Text>

        <TextInput mode="outlined" label={t('email')} value={email} onChangeText={setEmail} autoCapitalize="none" style={styles.input} left={<TextInput.Icon icon="email" />} />
        <TextInput mode="outlined" label={t('password')} value={password} onChangeText={setPassword} secureTextEntry style={styles.input} left={<TextInput.Icon icon="lock" />} right={<TextInput.Icon icon="eye" />} />
        <Button mode="contained" onPress={onLogin} loading={loading} style={styles.btn}>{t('login')}</Button>

        <View style={styles.row}>
          <Text>{t('noAccount')} </Text>
          <Button onPress={() => nav.navigate('Register')} compact>{t('register')}</Button>
        </View>
        <Button onPress={() => {}} compact>{t('forgotPassword')}</Button>
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', padding: 16 },
  card: { padding: 16, borderRadius: 16 },
  title: { alignSelf: 'center', marginVertical: 12 },
  input: { marginTop: 10 },
  btn: { marginTop: 16, height: 48, justifyContent: 'center' },
  row: { marginTop: 14, flexDirection: 'row', alignSelf: 'center', alignItems: 'center' }
});
