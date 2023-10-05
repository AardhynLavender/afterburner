import React, { ReactElement } from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  View,
  ViewStyle,
  Text,
} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";

export type PressHandler = ((e: GestureResponderEvent) => void) & (() => void);

export type ButtonVariant = "filled" | "stealth" | "outline";

export type ButtonProps = {
  children?: string | ReactElement;
  onPress?: PressHandler;
  variant?: ButtonVariant;
  style?: ViewStyle;
  disabled?: boolean;
};

export default function Button({
  children = "button",
  variant = "filled",
  onPress = () => {},
  style = {},
  disabled = false,
}: ButtonProps) {
  const buttonStyles = {
    ...styles.button, // default styles
    ...buttonVariant[variant], // variant styles
    ...(disabled ? styles.disabled : {}), // disabled styles
    ...style, // user defined styles
  };
  return (
    <TouchableHighlight
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        ...styles.touchable,
        ...buttonVariant[variant], // variant styles
      }}
      disabled={disabled}
    >
      <View style={buttonStyles}>
        {typeof children === "string" ? (
          <Text style={{ ...styles.text, color: buttonVariant[variant].color }}>
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  touchable: { borderRadius: 8 },
  button: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    color: "inherit",
    width: "100%",
  },
  disabled: {
    backgroundColor: "#b8c3cc",
  },
  text: {
    color: "inherit",
    fontSize: 16,
    fontWeight: "bold",
  },
});

const buttonVariant = StyleSheet.create({
  filled: { backgroundColor: "#2196F3", color: "#fff" },
  outline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#2196F3",
    color: "#2196F3",
  },
  stealth: { backgroundColor: "transparent", color: "#000" },
});
