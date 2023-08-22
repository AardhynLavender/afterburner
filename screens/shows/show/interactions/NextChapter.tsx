import React from "react";
import { View, Button, Text } from "react-native";
import { useChapterContext } from "../context";

export function NextChapterInteraction() {
  const { next } = useChapterContext();

  return (
    <View>
      <Button title="Next Track" onPress={next} />
    </View>
  );
}
