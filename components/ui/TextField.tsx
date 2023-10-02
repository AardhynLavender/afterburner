import React, { PropsWithRef } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  Text,
  ViewStyle,
  View,
} from "react-native";

export default function TextField({
  label,
  style = {},
  ...textInputProps
}: {
  style?: ViewStyle;
  label: string;
} & TextInputProps) {
  const fieldStyles = { ...styles.field, ...styles };
  return (
    <View style={fieldStyles}>
      <Text style={styles.label}>{label}</Text>
      <TextInput {...textInputProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    backgroundColor: "#ddd",
    borderRadius: 16,
    padding: 8,
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
  },
});
