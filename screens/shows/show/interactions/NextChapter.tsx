import React from "react";
import { View, Button } from "react-native";
import type { NextChapterInteraction } from "../../../../static";
import { useChapterContext } from "../context";

export function NextChapterInteraction({
  interaction: _,
}: {
  interaction: NextChapterInteraction;
}) {
  const { next } = useChapterContext();

  return (
    <View>
      <Button title="Next Track" onPress={next} />
    </View>
  );
}
