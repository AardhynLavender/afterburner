import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Button from "../../../components/ui/Button";
import { useActiveShow } from "../../../api/activeShow";
import DevOnly from "../../../components/util/DevOnly";
import { useAuth } from "../../../contexts/auth";

export default function StartShow({
  onStart: handleStart,
  onNavigate: handleNavigate,
  title = "Start Show",
  description = "When your ready, press the start button",
}: {
  onStart: () => void;
  onNavigate: () => void;
  title: string;
  description: string;
}) {
  const { activeShow } = useActiveShow();
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <View style={{ ...styles.card, flex: 1 }}>
        {user && (
          <View style={{ alignItems: "flex-end" }}>
            <Button>Edit</Button>
          </View>
        )}
        <View style={{ flex: 1, gap: 16, justifyContent: "center" }}>
          <Text style={styles.heading}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        {activeShow ? (
          <Button onPress={handleStart} style={{ alignItems: "center" }}>
            Start Show
          </Button>
        ) : (
          <>
            <Text style={{ textAlign: "center" }}>
              You do not have a ticket for this show
            </Text>
            <Button onPress={handleNavigate} style={{ alignItems: "center" }}>
              Scan Ticket
            </Button>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 32,
    padding: 24,
  },
  card: {
    width: "100%",
    display: "flex",
    gap: 32,
    justifyContent: "center",
    backgroundColor: "#e9e9e9",
    borderRadius: 32,
    padding: 16,
  },
  heading: {
    fontSize: 32,
    textAlign: "center",
    fontWeight: "bold",
  },
  description: { textAlign: "center" },
});
