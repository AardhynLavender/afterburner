import { useFonts } from "expo-font";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RootScreenProps } from "../navigation";

export default function Memories({}: RootScreenProps<"memories">) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardHeading}>No memories yet</Text>
        <Text style={styles.body}>Participate in a show and create some!</Text>
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
    padding: 32,
    gap: 16,
  },
  cardHeading: {
    textAlign: "center",
    fontSize: 32,
    fontFamily: "Nimbus sans",
    alignContent: "center",
  },
  body: {
    textAlign: "center",
  },
});
