import React, { useState } from "react";
import {
  useChapterListQuery,
  useChapterMutation,
} from "../../../../../api/chapter";
import { Chapter, Identity, Show } from "../../../../../api/types";
import {
  EditorScreenProps,
  ChapterEditorScreenProps,
} from "../../../../../navigation";
import SplashScreen from "../../../../SplashScreen";
import { invariant } from "../../../../../exception/invariant";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../../../../../components/ui/Button";
import Fi from "react-native-vector-icons/Feather";

export default function ChapterList({
  navigation,
  route,
}: ChapterEditorScreenProps<"list">) {
  const { show } = route.params;
  invariant(show, "`show` is required");

  const { chapters, loading } = useChapterListQuery(show.id);
  if (loading) return <SplashScreen />;

  const handleInsertChapter = () =>
    navigation.navigate("create", {
      showId: show.id,
      chapterId: chapters.length,
    });
  const toChapter = (chapter: Chapter) => () =>
    navigation.navigate("chapter", { show, chapter });

  return (
    <ScrollView>
      <View style={styles.container}>
        <Button onPress={handleInsertChapter}>Create Chapter</Button>
        {chapters.map((chapter, index) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            onPress={toChapter(chapter)}
          />
        ))}
      </View>
    </ScrollView>
  );
}
function ChapterCard({
  onPress: handlePress,
  chapter,
}: {
  onPress?: () => void;
  chapter: Chapter & Identity;
}) {
  return (
    <TouchableOpacity style={styles.chapter} onPress={handlePress}>
      <View>
        <View style={styles.chapterHeader}>
          <Text style={styles.chapterTitle}>{chapter.title}</Text>
          <Text style={styles.audioFile}>{chapter.fileName}</Text>
        </View>
        <Text>{chapter.description}</Text>
      </View>
    </TouchableOpacity>
  );
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
