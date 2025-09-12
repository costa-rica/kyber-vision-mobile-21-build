import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Logout: undefined;
  SelectTeam: undefined;
  CreateTeam: undefined;
  Home: undefined;
  ScriptingLiveSelectSession: undefined;
  ScriptingLiveSelectPlayers: undefined;
  ScriptingLive: undefined;
};

export type RootStackNavigation = NativeStackNavigationProp<RootStackParamList>;

// Screen-specific prop helpers
// explaination: NativeStackScreenProps<...> — a utility type that produces:
// -- navigation.navigate('Login') is type-checked
// -- route.params is typed (for Splash it’s undefined).
export type SplashScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Splash'
>;

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;

export type LogoutScreenProps = NativeStackScreenProps<RootStackParamList, 'Logout'>;

export type SelectTeamScreenProps = NativeStackScreenProps<RootStackParamList, 'SelectTeam'>;

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export type ScriptingLiveSelectSessionScreenProps = NativeStackScreenProps<RootStackParamList, 'ScriptingLiveSelectSession'>;

export type ScriptingLiveSelectPlayersScreenProps = NativeStackScreenProps<RootStackParamList, 'ScriptingLiveSelectPlayers'>;