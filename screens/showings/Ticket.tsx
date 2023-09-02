import React from "react";
import { View, StyleSheet, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { PublicTicket, encodeTicket } from "../../api/ticket";

export default function Ticket({ ticket }: { ticket: PublicTicket }) {
  const code = encodeTicket(ticket);

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
