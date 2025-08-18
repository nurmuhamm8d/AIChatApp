import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Splash = () => (
  <View style={styles.container}>
    <Image source={require('../../assets/Image29.png')} style={styles.image} resizeMode="contain" />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '100%' },
});
export default Splash;
