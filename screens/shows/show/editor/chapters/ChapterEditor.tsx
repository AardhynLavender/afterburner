import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useChapterMutation } from "../../../../../api/chapter";
import { Chapter, Identity } from "../../../../../api/types";
import TextField from "../../../../../components/ui/TextField";
import { invariant } from "../../../../../exception/invariant";
import { ChapterEditorScreenProps } from "../../../../../navigation";

export default function ChapterEditor({
  route,
}: ChapterEditorScreenProps<"chapter">) {
  const { show, chapter } = route.params;
  invariant(show, "`show` is required");

  const { mutateChapter, loading } = useChapterMutation();
  const handleBlur = async (mutation: Partial<Chapter>) =>
    mutateChapter(show.id, chapter.id, mutation);

  const [title, setTitle] = React.useState(chapter.title);
  const [description, setDescription] = React.useState(chapter.description);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Chapter</Text>
      {loading && <Text>Loading...</Text>}
      <TextField
        label="Title"
        placeholder="chapter title"
        value={title}
        onChangeText={setTitle}
        onBlur={() => handleBlur({ title })}
      />
      <TextField
        label="Description"
        placeholder="chapter description"
        value={description}
        onChangeText={setDescription}
        onBlur={() => handleBlur({ description })}
      />
      {/* <Text style={styles.heading}>Edit Interactions</Text> */}
      {/* <InteractionEditor chapter={chapter} /> */}
    </View>
  );
}

// function InteractionEditor({ chapter }: { chapter: Chapter }) {
//   const [interactions, setInteractions] = useState(chapter.interactions);
//   const { mutateChapter } = useChapterMutation();

//   return (
//     <View>
//       {interactions?.map((interaction, index) => (
//         <View>
//           <Text>{interaction.type}</Text>
//         </View>
//       ))}
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  heading: { fontSize: 24, fontWeight: "bold" },
});
