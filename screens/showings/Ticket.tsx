import React from "react";
import { View, StyleSheet, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { TicketMeta } from "../../api/ticket";

export default function Ticket({
  showingId,
  ticketKey,
  ticketMeta = null,
}: {
  showingId: string | number;
  ticketKey: string | number;
  ticketMeta: TicketMeta;
}) {
  const metaString = JSON.stringify(ticketMeta ?? {});
  const code = `${showingId}-${ticketKey}-${metaString}`;

  return (
    <View style={styles.container}>
      <QRCode
        value={code}
        backgroundColor="transparent"
        color="#223"
        size={96}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});
