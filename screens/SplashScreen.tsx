import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, /*Animated,*/ Easing } from "react-native";

export default function SplashScreen({ text }: { text?: string }) {
  // const angle = useSpin();

  return (
    <View style={styles.container}>
      {/* <Animated.View
        style={{
          ...styles.spinner,
          transform: [{ rotate: angle }],
        }}
      /> */}
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
}

// const MIN_ANGLE = 0;
// const MAX_ANGLE = 360;
// const INITIAL_ANGLE = 0;
// const DEFAULT_DURATION = 1000;
// const UNIT = 1;
// function useSpin({
//   minAngle = MIN_ANGLE,
//   maxAngle = MAX_ANGLE,
//   initialAngle = INITIAL_ANGLE,
//   duration = DEFAULT_DURATION,
// }: {
//   minAngle?: number;
//   maxAngle?: number;
//   initialAngle?: number;
//   duration?: number;
// } = {}) {
//   const unit = useRef(new Animated.Value(initialAngle));
//   useEffect(() => {
//     Animated.loop(
//       Animated.timing(unit.current, {
//         toValue: UNIT,
//         duration,
//         easing: Easing.linear,
//         useNativeDriver: true,
//       })
//     ).start();
//   }, [duration]);

//   const angle = unit.current.interpolate({
//     inputRange: [0, UNIT],
//     outputRange: [`${minAngle}deg`, `${maxAngle}deg`],
//   });

//   return angle;
// }

const SPINNER_SIZE = 64;
const SPINNER_BAND_WIDTH = 4;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    width: SPINNER_SIZE,
    height: SPINNER_SIZE,
    borderRadius: SPINNER_SIZE / 2,

    borderWidth: SPINNER_BAND_WIDTH,
    borderColor: "#eee",
    borderStyle: "solid",
    borderLeftColor: "#000",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
