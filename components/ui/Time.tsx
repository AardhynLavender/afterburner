import React, { useState } from "react";
import { ViewStyle, View, Text, Switch } from "react-native";
import {
  msToHours,
  msToMinutes,
  msToSeconds,
  destructuredTimeToMs,
  HOUR_M,
  MINUTE_S,
  MAX_HOUR_MINUTES,
  MAX_MINUTE_SECONDS,
} from "../../util/time";
import { NumberField } from "./TextField";
import { useEffect } from "react";

const MAX_HOURS = 512;

export function TimePicker({
  label,
  value,
  onChange,
  style,
}: {
  label?: string;
  value: number;
  onChange: (ms: number) => void;
  style?: ViewStyle;
}) {
  const [negative, setNegative] = useState(value < 0);
  useEffect(() => {
    handleChange();
  }, [negative]);
  const valueAbs = Math.abs(value);

  const [hours, setHours] = useState(Math.floor(msToHours(valueAbs)));
  const [minutes, setMinutes] = useState(
    Math.floor(msToMinutes(valueAbs) % HOUR_M)
  );
  const [seconds, setSeconds] = useState(
    Math.floor(msToSeconds(valueAbs) % MINUTE_S)
  );

  const handleChange = () => {
    const msAbs = destructuredTimeToMs(hours, minutes, seconds);
    const ms = negative ? -msAbs : msAbs;
    if (ms !== value) onChange(ms);
  };

  return (
    <View style={{ gap: 8, ...style }}>
      {label && <Text>{label}</Text>}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <NumberField
          label="Hours"
          value={hours}
          onChange={setHours}
          onBlur={handleChange}
          // min={0}
          max={MAX_HOURS}
        />
        <NumberField
          label="Minutes"
          value={minutes}
          onBlur={handleChange}
          onChange={setMinutes}
          // min={0}
          max={MAX_HOUR_MINUTES}
        />
        <NumberField
          label="Seconds"
          value={seconds}
          onChange={setSeconds}
          onBlur={handleChange}
          // min={0}
          max={MAX_MINUTE_SECONDS}
        />
        <View>
          <Text>From {negative ? "end" : "start"}</Text>
          <Switch value={negative} onValueChange={setNegative} />
        </View>
      </View>
    </View>
  );
}
