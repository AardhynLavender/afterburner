import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { HeroInteraction } from "../../../../static";

export function HeroInteraction({
  interaction,
}: {
  interaction: HeroInteraction;
}) {
  return (
    <View>
      <Text style={styles.text}>{interaction.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 32,
    textAlign: "center",
  },
});
