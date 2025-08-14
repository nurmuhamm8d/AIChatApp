import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Конфигурация вашего проекта на основе google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyD_2BncMmoeo2uCK8xCNZHNxPYngKPJjHI",
  authDomain: "commerce-7b11c.firebaseapp.com",
  projectId: "commerce-7b11c",
  storageBucket: "commerce-7b11c.firebasestorage.app",
  messagingSenderId: "1034948120361",
  appId: "1:1034948120361:android:ee8ee51baff053f711b138"
};

// Инициализация приложения
const app = initializeApp(firebaseConfig);
// Подключение сервисов Firebase
export const auth = getAuth(app);
export const db   = getFirestore(app);
export default app;
