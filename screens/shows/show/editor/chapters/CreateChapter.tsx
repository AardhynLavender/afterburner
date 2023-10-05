import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useChapterCreateMutation } from "../../../../../api/chapter";
import Button from "../../../../../components/ui/Button";
import TextField from "../../../../../components/ui/TextField";
import { invariant } from "../../../../../exception/invariant";
import { ChapterEditorScreenProps } from "../../../../../navigation";

export default function CreateChapter({
  navigation,
  route,
}: ChapterEditorScreenProps<"create">) {
  const { showId, chapterId } = route.params;
  invariant(showId, "`show` is required");

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [file, setFile] = React.useState("");

  const { addChapter, error } = useChapterCreateMutation();
  const handleSubmit = async () =>
    addChapter(showId, {
      title,
      description,
      fileName: "text-file",
      id: chapterId,
    });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Chapter</Text>
      <TextField
        label="Title"
        placeholder="chapter title"
        value={title}
        onChangeText={setTitle}
      />
      <TextField
        label="Description"
        placeholder="chapter description"
        value={description}
        onChangeText={setDescription}
      />

      {/* File upload */}

      <Button onPress={handleSubmit}>Create Chapter</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  heading: { fontSize: 24, fontWeight: "bold" },
});
