import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Login: undefined;
  Register: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Chat: undefined;
  Profile: undefined;
};

export type ChatStackParamList = {
  Chat: undefined;
  Settings: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
};

// Re-export for easier imports
export type { NativeStackNavigationProp } from '@react-navigation/native-stack';
