import React from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  View,
  ViewStyle,
  Text,
} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";

export type PressHandler = ((e: GestureResponderEvent) => void) & (() => void);

export type ButtonProps = {
  children?: string;
  onPress?: PressHandler;
  style?: ViewStyle;
  disabled?: boolean;
};

export default function Button({
  children = "button",
  onPress = () => {},
  style = {},
  disabled = false,
}: ButtonProps) {
  const buttonStyles = {
    ...styles.button, // default styles
    ...(disabled ? styles.disabled : {}), // disabled styles
    ...style, // user defined styles
  };
  return (
    <TouchableHighlight
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.touchable}
      disabled={disabled}
    >
      <View style={buttonStyles}>
        <Text style={styles.text}>{children}</Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 8,
    backgroundColor: "#2196F3",
  },
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  disabled: {
    backgroundColor: "#b8c3cc",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
