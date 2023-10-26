import React, { ReactElement } from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  View,
  ViewStyle,
  Text,
  Alert,
} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";

export type PressHandler = ((e: GestureResponderEvent) => void) & (() => void);

export type ButtonVariant = "filled" | "stealth" | "outline";

export type ButtonProps = {
  children?: string | ReactElement;
  onPress?: PressHandler;
  variant?: ButtonVariant;
  style?: ViewStyle;
  confirm?: string;
  disabled?: boolean;
};

export default function Button({
  confirm,
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

  const handlePress = () => {
    if (confirm)
      Alert.alert("Are you sure?", confirm, [
        { text: "Cancel", style: "cancel" }, // do nothing
        { text: "OK", onPress },
      ]);
    else onPress();
  };

  return (
    <TouchableHighlight
      onPress={handlePress}
      activeOpacity={0.9}
      style={{
        ...styles.touchable,
        ...buttonVariant[variant], // variant styles
      }}
      disabled={disabled}
    >
      <View style={buttonStyles}>
        {typeof children === "string" ? (
          <Text
            style={{
              ...styles.text,
              color: buttonVariant[variant].color, // color does not inherit, reapply here
            }}
          >
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
    opacity: 0.3,
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
