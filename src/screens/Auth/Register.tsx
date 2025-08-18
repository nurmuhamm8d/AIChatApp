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
  Banner,
  useTheme,
} from 'react-native-paper';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../contexts/AuthContext';
import { i18n } from '../../i18n';
import { scale, verticalScale, isTablet } from '../../utils/responsive';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const logo = require('../../../assets/images/logo.png');

const Register: React.FC = () => {
  const nav = useNavigation<Nav>();
  const theme = useTheme();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const [hint, setHint] = useState(
    i18n.t('allFieldsRequired', 'All fields are required'),
  );
  const [banner, setBanner] = useState<{ visible: boolean; text: string }>({
    visible: false,
    text: '',
  });

  const showExistsError = () => {
    const msg = i18n.t('userAlreadyExists', 'The user is already registered');
    setHint(msg);
    setBanner({ visible: true, text: msg });
  };

  const handleRegister = useCallback(async () => {
    const tRequired = i18n.t('allFieldsRequired', 'All fields are required');
    const tShort = i18n.t('passwordTooShort', 'Password must be at least 6 characters');
    const tMismatch = i18n.t('passwordsDontMatch', 'Passwords do not match');

    if (!name.trim() || !email.trim() || !password || !confirm) {
      setHint(tRequired);
      return;
    }
    if (password.length < 6) {
      setHint(tShort);
      return;
    }
    if (password !== confirm) {
      setHint(tMismatch);
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setBanner({ visible: false, text: '' });

    try {
      await signUp(name.trim(), email.trim(), password);
    } catch (e: any) {
      const msg = String(e?.message || '').toLowerCase();
      if (msg.includes('already') || msg.includes('in use') || msg.includes('exists')) {
        showExistsError();
      } else {
        setHint(i18n.t('registrationError', 'Registration failed. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  }, [name, email, password, confirm]);

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
              {i18n.t('register', 'Register')}
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
            >
              {hint}
            </Text>
          </View>

          <Banner
            visible={banner.visible}
            icon="alert-circle-outline"
            actions={[
              { label: '✕', onPress: () => setBanner({ visible: false, text: '' }) },
            ]}
            style={styles.banner}
          >
            {banner.text}
          </Banner>

          <View style={styles.form}>
            <TextInput
              mode="outlined"
              label={i18n.t('name', 'Name')}
              value={name}
              onChangeText={setName}
              left={<TextInput.Icon icon="account" />}
              style={[styles.input, isTablet() && styles.inputTablet]}
            />

            <TextInput
              mode="outlined"
              label={i18n.t('email', 'Email')}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              left={<TextInput.Icon icon="email" />}
              style={[styles.input, isTablet() && styles.inputTablet]}
            />

            <TextInput
              mode="outlined"
              label={i18n.t('password', 'Password')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secure}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={secure ? 'eye-off' : 'eye'}
                  onPress={() => setSecure(s => !s)}
                />
              }
              style={[styles.input, isTablet() && styles.inputTablet]}
            />

            <TextInput
              mode="outlined"
              label={i18n.t('confirmPassword', 'Confirm Password')}
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry={secure}
              left={<TextInput.Icon icon="lock-check" />}
              right={
                <TextInput.Icon
                  icon={secure ? 'eye-off' : 'eye'}
                  onPress={() => setSecure(s => !s)}
                />
              }
              style={[styles.input, isTablet() && styles.inputTablet]}
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
              {i18n.t('register', 'Register')}
            </Button>

            <View style={styles.footerRow}>
              <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
                {i18n.t('dontHaveAccount', "Don't have an account?")}
              </Text>
              <Button
                compact
                mode="text"
                onPress={() => nav.navigate('Login')}
              >
                {i18n.t('login', 'Login')}
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
  banner: { marginTop: verticalScale(8), marginBottom: verticalScale(8) },
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
