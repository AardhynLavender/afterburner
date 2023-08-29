import React from "react";
import { View } from "react-native";
import Button from "../../../../components/ui/Button";
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
      <Button onPress={next}>Next Track</Button>
    </View>
  );
}
