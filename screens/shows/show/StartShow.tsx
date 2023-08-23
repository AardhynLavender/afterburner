import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Button from "../../../components/ui/Button";
import TicketScanner, { useTicketScanner } from "../../scan/TicketScanner";

export default function StartShow({
  onStart: handleStart,
  title = "Start Show",
  description = "When your ready, press the start button",
}: {
  onStart: () => void;
  title: string;
  description: string;
}) {
  const { permission, handleScan } = useTicketScanner();
  const scanned = true;

  return (
    <View style={styles.container}>
      <TicketScanner permission={permission} onScan={handleScan} />
      <View style={styles.card}>
        <Text style={styles.heading}>{title}</Text>
        <Text style={styles.description}>
          {scanned ? description : "Scan a ticket to participate in this show"}
        </Text>
        <Button
          onPress={handleStart}
          style={{ alignItems: "center" }}
          disabled={!scanned}
        >
          Start Show
        </Button>
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
