/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Настраиваем тёмный цвет текста в строке состояния */}
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.text}>Welcome to AIChatApp</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // контейнер SafeAreaView
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // контейнер для содержимого по центру
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  // стиль текста
  text: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
});
