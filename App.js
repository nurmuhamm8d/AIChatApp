import React, { useEffect, useState, useCallback } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './src/navigation';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/theme/ThemeContext';
import { initI18n } from './src/i18n';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await initI18n();
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (ready) {
      try {
        await SplashScreen.hideAsync();
      } catch {}
    }
  }, [ready]);

  if (!ready) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ThemeProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </ThemeProvider>
    </View>
  );
}
