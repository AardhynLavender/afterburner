import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { BarCodeScannerResult } from "expo-barcode-scanner";
import { RootScreenProps } from "../navigation";

export default function Scan({ navigation }: RootScreenProps<"scan">) {
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [result, setResult] = useState<BarCodeScannerResult>();

  const handleBarCodeScan = ({
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

  if (!permission?.granted) return <Text>No access to camera</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Camera
          style={styles.camera}
          type={CameraType.back}
          onBarCodeScanned={handleBarCodeScan}
        />
      </View>
      <View style={{ ...styles.card, flex: 1 }}>
        <Text style={styles.heading}>Results</Text>
        <Text>
          {result?.type} {result?.data} {JSON.stringify(result?.bounds)}
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
  heading: {
    fontSize: 19,
    fontFamily: "Nimbus sans",
  },
  camera: {
    width: "100%",
    aspectRatio: 1,
    overflow: "hidden",
    borderRadius: 16,
  },
  card: {
    backgroundColor: "#e9e9e9",
    borderRadius: 32,
    padding: 24,
    gap: 16,
  },
  cardHeading: {
    fontSize: 32,
    fontFamily: "Nimbus sans",
    alignContent: "center",
  },
});
