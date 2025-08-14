import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { Platform } from 'react-native';
import { StorageService } from '../services/storage';

// Define the type for our translation resources
type TranslationKeys = {
  // App
  appName: string;
  
  // Auth
  // Auth
  welcome: string;
  email: string;
  password: string;
  login: string;
  register: string;
  logout: string;
  noAccount: string;
  haveAccount: string;
  alreadyHaveAnAccount: string;
  createAnAccountToGetStarted: string;
  signUp: string;
  signIn: string;
  name: string;
  confirmPassword: string;
  
  // Chat
  typeMessage: string;
  send: string;
  newChat: string;
  clearChat: string;
  clearChatConfirm: string;
  pressEnterToSend: string;
  sending: string;
  sendMessage: string;
  messageSent: string;
  
  // Profile
  settings: string;
  account: string;
  appearance: string;
  language: string;
  notifications: string;
  darkMode: string;
  system: string;
  light: string;
  dark: string;
  save: string;
  cancel: string;
  editProfile: string;
  changePassword: string;
  clearHistory: string;
  about: string;
  version: string;
  
  // Common
  loading: string;
  error: string;
  success: string;
  ok: string;
  yes: string;
  no: string;
  
  // Validation
  allFieldsRequired: string;
  passwordTooShort: string;
  emailPasswordRequired: string;
  invalidCredentials: string;
  invalidEmail: string;
  emailAlreadyInUse: string;
  passwordsDontMatch: string;
  invalidName: string;
  registrationError: string;
};

// Extend i18next types
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: TranslationKeys;
    };
  }
}

// Language resources
const resources = {
  en: {
    translation: {
      // Auth
      welcome: 'Welcome Back',
      email: 'Email',
      password: 'Password',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      noAccount: "Don't have an account? ",
      haveAccount: 'Already have an account? ',
      alreadyHaveAnAccount: 'Already have an account?',
      createAnAccountToGetStarted: 'Create an account to get started',
      signUp: 'Sign Up',
      signIn: 'Sign In',
      name: 'Name',
      confirmPassword: 'Confirm Password',
      
      // Chat
      typeMessage: 'Type a message...',
      send: 'Send',
      newChat: 'New Chat',
      clearChat: 'Clear Chat',
      clearChatConfirm: 'Are you sure you want to clear the chat history?',
      pressEnterToSend: 'Press enter to send',
      sending: 'Sending...',
      sendMessage: 'Send message',
      messageSent: 'Message sent',
      
      // Profile
      settings: 'Settings',
      account: 'Account',
      appearance: 'Appearance',
      language: 'Language',
      notifications: 'Notifications',
      darkMode: 'Dark Mode',
      system: 'System',
      light: 'Light',
      dark: 'Dark',
      save: 'Save',
      cancel: 'Cancel',
      editProfile: 'Edit Profile',
      changePassword: 'Change Password',
      clearHistory: 'Clear History',
      about: 'About',
      version: 'Version',
      
      // Common
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
      ok: 'OK',
      yes: 'Yes',
      no: 'No',
      
      // Validation
      allFieldsRequired: 'All fields are required',
      passwordTooShort: 'Password must be at least 6 characters',
      emailPasswordRequired: 'Email and password are required',
      invalidCredentials: 'Invalid email or password',
      invalidEmail: 'Please enter a valid email address',
      emailAlreadyInUse: 'This email is already in use',
      passwordsDontMatch: 'Passwords do not match',
      invalidName: 'Please enter a valid name',
      registrationError: 'Registration failed. Please try again.',
    },
  },
  ru: {
    translation: {
      // Auth
      welcome: 'С возвращением',
      email: 'Эл. почта',
      password: 'Пароль',
      login: 'Войти',
      register: 'Регистрация',
      logout: 'Выйти',
      noAccount: 'Нет аккаунта? ',
      haveAccount: 'Уже есть аккаунт? ',
      alreadyHaveAnAccount: 'Уже есть аккаунт?',
      createAnAccountToGetStarted: 'Создайте аккаунт, чтобы начать',
      signUp: 'Зарегистрироваться',
      signIn: 'Войти',
      name: 'Имя',
      confirmPassword: 'Подтвердите пароль',
      registrationError: 'Ошибка регистрации. Пожалуйста, попробуйте снова.',
      
      // Chat
      typeMessage: 'Введите сообщение...',
      send: 'Отправить',
      newChat: 'Новый чат',
      clearChat: 'Очистить чат',
      clearChatConfirm: 'Вы уверены, что хотите очистить историю чата?',
      pressEnterToSend: 'Нажмите Enter для отправки',
      sending: 'Отправка...',
      sendMessage: 'Отправить сообщение',
      messageSent: 'Сообщение отправлено',
      
      // Profile
      settings: 'Настройки',
      account: 'Аккаунт',
      appearance: 'Внешний вид',
      language: 'Язык',
      notifications: 'Уведомления',
      darkMode: 'Темная тема',
      system: 'Системная',
      light: 'Светлая',
      dark: 'Темная',
      save: 'Сохранить',
      cancel: 'Отмена',
      editProfile: 'Редактировать профиль',
      changePassword: 'Изменить пароль',
      clearHistory: 'Очистить историю',
      about: 'О приложении',
      version: 'Версия',
      
      // Common
      loading: 'Загрузка...',
      error: 'Произошла ошибка',
      success: 'Успешно',
      ok: 'OK',
      yes: 'Да',
      no: 'Нет',
      
      // Validation
      allFieldsRequired: 'Все поля обязательны для заполнения',
      passwordTooShort: 'Пароль должен содержать не менее 6 символов',
      emailPasswordRequired: 'Требуется email и пароль',
      invalidCredentials: 'Неверный email или пароль',
      invalidEmail: 'Пожалуйста, введите корректный email',
      emailAlreadyInUse: 'Этот email уже используется',
      passwordsDontMatch: 'Пароли не совпадают',
      invalidName: 'Пожалуйста, введите корректное имя',
    },
  },
};

// Language configuration
type Language = {
  code: string;
  name: string;
};

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
];

type SupportedLanguage = 'en' | 'ru';

// Initialize i18n
const initializeI18n = async () => {
  try {
    // Try to get saved language from storage
    const settings = await StorageService.getSettings();
    const savedLanguage = settings?.language as SupportedLanguage | undefined;
    const deviceLanguage = (Localization.getLocales()[0]?.languageCode || 'en') as SupportedLanguage;
    
    // Use saved language, then device language, then fallback to English
    const lng = savedLanguage || 
      (SUPPORTED_LANGUAGES.some(lang => lang.code === deviceLanguage) ? deviceLanguage : 'en');
    
    const initOptions = {
      resources,
      lng,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    } as const;

    // For Android compatibility, we need to use a type assertion
    // to bypass the type checking for compatibilityJSON
    await i18n.use(initReactI18next).init({
      ...initOptions,
      // @ts-ignore - compatibilityJSON is a valid option for react-native-i18next
      compatibilityJSON: 'v3',
    });
    
    return i18n;
  } catch (error) {
    console.error('Error initializing i18n:', error);
    // Initialize with default language if there's an error
    await i18n.use(initReactI18next).init({
      resources,
      lng: 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
    return i18n;
  }
};

// Change app language
const changeLanguage = async (languageCode: SupportedLanguage): Promise<boolean> => {
  try {
    await i18n.changeLanguage(languageCode);
    // Save language preference to settings
    const settings = await StorageService.getSettings() || {};
    await StorageService.saveSettings({ ...settings, language: languageCode });
    return true;
  } catch (error) {
    console.error('Error changing language:', error);
    return false;
  }
};

// Initialize i18n on app start
const initI18n = initializeI18n();

// Export the supported languages as a readonly array
const supportedLanguages = Object.freeze([...SUPPORTED_LANGUAGES]) as readonly Language[];

// Export the i18n instance and other utilities
export { 
  i18n, 
  initI18n, 
  changeLanguage, 
  supportedLanguages, 
  SUPPORTED_LANGUAGES as supportedLanguagesList 
};

export type { SupportedLanguage, Language };
export default i18n;
