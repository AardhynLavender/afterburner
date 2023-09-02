import { BarCodeScannerResult } from "expo-barcode-scanner";
import { Camera, CameraType } from "expo-camera";
import React from "react";
import { useState, useEffect, ReactElement } from "react";
import { Text, View, StyleSheet } from "react-native";
import { PublicTicket, extractTicket } from "../../api/ticket";

export default function TicketScanner({
  onScan: handleScan,
  permission,
  permissionFallback = <Text>No access to camera</Text>,
}: {
  onScan: (result: BarCodeScannerResult) => void;
  permission: boolean;
  permissionFallback?: ReactElement;
}) {
  if (!permission) return permissionFallback;

  return (
    <View style={styles.card}>
      <Camera
        style={styles.camera}
        type={CameraType.back}
        onBarCodeScanned={handleScan}
      />
    </View>
  );
}

export function useTicketScanner() {
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [ticket, setTicket] = useState<PublicTicket | null>(null);

  const handleScan = ({ data }: BarCodeScannerResult) => {
    if (scanned) return;
    const ticket = extractTicket(data);
    setScanned(true);

    setTicket(ticket);
  };

  const reset = () => {
    setScanned(false);
    setTicket(null);
  };

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  return {
    scanned,
    reset,
    ticket,
    handleScan,
    permission: permission?.granted ?? false,
  };
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#e9e9e9",
    borderRadius: 32,
    padding: 24,
    gap: 16,
  },
  camera: {
    width: "100%",
    aspectRatio: 1,
    overflow: "hidden",
    borderRadius: 16,
  },
});
