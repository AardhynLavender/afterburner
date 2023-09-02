import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RootScreenProps } from "../../navigation";
import TicketScanner, { useTicketScanner } from "./TicketScanner";
import { useClaimTicket } from "../../api/ticket";

export default function Scan({}: RootScreenProps<"scan">) {
  const { permission, ticket, handleScan } = useTicketScanner();
  const { data: status } = useClaimTicket(ticket);

  return (
    <View style={styles.container}>
      <TicketScanner permission={permission} onScan={handleScan} />
      <View style={{ ...styles.card, flex: 1 }}>
        {ticket ? (
          <>
            <Text>{ticket && JSON.stringify(ticket, null, 2)}</Text>
            <Text>claimed: {status}</Text>
          </>
        ) : (
          <Text style={styles.cardHeading}>
            Find and scan a ticket to participate in a show
          </Text>
        )}
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
