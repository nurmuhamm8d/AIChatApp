import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Chat: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type ChatStackParamList = { Chat: undefined; Settings: undefined };
export type ProfileStackParamList = { Profile: undefined; Settings: undefined };

export type { NativeStackNavigationProp } from '@react-navigation/native-stack';
