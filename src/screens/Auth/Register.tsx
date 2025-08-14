import React, { useState, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Image, 
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text, TextInput, Button, useTheme, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthStackParamList, RootStackParamList, MainTabParamList } from '../../navigation/types';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail, validatePassword } from '../../utils/validation';
import { authService } from '../../services/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale, isTablet } from '../../utils/responsive';
import { responsiveStyles } from '../../theme/responsiveStyles';

const { width, height } = Dimensions.get('window');
const isLandscape = width > height;

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'> & {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
};

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  
  const theme = useTheme();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const { t, i18n } = useTranslation();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError(t('translation:allFieldsRequired'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('translation:passwordsDontMatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('translation:passwordTooShort'));
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setError('');

    try {
      const result = await authService.register(name, email, password);
      if (result) {
        // Auto-login after successful registration
        await signIn(email, password);
        navigation.navigate('Main', { screen: 'Chat' });
      } else {
        setError(t('translation:registrationError'));
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(t('translation:registrationError'));
    } finally {
      setLoading(false);
    }
  };

  const renderContent = useCallback(() => {
    const translations = {
      appName: t('translation:welcome'),
      register: t('translation:register'),
      createAnAccountToGetStarted: t('translation:createAnAccountToGetStarted'),
      name: t('translation:name'),
      email: t('translation:email'),
      password: t('translation:password'),
      confirmPassword: t('translation:confirmPassword'),
      alreadyHaveAnAccount: t('translation:alreadyHaveAnAccount'),
      login: t('translation:login')
    };

    return (
      <>
        <View style={styles.header}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel={translations.appName}
          />
          <Text variant="headlineMedium" style={styles.title}>
            {translations.register}
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {translations.createAnAccountToGetStarted}
          </Text>
        </View>

        {error ? (
          <Text style={[styles.error, { color: theme.colors.error }]}>
            {error}
          </Text>
        ) : null}

        <View style={styles.form}>
          <TextInput
            label={translations.name}
            placeholder={translations.name}
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={[styles.input, isTablet() && styles.inputTablet]}
            disabled={loading}
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label={translations.email}
            placeholder={translations.email}
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={[styles.input, isTablet() && styles.inputTablet]}
            keyboardType="email-address"
            autoCapitalize="none"
            disabled={loading}
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label={translations.password}
            placeholder={translations.password}
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={[styles.input, isTablet() && styles.inputTablet]}
            secureTextEntry={secureTextEntry}
            disabled={loading}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={secureTextEntry ? 'eye-off' : 'eye'}
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              />
            }
          />

          <TextInput
            label={translations.confirmPassword}
            placeholder={translations.confirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            style={[styles.input, isTablet() && styles.inputTablet]}
            secureTextEntry={secureTextEntry}
            disabled={loading}
            left={<TextInput.Icon icon="lock-check" />}
            right={
              <TextInput.Icon
                icon={secureTextEntry ? 'eye-off' : 'eye'}
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              />
            }
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            {translations.register}
          </Button>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
              {translations.alreadyHaveAnAccount}{' '}
            </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              compact
              disabled={loading}
              labelStyle={styles.linkButton}
            >
              {translations.login}
            </Button>
          </View>
        </View>
      </>
    );
  }, [name, email, password, confirmPassword, loading, error, secureTextEntry, handleRegister, navigation]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? verticalScale(40) : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Surface style={[styles.container, isTablet() && styles.containerTablet]}>
            {renderContent()}
          </Surface>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: scale(24),
    justifyContent: 'center',
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  containerTablet: {
    padding: scale(32),
    borderRadius: scale(8),
    elevation: 2,
    marginVertical: verticalScale(20),
    maxWidth: 600,
  },
  header: {
    marginBottom: verticalScale(24),
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: verticalScale(8),
    textAlign: 'center',
    fontSize: responsiveStyles.fontSizes.xxlHeader,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    fontSize: responsiveStyles.fontSizes.body,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: verticalScale(16),
    fontSize: responsiveStyles.fontSizes.body,
  },
  inputTablet: {
    marginBottom: verticalScale(20),
    fontSize: responsiveStyles.fontSizes.subheader,
  },
  button: {
    marginTop: verticalScale(8),
    marginBottom: verticalScale(16),
    borderRadius: scale(8),
    height: verticalScale(48),
  },
  buttonTablet: {
    height: verticalScale(56),
  },
  buttonContent: {
    height: '100%',
  },
  buttonLabel: {
    fontSize: responsiveStyles.fontSizes.subheader,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(16),
    flexWrap: 'wrap',
  },
  footerText: {
    opacity: 0.7,
    fontSize: responsiveStyles.fontSizes.body,
  },
  linkButton: {
    marginLeft: scale(4),
    fontSize: responsiveStyles.fontSizes.body,
  },
  error: {
    marginBottom: verticalScale(16),
    textAlign: 'center',
    fontSize: responsiveStyles.fontSizes.caption,
  },
});

export default Register;
