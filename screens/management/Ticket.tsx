import React from "react";
import { View, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function Ticket({
  showingId,
  seatKey,
}: {
  showingId: string | number;
  seatKey: string | number;
}) {
  const code = `${showingId}-${seatKey}`;
  return (
    <View style={styles.container}>
      <QRCode
        value={code}
        backgroundColor="transparent"
        color="#223"
        size={128}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
