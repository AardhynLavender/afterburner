import React from "react";
import { View, Text } from "react-native";
import Button from "../../../../components/ui/Button";
import type { NextChapterInteraction } from "../../../../api/types";
import { useChapterContext } from "../display/context";

const DEFAULT_NEXT_TEXT = "Next Chapter";

export function NextChapterInteraction({
  interaction,
}: {
  interaction: NextChapterInteraction;
}) {
  const { next } = useChapterContext();

  return (
    <View>
      <Button onPress={next}>{interaction.text ?? DEFAULT_NEXT_TEXT}</Button>
    </View>
  );
}
