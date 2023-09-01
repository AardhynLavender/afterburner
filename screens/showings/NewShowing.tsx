import { ShowingScreenProps } from "../../navigation";
import { View, StyleSheet, Text } from "react-native";
import React, { useState } from "react";
import { useShowsListQuery } from "../../api/shows";
import SelectDropdown from "react-native-select-dropdown";
import Button from "../../components/ui/Button";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useShowingCreateMutation } from "../../api/showings";
import { invariant } from "../../exception/invariant";

export default function NewShowing({
  navigation,
  route,
}: ShowingScreenProps<"newShowing">) {
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());
  const [showId, setShowId] = useState<number | null>(null);

  const { mutate: createShow } = useShowingCreateMutation();
  const handleCreateShowing = async () => {
    invariant(showId, "show_id is required to create a showing");

    const show = {
      start_timestamp: start.toISOString(),
      stop_timestamp: end.toISOString(),
      show_id: showId,
      location_id: null,
    };

    createShow(show, {
      onSuccess: () => {
        setStart(new Date());
        setEnd(new Date());
        setShowId(null);
        navigation.navigate("showingList");
      },
    });
  };

  return (
    <View style={styles.container}>
      <ShowDropdown showId={showId} onShowIdChange={setShowId} />
      <ShowingTimePicker date={start} onDateChange={setStart} label="Start" />
      <ShowingTimePicker date={end} onDateChange={setEnd} label="End" />
      <Button onPress={handleCreateShowing} disabled={!showId}>
        Create
      </Button>
    </View>
  );
}

function ShowDropdown({
  showId,
  onShowIdChange,
}: {
  showId: number | null;
  onShowIdChange: (show: number) => void;
}) {
  const { data: shows, isLoading } = useShowsListQuery();

  if (isLoading) return null;
  if (!shows?.length) return null;

  return (
    <SelectDropdown
      data={shows}
      onSelect={(show) => onShowIdChange(show.id)}
      defaultButtonText="Select a show"
      buttonTextAfterSelection={(selectedItem) => selectedItem.name}
      rowTextForSelection={(item) => item.name}
    />
  );
}

function ShowingTimePicker({
  date,
  onDateChange,
  label,
}: {
  date: Date;
  onDateChange: (date: Date) => void;
  label: string;
}) {
  const handleChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    onDateChange(currentDate);
  };

  const props = { value: date || new Date(), onChange: handleChange };

  return (
    <View style={styles.time}>
      <Text style={styles.label}>{label}</Text>
      <DateTimePicker mode="date" {...props} />
      <DateTimePicker mode="time" {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    width: "100%",
    padding: 24,
    alignItems: "stretch",
  },
  label: { flex: 1 },
  time: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
