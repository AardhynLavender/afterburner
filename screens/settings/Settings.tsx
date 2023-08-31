import { StackNavigationOptions } from "@react-navigation/stack";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { signOut } from "../../api/authenticate";
import Button from "../../components/ui/Button";
import { useAuth } from "../../contexts/auth";
import {
  RootScreenProps,
  SettingsScreenProps,
  SettingsStackNavigator,
  SettingsStackScreen,
} from "../../navigation";
import SignIn from "./SignIn";

const options: StackNavigationOptions = {
  headerShown: false,
  animationEnabled: false,
};

export default function Settings({}: RootScreenProps<"settings">) {
  return (
    <SettingsStackNavigator initialRouteName="settings">
      <SettingsStackScreen
        options={options}
        name="settings"
        component={SettingsList}
      />
      <SettingsStackScreen
        options={{ ...options, headerShown: true, headerTitle: "Sign In" }}
        name="signIn"
        component={SignIn}
      />
    </SettingsStackNavigator>
  );
}

function SettingsList({ navigation }: SettingsScreenProps<"settings">) {
  const handleSignIn = () => navigation.navigate("signIn");
  const handleSignOut = () => signOut();

  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {user ? (
          <View style={styles.setting}>
            <Text>Sign out of Afterburner</Text>
            <Button onPress={handleSignOut}>Sign out</Button>
          </View>
        ) : (
          <View style={styles.setting}>
            <Text>Sign in to manage shows</Text>
            <Button onPress={handleSignIn}>Sign in</Button>
          </View>
        )}
      </View>
      {process.env.EXPO_PUBLIC_IS_DEV && (
        <>
          <Text>{JSON.stringify(user, null, 2)}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
    padding: 24,
  },
  card: {
    backgroundColor: "#e9e9e9",
    borderRadius: 32,
    gap: 16,
    padding: 24,
  },
  setting: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
