import React, { PropsWithRef } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  Text,
  ViewStyle,
  View,
} from "react-native";

type TextFieldProps = { style?: ViewStyle; label: string } & TextInputProps;

export function TextField({
  label,
  style = {},
  ...textInputProps
}: TextFieldProps) {
  const fieldStyles = { ...styles.field, ...styles };
  return (
    <View style={fieldStyles}>
      <Text style={styles.label}>{label}</Text>
      <TextInput {...textInputProps} />
    </View>
  );
}

type NumberFieldProps = Omit<TextFieldProps, "value" | "onChange"> & {
  min?: number;
  max?: number;
  value?: number;
  onChange: (value: number) => void;
};

export function NumberField({
  label,
  onChange,
  style = {},
  ...numberInputProps
}: NumberFieldProps) {
  const fieldStyles = { ...styles.field, ...styles };
  const handleChange = (valueStr: string) => {
    const value = parseInt(valueStr);

    if (isNaN(value) || (numberInputProps.min && value < numberInputProps.min))
      return;

    onChange(value);
  };

  return (
    <View style={fieldStyles}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...numberInputProps}
        value={numberInputProps.value?.toString() ?? "0"}
        keyboardType="number-pad"
        onChangeText={handleChange}
      />
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
