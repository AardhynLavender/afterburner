import React, { useState } from "react";
import {
  useChapterListQuery,
  useChapterMutation,
} from "../../../../api/chapter";
import { Chapter, Identity } from "../../../../api/types";
import { EditorScreenProps } from "../../../../navigation";
import SplashScreen from "../../../SplashScreen";
import { invariant } from "../../../../exception/invariant";
import { View, Text, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function Chapters({
  navigation,
  route,
}: EditorScreenProps<"chapters">) {
  const { show } = route.params;
  invariant(show, "`show` is required");

  const { chapters, loading } = useChapterListQuery(show.id);
  if (loading) return <SplashScreen />;

  return (
    <ScrollView>
      <View style={styles.container}>
        {chapters.map((chapter) => (
          <ChapterEditor key={chapter.id} showId={show.id} chapter={chapter} />
        ))}
      </View>
    </ScrollView>
  );
}
function ChapterEditor({
  showId,
  chapter,
}: {
  showId: string;
  chapter: Chapter & Identity;
}) {
  return (
    <View style={styles.chapter}>
      <View style={styles.chapterHeader}>
        <Text style={styles.chapterTitle}>{chapter.title}</Text>
        <Text style={styles.audioFile}>{chapter.fileName}</Text>
      </View>
      <Text>{chapter.description}</Text>
    </View>
  );
}

function InteractionEditor({ chapter }: { chapter: Chapter & Identity }) {
  const [interactions, setInteractions] = useState(chapter.interactions);
  const { mutateChapter } = useChapterMutation();

  return <View />;
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    flex: 1,
    padding: 16,
  },
  chapter: {
    backgroundColor: "#ddd",
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  chapterHeader: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  chapterTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  audioFile: {
    fontSize: 12,
    backgroundColor: "#000",
    color: "#fff",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
});
