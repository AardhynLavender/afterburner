import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RootScreenProps } from "../../navigation";
import TicketScanner, { useTicketScanner } from "./TicketScanner";
import { PublicTicket, TicketClaim, useClaimTicket } from "../../api/ticket";

export default function Scan({}: RootScreenProps<"scan">) {
  const { permission, ticket, error, handleScan } = useTicketScanner();
  const { data: status } = useClaimTicket(ticket);

  return (
    <View style={styles.container}>
      <TicketScanner permission={permission} onScan={handleScan} />
      <View style={{ ...styles.card, flex: 1 }}>
        <Result ticket={ticket} error={error} status={status} />
      </View>
    </View>
  );
}

function Result({
  ticket,
  error,
  status,
}: {
  ticket?: PublicTicket | null;
  error: Error | null;
  status?: TicketClaim | null;
}) {
  if (error)
    return (
      <>
        <Text style={styles.error}>{error.message}</Text>
      </>
    );

  if (ticket)
    return (
      <>
        <Text>{ticket && JSON.stringify(ticket, null, 2)}</Text>
        <Text>claimed: {status}</Text>
      </>
    );

  return (
    <Text style={styles.cardHeading}>
      Find and scan a ticket to participate in a show
    </Text>
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
  error: {
    fontSize: 18,
    textAlign: "center",
    color: "red",
  },
});
