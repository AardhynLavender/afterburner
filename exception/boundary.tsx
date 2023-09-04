import React, { ReactElement, ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ErrorBoundary as ErrorBoundaryPrimitive } from "react-error-boundary";
import Button from "../components/ui/Button";

const DEFAULT_ERROR_MESSAGE = "Something went wrong";

function ErrorScreen({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}): ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>
        {error.message || DEFAULT_ERROR_MESSAGE}
      </Text>
      <Button onPress={resetErrorBoundary}>Try again</Button>
    </View>
  );
}

export default function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundaryPrimitive fallbackRender={ErrorScreen}>
      {children}
    </ErrorBoundaryPrimitive>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
