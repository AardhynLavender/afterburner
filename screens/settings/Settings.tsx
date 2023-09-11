import { StackNavigationOptions } from "@react-navigation/stack";
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { signOut } from "../../api/authenticate";
import { usePersistentDumpQuery } from "../../api/persistent";
import Button from "../../components/ui/Button";
import { useAuth } from "../../contexts/auth";
import {
  RootScreenProps,
  SettingsScreenProps,
  SettingsStackNavigator,
  SettingsStackScreen,
} from "../../navigation";
import SignIn from "./SignIn";
import { useActiveShow } from "../../api/activeShow";
import DevOnly from "../../components/util/DevOnly";

const options: StackNavigationOptions = {
  headerShown: false,
  animationEnabled: false,
};

export default function Settings({}: RootScreenProps<"settings">) {
  return (
    <SettingsStackNavigator initialRouteName="settingList">
      <SettingsStackScreen
        options={options}
        name="settingList"
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

function SettingsList({ navigation }: SettingsScreenProps<"settingList">) {
  const handleSignIn = () => navigation.navigate("signIn");
  const handleSignOut = () => signOut();

  const { user } = useAuth();

  const { clearActiveShow } = useActiveShow();

  return (
    <ScrollView style={styles.container}>
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
        <DevOnly>
          <View style={styles.setting}>
            <Text>Clear active show and ticket</Text>
            <Button onPress={clearActiveShow}>Remove</Button>
          </View>
        </DevOnly>
      </View>
      <DevOnly>
        <Text>{JSON.stringify(user, null, 2)}</Text>
        <Text>{JSON.stringify(process.env, null, 2)}</Text>
        <PersistentDump />
      </DevOnly>
    </ScrollView>
  );
}

function PersistentDump() {
  const { data: storeDump } = usePersistentDumpQuery();
  return <Text>{JSON.stringify(storeDump, null, 2)}</Text>;
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
