import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { RootScreenProps } from "../../navigation";
import TicketScanner, { useTicketScanner } from "./TicketScanner";
import {
  PublicTicket,
  TicketClaim,
  useClaimTicket,
  usePersistentTicket,
} from "../../api/ticket";
import { Public } from "../../api/audio";

export default function Scan({}: RootScreenProps<"scan">) {
  const { permission, ticket, error, handleScan } = useTicketScanner();

  const [persistentTicket, setPersistentTicket] = usePersistentTicket();
  const { data: status } = useClaimTicket(ticket, {
    claim: persistentTicket?.key !== ticket?.key, // only claim if not already claimed
  });
  useEffect(() => {
    if (status === "SUCCESS" && ticket) setPersistentTicket(ticket);
  }, [status]);

  const { data, error: e } = Public.useGetAudioQuery(
    "theAndersonLocalization",
    "Track-1.mp3",
    "there-once-was-a-cat-that-liked-to-sit-on-the-mat-and-his-name-was-gregory-james-anderson"
  );
  console.log("error: ", e);
  console.log("data: ", data);

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
