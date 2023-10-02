import { Identity, Show } from "./api/types";
import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import {
  createStackNavigator,
  StackScreenProps,
} from "@react-navigation/stack";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabScreenProps,
} from "@react-navigation/material-top-tabs";

// see: https://reactnavigation.org/docs/typescript

type ShowProps = { showId: string | null };

// Root //

export type RootNavigation = {
  home: undefined;
  shows: undefined;
  scan: undefined;
  memories: undefined;
  showings: undefined;
  settings: undefined;
};
export const { Navigator: RootTabNavigator, Screen: RootTabScreen } =
  createBottomTabNavigator<RootNavigation>();
export type RootScreenProps<T extends keyof RootNavigation> =
  BottomTabScreenProps<RootNavigation, T>;

// Shows //

export type ShowsNavigation = {
  showList: undefined;
  show: ShowProps;
};
export const { Navigator: ShowsStackNavigator, Screen: ShowsStackScreen } =
  createStackNavigator<ShowsNavigation>();
export type ShowsScreenProps<T extends keyof ShowsNavigation> =
  StackScreenProps<ShowsNavigation, T>;

// Show //

export type ShowNavigation = {
  showDisplay: ShowProps;
  showEditor: ShowProps;
};
export const { Navigator: ShowStackNavigator, Screen: ShowStackScreen } =
  createStackNavigator<ShowNavigation>();
export type ShowScreenProps<T extends keyof ShowNavigation> = StackScreenProps<
  ShowNavigation,
  T
>;

// Editor //

export type EditorNavigation = {
  chapters: { show: Show & Identity };
  details: { show: Show & Identity };
};
export const { Navigator: EditorTabNavigator, Screen: EditorTabScreen } =
  createMaterialTopTabNavigator<EditorNavigation>();
export type EditorScreenProps<T extends keyof EditorNavigation> =
  MaterialTopTabScreenProps<EditorNavigation, T>;

// Showings //

export type ShowingNavigation = {
  showing: { showingId: string | null } & ShowProps;
  newShowing: undefined;
  showingList: undefined;
};
export const { Navigator: ShowingStackNavigator, Screen: ShowingStackScreen } =
  createStackNavigator<ShowingNavigation>();
export type ShowingScreenProps<T extends keyof ShowingNavigation> =
  StackScreenProps<ShowingNavigation, T>;

// Settings //

export type SettingsNavigation = {
  settingList: undefined;
  signIn: undefined;
};
export const {
  Navigator: SettingsStackNavigator,
  Screen: SettingsStackScreen,
} = createStackNavigator<SettingsNavigation>();
export type SettingsScreenProps<T extends keyof SettingsNavigation> =
  StackScreenProps<SettingsNavigation, T>;
