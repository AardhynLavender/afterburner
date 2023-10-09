import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  useChapterGetQuery,
  useChapterMutation,
} from "../../../../../api/chapter";
import { Chapter } from "../../../../../api/types";
import Button from "../../../../../components/ui/Button";
import TextField from "../../../../../components/ui/TextField";
import { invariant } from "../../../../../exception/invariant";
import { ChapterEditorScreenProps } from "../../../../../navigation";
import * as DocumentPicker from "expo-document-picker";
import { uploadFile } from "../../../../../api/firebase";
import { useEffect } from "react";

const FILES_PER_CHAPTER = 1;

export default function ChapterEditor({
  route,
}: ChapterEditorScreenProps<"chapter">) {
  const { show, chapterId } = route.params;
  invariant(show, "`show` is required");

  // api //
  const { chapter, loading: chapterLoading } = useChapterGetQuery(
    show.id,
    chapterId
  );
  const { mutateChapter, loading: chapterMutating } = useChapterMutation();

  // form //
  const [title, setTitle] = useState(chapter?.title);
  const [description, setDescription] = useState(chapter?.description);
  const handleBlur = async (mutation: Partial<Chapter>) => {
    invariant(!chapterLoading, "Chapter is still loading");
    invariant(chapter, "`chapter` is required");
    mutateChapter(show.id, chapter.id, mutation);
  };

  // file uploads //
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);
  const handleUpload = async () => {
    invariant(!chapterLoading, "Chapter is still loading");
    invariant(chapter, "`chapter` is required");

    // reset state
    setUploading(true);
    setSuccess(false);
    setError(null);

    // pick a file using the document picker
    const { assets, canceled } = await DocumentPicker.getDocumentAsync({
      multiple: false,
    });
    if (canceled) return;
    invariant(assets.length === FILES_PER_CHAPTER, "Expected one file");
    const [asset] = assets;

    // upload the file to firebase storage
    try {
      const path = `${show.slug}/${asset.name}`;
      await uploadFile(asset.uri, path); // upload file to firebase
      await mutateChapter(show.id, chapter.id, { fileName: asset.name }); // update chapter audio filename in firestore
      setSuccess(true);
    } catch (error) {
      setError(error as Error);
    } finally {
      setUploading(false);
    }
  };

  if (chapterLoading || !chapter) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Chapter</Text>
      {chapterMutating && <Text>Loading...</Text>}
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
      <View style={styles.fileZone}>
        {chapter.fileName ? (
          <>
            <Text style={styles.file}>{chapter.fileName}</Text>
            <Button onPress={handleUpload}>Change</Button>
          </>
        ) : (
          <>
            <Text>No file uploaded</Text>
            <Button onPress={handleUpload}>Upload</Button>
          </>
        )}
        {uploading && <Text>Uploading...</Text>}
        {success && <Text style={{ color: "#0f0" }}>Success!</Text>}
        {error && <Text style={{ color: "#f00" }}>{error.message}!</Text>}
      </View>

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
  fileZone: {
    backgroundColor: "#ddd",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  file: {
    fontSize: 12,
    borderWidth: 1,
    borderColor: "#444",
    color: "#444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
  },
});
