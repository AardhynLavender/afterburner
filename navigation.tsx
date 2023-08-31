import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import {
  createStackNavigator,
  StackScreenProps,
} from "@react-navigation/stack";

// Root Bottom tabs //

export type RootNavigation = {
  home: undefined;
  shows: undefined;
  scan: undefined;
  memories: undefined;
  settings: undefined;
};
export const { Navigator: RootTabNavigator, Screen: RootTabScreen } =
  createBottomTabNavigator<RootNavigation>();
export type RootScreenProps<T extends keyof RootNavigation> =
  BottomTabScreenProps<RootNavigation, T>;

// Shows //

export type ShowNavigation = {
  list: undefined;
  show: { showId: number | null };
};
export const { Navigator: ShowStackNavigator, Screen: ShowStackScreen } =
  createStackNavigator<ShowNavigation>();
export type ShowScreenProps<T extends keyof ShowNavigation> = StackScreenProps<
  ShowNavigation,
  T
>;

// Settings //

export type SettingsNavigation = {
  settings: undefined;
  signIn: undefined;
};
export const {
  Navigator: SettingsStackNavigator,
  Screen: SettingsStackScreen,
} = createStackNavigator<SettingsNavigation>();
export type SettingsScreenProps<T extends keyof SettingsNavigation> =
  StackScreenProps<SettingsNavigation, T>;
