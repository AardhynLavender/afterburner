import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import { useShowMutation } from "../../../../api/shows";
import { TextField } from "../../../../components/ui/TextField";
import { EditorScreenProps } from "../../../../navigation";

export default function Details({ route }: EditorScreenProps<"details">) {
  const { show } = route.params;
  const { mutateShow, isMutating } = useShowMutation();

  const [name, setName] = useState(show?.name ?? "");
  const [description, setDescription] = useState(show?.description ?? "");

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* todo: replace with toast, or something */}
        {isMutating && <Text>Updating...</Text>}

        <TextField
          label="Show name"
          placeholder="Show name"
          value={name}
          onChangeText={setName}
          onBlur={() => mutateShow(show.id, { name })}
        />
        <TextField
          label="Description"
          placeholder="Show description"
          onBlur={() => mutateShow(show.id, { description })}
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
});
