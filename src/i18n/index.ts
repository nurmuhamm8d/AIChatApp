import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SupportedLanguage = 'en' | 'ru';
export type Language = { code: SupportedLanguage; name: string };

const SETTINGS_KEY = '@app_settings';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome Back',
      createAnAccountToGetStarted: 'Create an account to get started',
      allFieldsRequired: 'All fields are required',
      userAlreadyExists: 'The user is already registered',
      userAlreadyRegistered: 'The user has already registered',
      passwordTooShort: 'Password must be at least 6 characters',
      passwordsDontMatch: 'Passwords do not match',
      alreadyHaveAccount: 'Already have an account?',
      noAccount: "Don't have an account?",
      name: 'Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      login: 'Login',
      register: 'Register',
      forgotPassword: 'Forgot Password?',
      send: 'Send',
      typeMessage: 'Message…',
      newChat: 'New Chat',
      newConversation: 'New conversation',
      renameChat: 'Rename chat',
      save: 'Save',
      cancel: 'Cancel',
      conversations: 'Conversations',
      account: 'Account Settings',
      settings: 'App Settings',
      notifications: 'Notifications',
      enablePush: 'Enable push notifications',
      darkMode: 'Theme',
      language: 'Language',
      logout: 'Logout',
      version: 'Version',
      system: 'System',
      light: 'Light',
      dark: 'Dark',
      editProfile: 'Edit Profile',
      changePassword: 'Change Password'
    }
  },
  ru: {
    translation: {
      welcome: 'С возвращением',
      createAnAccountToGetStarted: 'Создайте аккаунт, чтобы начать',
      allFieldsRequired: 'Все поля обязательны',
      userAlreadyExists: 'Пользователь уже зарегистрирован',
      userAlreadyRegistered: 'Пользователь уже зарегистрировался',
      passwordTooShort: 'Пароль должен быть не короче 6 символов',
      passwordsDontMatch: 'Пароли не совпадают',
      alreadyHaveAccount: 'Уже есть аккаунт?',
      noAccount: 'Нет аккаунта?',
      name: 'Имя',
      email: 'Эл. почта',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      login: 'Войти',
      register: 'Регистрация',
      forgotPassword: 'Забыли пароль?',
      send: 'Отправить',
      typeMessage: 'Сообщение…',
      newChat: 'Новый чат',
      newConversation: 'Новый диалог',
      renameChat: 'Переименовать чат',
      save: 'Сохранить',
      cancel: 'Отмена',
      conversations: 'Диалоги',
      account: 'Настройки аккаунта',
      settings: 'Настройки приложения',
      notifications: 'Уведомления',
      enablePush: 'Включить push-уведомления',
      darkMode: 'Тема',
      language: 'Язык',
      logout: 'Выйти',
      version: 'Версия',
      system: 'Система',
      light: 'Светлая',
      dark: 'Тёмная',
      editProfile: 'Редактировать профиль',
      changePassword: 'Сменить пароль'
    }
  }
};

export const supportedLanguages: readonly Language[] = Object.freeze([
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' }
]);

async function loadLang(): Promise<SupportedLanguage | null> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return null;
    const j = JSON.parse(raw);
    return j?.language ?? null;
  } catch {
    return null;
  }
}

async function saveLang(lang: SupportedLanguage) {
  try {
    const raw = (await AsyncStorage.getItem(SETTINGS_KEY)) || '{}';
    const j = JSON.parse(raw || '{}');
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...j, language: lang }));
  } catch {}
}

export async function initI18n() {
  const lng = (await loadLang()) ?? 'en';
  await i18n.use(initReactI18next).init({
    resources,
    lng,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v3'
  });
  return i18n;
}

export async function changeLanguage(lang: SupportedLanguage): Promise<boolean> {
  try {
    await i18n.changeLanguage(lang);
    await saveLang(lang);
    return true;
  } catch {
    return false;
  }
}

export { i18n };
export default i18n;
