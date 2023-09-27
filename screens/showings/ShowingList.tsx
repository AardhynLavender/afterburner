import React, { useMemo } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { useShowingListQuery } from "../../api/showings";
import Button from "../../components/ui/Button";
import { ShowingScreenProps } from "../../navigation";
import SplashScreen from "../SplashScreen";

const UNTITLED_SHOW_NAME = "Untitled Show";

export default function ShowingList({
  navigation,
}: ShowingScreenProps<"showingList">) {
  const handleShowNavigate = (showingId: string, showId: string) =>
    navigation.navigate("showing", { showingId, showId });
  const handleNavigateNewShow = () => navigation.navigate("newShowing");

  return (
    <View style={styles.container}>
      <Button onPress={handleNavigateNewShow}>New Showing</Button>
      <List onPressShow={handleShowNavigate} />
    </View>
  );
}

function List({
  onPressShow,
}: {
  onPressShow: (showingId: string, showId: string) => void;
}) {
  const { showings, isLoading } = useShowingListQuery();

  const sortedShowings = useMemo(
    () =>
      showings?.sort((a, b) =>
        a.startTimestamp.toMillis() < b.startTimestamp.toMillis() ? 1 : -1
      ),
    [showings]
  );

  if (isLoading) return <SplashScreen />;
  if (!showings) return null;

  return (
    <ScrollView>
      <View style={styles.list}>
        {sortedShowings?.map((showing) => {
          const start = showing.startTimestamp.toDate();
          const end = showing.endTimestamp.toDate();
          const { date, time: startTime } = displayDate(start);
          const { time: endTime } = displayDate(end);

          return (
            <TouchableHighlight
              onPress={() => onPressShow(showing.id, showing.showId)}
              style={{ borderRadius: 32 }}
              key={showing.id}
            >
              <View style={styles.card}>
                <Text style={styles.title}>
                  {showing?.showName ?? UNTITLED_SHOW_NAME}
                </Text>
                <View style={styles.time}>
                  <Text>{date}</Text>
                  <Text>
                    {startTime} to {endTime}
                  </Text>
                </View>
              </View>
            </TouchableHighlight>
          );
        })}
      </View>
    </ScrollView>
  );
}
function displayDate(date: Date) {
  return {
    date: date.toLocaleDateString("en-NZ", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("en-NZ", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }),
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    gap: 16,
  },
  list: {
    flex: 1,
    gap: 16,
  },
  card: {
    backgroundColor: "#efefef",
    padding: 24,
    gap: 16,
    borderRadius: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  time: {
    justifyContent: "space-between",
  },
});
