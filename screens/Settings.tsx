import { useFonts } from "expo-font";
import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { RootScreenProps } from "../navigation";

export default function Settings({}: RootScreenProps<"settings">) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.setting}>
          <Text>Sign in to manage shows</Text>
          <Button title="Sign in" />
        </View>
      </View>
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
    padding: 24,
    gap: 16,
  },
  setting: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
