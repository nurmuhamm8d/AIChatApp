// index.js — точка входа для Expo dev‑client
import 'expo-dev-client';                     // подключаем dev‑клиент (строго первой строкой)
import { registerRootComponent } from 'expo'; // регистрируем корневой компонент
import App from './App';

// Передаём App в Expo; никакой ручной AppRegistry.registerComponent не нужен
registerRootComponent(App);
