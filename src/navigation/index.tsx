import React, { useContext, useEffect, useState } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme as NavDefaultTheme, DarkTheme as NavDarkTheme, Theme as NavTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MD3DarkTheme as PaperDarkTheme, MD3LightTheme as PaperLightTheme, Provider as PaperProvider, IconButton } from 'react-native-paper';
import { ThemeContext } from '../theme/ThemeContext';
import { lightTheme, darkTheme } from '../theme';
import SplashScreen from '../components/SplashScreen';
import { useAuth } from '../contexts/AuthContext';
import { AuthStackParamList, MainTabParamList, RootStackParamList } from './types';

// Lazy load screens
const LoginScreen = React.lazy(() => import('../screens/Auth/Login.new'));
const RegisterScreen = React.lazy(() => import('../screens/Auth/Register'));
const ChatScreen = React.lazy(() => import('../screens/Chat/Chat'));
const ProfileScreen = React.lazy(() => import('../screens/Profile/Profile'));

// Loading screen component
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

// Combine Paper and Navigation themes
const CombinedLightTheme: NavTheme = {
  ...NavDefaultTheme,
  colors: {
    ...NavDefaultTheme.colors,
    primary: PaperLightTheme.colors.primary,
    background: PaperLightTheme.colors.background,
    card: PaperLightTheme.colors.surface,
    text: PaperLightTheme.colors.onSurface,
    border: PaperLightTheme.colors.outline,
    notification: PaperLightTheme.colors.primary,
  },
  dark: false,
};

const CombinedDarkTheme: NavTheme = {
  ...NavDarkTheme,
  colors: {
    ...NavDarkTheme.colors,
    primary: PaperDarkTheme.colors.primary,
    background: PaperDarkTheme.colors.background,
    card: PaperDarkTheme.colors.surface,
    text: PaperDarkTheme.colors.onSurface,
    border: PaperDarkTheme.colors.outline,
    notification: PaperDarkTheme.colors.primary,
  },
  dark: true,
};

// Create navigator instances
const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Auth Stack Navigator
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{
    headerShown: false,
    animationTypeForReplace: 'pop',
  }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen 
      name="Register" 
      component={RegisterScreen}
      options={{
        headerShown: true,
        title: 'Create Account',
        headerBackTitle: 'Back to Login',
      }}
    />
  </AuthStack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => {
  const { signOut } = useAuth();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerRight: () => (
          <IconButton
            icon="logout"
            onPress={signOut}
            style={{ marginRight: 8 }}
          />
        ),
      }}
    >
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ color, size }) => (
            <IconButton icon="chat" iconColor={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <IconButton icon="account" iconColor={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Root Stack Navigator
const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <RootStack.Screen name="Main" component={MainTabs} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

export const AppNavigator = () => {
  const { theme: appTheme } = useContext(ThemeContext);
  const [appIsReady, setAppIsReady] = useState(false);
  const isDark = appTheme === darkTheme;
  const theme = isDark ? CombinedDarkTheme : CombinedLightTheme;
  const paperTheme = isDark ? PaperDarkTheme : PaperLightTheme;

  // Show splash screen on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppIsReady(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!appIsReady) {
    return (
      <PaperProvider theme={paperTheme}>
        <SplashScreen />
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <NavigationContainer theme={theme}>
        <React.Suspense fallback={<LoadingScreen />}>
          <RootNavigator />
        </React.Suspense>
      </NavigationContainer>
    </PaperProvider>
  );
};
