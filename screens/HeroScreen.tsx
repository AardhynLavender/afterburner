import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HeroScreen({
  title,
  body,
}: {
  title: string;
  body?: ReactNode;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
      {body ? body : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    gap: 16,
    justifyContent: "center",
  },
  text: {},
});
