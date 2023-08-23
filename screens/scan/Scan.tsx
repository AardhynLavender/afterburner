import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RootScreenProps } from "../../navigation";
import TicketScanner, { useTicketScanner } from "./TicketScanner";

export default function Scan({}: RootScreenProps<"scan">) {
  const { permission, handleScan } = useTicketScanner();

  return (
    <View style={styles.container}>
      <TicketScanner permission={permission} onScan={handleScan} />
      <View style={{ ...styles.card, flex: 1 }}>
        <Text style={styles.cardHeading}>
          Find and scan a ticket to participate in a show
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 32,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#e9e9e9",
    borderRadius: 32,
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  cardHeading: {
    fontSize: 18,
    textAlign: "center",
  },
});
