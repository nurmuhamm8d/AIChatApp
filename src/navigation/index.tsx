import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme as NavDefault, DarkTheme as NavDark, Theme as NavTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MD3DarkTheme as PaperDark, MD3LightTheme as PaperLight, Provider as PaperProvider, IconButton, ActivityIndicator } from 'react-native-paper';
import { StatusBar, View } from 'react-native';
import { ThemeContext } from '../theme/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { initI18n } from '../i18n';
import Login from '../screens/Auth/Login';
import Register from '../screens/Auth/Register';
import Chat from '../screens/Chat/Chat';
import Profile from '../screens/Profile/Profile';

export type RootStackParamList = { Auth: undefined; Main: undefined };
export type AuthStackParamList = { Login: undefined; Register: undefined };
export type MainTabParamList = { Chat: undefined; Profile: undefined };

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const CombinedLight: NavTheme = {
  ...NavDefault,
  dark: false,
  colors: { ...NavDefault.colors, primary: PaperLight.colors.primary, background: PaperLight.colors.background, card: PaperLight.colors.surface, text: PaperLight.colors.onSurface, border: PaperLight.colors.outline, notification: PaperLight.colors.primary },
};
const CombinedDark: NavTheme = {
  ...NavDark,
  dark: true,
  colors: { ...NavDark.colors, primary: PaperDark.colors.primary, background: PaperDark.colors.background, card: PaperDark.colors.surface, text: PaperDark.colors.onSurface, border: PaperDark.colors.outline, notification: PaperDark.colors.primary },
};

const Loading = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Login" component={Login} options={{ headerShown: true, title: 'Login' }} />
    <AuthStack.Screen name="Register" component={Register} options={{ headerShown: true, title: 'Create Account' }} />
  </AuthStack.Navigator>
);

const MainTabs = () => {
  const { signOut } = useAuth();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerRight: () => <IconButton icon="logout" onPress={signOut} style={{ marginRight: 8 }} />,
      }}
    >
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ color, size }) => <IconButton icon="chat" iconColor={color} size={size} />,
          unmountOnBlur: true
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <IconButton icon="account" iconColor={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Loading />;
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? <RootStack.Screen name="Main" component={MainTabs} /> : <RootStack.Screen name="Auth" component={AuthNavigator} />}
    </RootStack.Navigator>
  );
};

export default function AppNavigator() {
  const { mode } = useContext(ThemeContext);
  const isDark = mode === 'dark';
  const navTheme = isDark ? CombinedDark : CombinedLight;
  const paperTheme = isDark ? PaperDark : PaperLight;

  const [ready, setReady] = useState(false);
  useEffect(() => {
    initI18n().then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <PaperProvider theme={paperTheme}>
        <Loading />
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}
