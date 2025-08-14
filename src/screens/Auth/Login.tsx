import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import { Button, TextInput, useTheme, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { scale, verticalScale, moderateScale, isTablet } from '../../utils/responsive';
import { responsiveStyles } from '../../theme/responsiveStyles';

const { width, height } = Dimensions.get('window');
const isLandscape = width > height;

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Auth'>>();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement actual login logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Reset the navigation stack and navigate to Main
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = useCallback(() => (
    <>
      <Text style={[styles.title, isLandscape && styles.titleLandscape]}>
        Welcome Back
      </Text>
      
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}
      
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={[styles.input, isTablet() && styles.inputTablet]}
        keyboardType="email-address"
        autoCapitalize="none"
        left={<TextInput.Icon icon="email" />}
      />
      
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={[styles.input, isTablet() && styles.inputTablet]}
        left={<TextInput.Icon icon="lock" />}
        right={<TextInput.Icon icon="eye" onPress={() => {}} />}
      />
      
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={isLoading}
        disabled={isLoading}
        style={[styles.button, isTablet() && styles.buttonTablet]}
        labelStyle={styles.buttonLabel}
        contentStyle={styles.buttonContent}
      >
        Login
      </Button>
      
      <View style={styles.footer}>
        <Button
          onPress={() => navigation.navigate('Register')}
          mode="text"
          style={styles.linkButton}
          labelStyle={styles.linkButtonText}
          compact
        >
          Don't have an account? Register
        </Button>
        
        <Button
          onPress={() => { /* Forgot password */ }}
          mode="text"
          style={styles.forgotPassword}
          labelStyle={styles.forgotPasswordText}
          compact
        >
          Forgot Password?
        </Button>
      </View>
    </>
  ), [email, password, isLoading, error, handleLogin, navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
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
    maxWidth: 500, // Max width for better readability on tablets
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
  title: {
    fontSize: responsiveStyles.fontSizes.xxlHeader,
    fontWeight: 'bold',
    marginBottom: verticalScale(24),
    textAlign: 'center',
    color: '#000',
  },
  titleLandscape: {
    marginBottom: verticalScale(12),
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
    marginTop: verticalScale(24),
    alignItems: 'center',
  },
  linkButton: {
    marginTop: verticalScale(8),
  },
  linkButtonText: {
    fontSize: responsiveStyles.fontSizes.body,
  },
  forgotPassword: {
    marginTop: verticalScale(8),
  },
  forgotPasswordText: {
    fontSize: responsiveStyles.fontSizes.caption,
  },
  error: {
    color: '#B00020',
    marginBottom: verticalScale(16),
    textAlign: 'center',
    fontSize: responsiveStyles.fontSizes.caption,
  },
});

export default Login;
