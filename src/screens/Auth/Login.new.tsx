import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { Button, TextInput, Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { authService } from '../../services/auth';
import { i18n } from '../../i18n';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    if (!email || !password) {
      setError(i18n.t('allFieldsRequired'));
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);
    setError('');

    try {
      await authService.login(email, password);
      // Navigation is handled by the auth state listener in AppNavigator
    } catch (err: any) {
      setError(err.message || i18n.t('loginError'));
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary, marginBottom: 24 }]}>
        {i18n.t('welcomeBack')}
      </Text>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <TextInput
        label={i18n.t('email')}
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        autoCapitalize="none"
        keyboardType="email-address"
        disabled={isLoading}
        style={styles.input}
      />
      
      <TextInput
        label={i18n.t('password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        disabled={isLoading}
        right={
          <TextInput.Icon 
            icon={password ? 'eye-off' : 'eye'} 
            onPress={() => setPassword('')} 
          />
        }
        style={styles.input}
      />
      
      <Button
        mode="contained"
        onPress={handleLogin}
        disabled={isLoading}
        style={styles.button}
        contentStyle={styles.buttonContent}
        loading={isLoading}
      >
        Login
      </Button>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {i18n.t('noAccount')}{' '}
          <Text 
            style={{ color: theme.colors.primary, fontWeight: 'bold' }}
            onPress={() => navigation.navigate('Register')}
          >
            {i18n.t('signUp')}
          </Text>
        </Text>
        <Button
          mode="text"
          onPress={() => navigation.navigate('Register')}
          disabled={isLoading}
        >
          Register
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  buttonContent: {
    height: 50,
    justifyContent: 'center',
  },
  footerText: {
    marginTop: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  error: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default Login;
