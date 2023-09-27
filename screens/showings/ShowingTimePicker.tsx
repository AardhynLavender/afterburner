import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../../components/ui/Button";
import { OS } from "../../util/os";

export default function ShowingTimePicker({
  date,
  onDateChange,
  label,
}: {
  date: Date;
  onDateChange: (date: Date) => void;
  label: string;
}) {
  const handleChange = (e: DateTimePickerEvent, selectedDate?: Date) => {
    setDatePickerOpen(false);
    setTimePickerOpen(false);
    const currentDate = selectedDate || date;
    onDateChange(currentDate);
  };

  const props = { value: date || new Date(), onChange: handleChange };

  // for android
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);

  if (datePickerOpen) DateTimePickerAndroid.open({ ...props, mode: "date" });
  if (timePickerOpen) DateTimePickerAndroid.open({ ...props, mode: "time" });

  return (
    <View style={styles.time}>
      <Text style={styles.label}>{label}</Text>
      <OS ios web windows macos>
        <DateTimePicker mode="date" {...props} />
        <DateTimePicker mode="time" {...props} />
      </OS>
      <OS android>
        <AndroidDateTimeButton onPress={() => setDatePickerOpen(true)}>
          {date.toLocaleDateString()}
        </AndroidDateTimeButton>
        <AndroidDateTimeButton onPress={() => setTimePickerOpen(true)}>
          {date.toLocaleTimeString()}
        </AndroidDateTimeButton>
      </OS>
    </View>
  );
}

export function AndroidDateTimeButton({
  onPress,
  children,
}: {
  onPress: () => void;
  children: string;
}) {
  return (
    <Button onPress={onPress} style={{ backgroundColor: "#aaa" }}>
      {children}
    </Button>
  );
}

const styles = StyleSheet.create({
  label: { flex: 1 },
  time: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
