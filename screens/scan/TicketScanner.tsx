import { BarCodeScannerResult } from "expo-barcode-scanner";
import { Camera, CameraType } from "expo-camera";
import React from "react";
import { useState, useEffect, ReactElement } from "react";
import { Text, View, StyleSheet } from "react-native";

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
  const [result, setResult] = useState<BarCodeScannerResult>();

  const handleScan = ({
    data,
    type,
    bounds,
    cornerPoints,
  }: BarCodeScannerResult) => {
    setScanned(true);
    setResult({ data, type, bounds, cornerPoints });
  };

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  return {
    scanned,
    handleScan,
    result,
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
