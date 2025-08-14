import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import * as SplashScreenLib from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreenLib.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

const SplashScreen = () => {
  useEffect(() => {
    const hideSplash = async () => {
      // Wait for 2 seconds before hiding the splash screen
      await new Promise(resolve => setTimeout(resolve, 2000));
      await SplashScreenLib.hideAsync();
    };

    hideSplash();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/Image29.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default SplashScreen;
