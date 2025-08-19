import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Text,
  TextInput,
  Button,
  Surface,
  useTheme,
} from 'react-native-paper';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { scale, verticalScale, isTablet } from '../../utils/responsive';
import { useTranslation } from 'react-i18next';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const logo = require('../../../assets/images/logo.png');

const Register: React.FC = () => {
  const nav = useNavigation<Nav>();
  const theme = useTheme();
  const { t } = useTranslation();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const [hint, setHint] = useState(t('allFieldsRequired', 'All fields are required'));
  const [existsHint, setExistsHint] = useState(false);
  const [errors, setErrors] = useState<{ name?: boolean; email?: boolean; password?: boolean; confirm?: boolean }>({});

  const handleRegister = useCallback(async () => {
    const tRequired = t('allFieldsRequired', 'All fields are required');
    const tShort = t('passwordTooShort', 'Password must be at least 6 characters');
    const tMismatch = t('passwordsDontMatch', 'Passwords do not match');

    const next: typeof errors = {};
    if (!name.trim()) next.name = true;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !re.test(email.trim())) next.email = true;
    if (!password || password.length < 6) next.password = true;
    if (!confirm || confirm !== password) next.confirm = true;

    if (Object.keys(next).length) {
      setErrors(next);
      setExistsHint(false);
      setHint(tRequired);
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setErrors({});
    setExistsHint(false);
    try {
      await signUp(name.trim(), email.trim(), password);
    } catch {
      setExistsHint(true);
      setHint(t('userAlreadyExists', 'The user is already registered'));
    } finally {
      setLoading(false);
    }
  }, [name, email, password, confirm, t]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? verticalScale(40) : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.top}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <Text
              variant="headlineMedium"
              style={[styles.title, { color: theme.colors.onSurface }]}
            >
              {t('register', 'Register')}
            </Text>
            <Text
              variant="bodyMedium"
              style={[
                styles.subtitle,
                { color: Object.keys(errors).length ? theme.colors.error : theme.colors.onSurfaceVariant }
              ]}
            >
              {existsHint ? t('userAlreadyExists', 'The user is already registered') : hint}
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              mode="outlined"
              label={t('name', 'Name')}
              value={name}
              onChangeText={(v) => { setName(v); if (errors.name) setErrors(p => ({ ...p, name: undefined })); }}
              left={<TextInput.Icon icon="account" />}
              style={[styles.input, isTablet() && styles.inputTablet]}
              error={!!errors.name}
            />

            <TextInput
              mode="outlined"
              label={t('email', 'Email')}
              value={email}
              onChangeText={(v) => { setEmail(v); if (errors.email) setErrors(p => ({ ...p, email: undefined })); setExistsHint(false); }}
              autoCapitalize="none"
              keyboardType="email-address"
              left={<TextInput.Icon icon="email" />}
              style={[styles.input, isTablet() && styles.inputTablet]}
              error={!!errors.email}
            />

            <TextInput
              mode="outlined"
              label={t('password', 'Password')}
              value={password}
              onChangeText={(v) => { setPassword(v); if (errors.password) setErrors(p => ({ ...p, password: undefined })); }}
              secureTextEntry={secure}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={secure ? 'eye-off' : 'eye'}
                  onPress={() => setSecure(s => !s)}
                />
              }
              style={[styles.input, isTablet() && styles.inputTablet]}
              error={!!errors.password}
            />

            <TextInput
              mode="outlined"
              label={t('confirmPassword', 'Confirm Password')}
              value={confirm}
              onChangeText={(v) => { setConfirm(v); if (errors.confirm) setErrors(p => ({ ...p, confirm: undefined })); }}
              secureTextEntry={secure}
              left={<TextInput.Icon icon="lock-check" />}
              right={
                <TextInput.Icon
                  icon={secure ? 'eye-off' : 'eye'}
                  onPress={() => setSecure(s => !s)}
                />
              }
              style={[styles.input, isTablet() && styles.inputTablet]}
              error={!!errors.confirm}
            />

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              {t('register', 'Register')}
            </Button>

            <View style={styles.footerRow}>
              <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
                {t('alreadyHaveAccount', 'Already have an account?')}
              </Text>
              <Button
                compact
                mode="text"
                onPress={() => nav.navigate('Login')}
              >
                {t('login', 'Login')}
              </Button>
            </View>
          </View>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', padding: scale(16) },
  card: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    padding: scale(20),
    borderRadius: scale(12),
    elevation: 2,
  },
  top: { alignItems: 'center', marginBottom: verticalScale(12) },
  logo: { width: 96, height: 96, borderRadius: 12, marginBottom: verticalScale(12) },
  title: { fontWeight: '700', marginBottom: verticalScale(6) },
  subtitle: { opacity: 0.8 },
  form: { marginTop: verticalScale(6) },
  input: { marginBottom: verticalScale(14) },
  inputTablet: { marginBottom: verticalScale(18), fontSize: 16 },
  button: { marginTop: verticalScale(6), borderRadius: scale(8) },
  buttonContent: { height: verticalScale(50), alignItems: 'center', justifyContent: 'center' },
  buttonLabel: { fontSize: 16 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: verticalScale(12) },
  footerText: { marginRight: scale(6) },
});

export default Register;
