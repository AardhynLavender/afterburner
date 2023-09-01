import React from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { useShowingListQuery } from "../../api/showings";
import Button from "../../components/ui/Button";
import { ShowingScreenProps } from "../../navigation";
import SplashScreen from "../SplashScreen";

export default function ShowingList({
  navigation,
}: ShowingScreenProps<"showingList">) {
  const handleShowNavigate = (showingId: number) =>
    navigation.navigate("showing", { showingId });
  const handleNavigateNewShow = () => navigation.navigate("newShowing");

  return (
    <View style={styles.container}>
      <Button onPress={handleNavigateNewShow}>New Showing</Button>
      <List onPressShow={handleShowNavigate} />
    </View>
  );
}

function List({
  onPressShow: handleShowNavigate,
}: {
  onPressShow: (id: number) => void;
}) {
  const { data: showings, isLoading } = useShowingListQuery();

  const handleShowingSelect = (showingId: number) => () =>
    handleShowNavigate(showingId);

  if (isLoading) return <SplashScreen />;
  if (!showings) return null;

  return (
    <ScrollView>
      {showings?.map((showing) => {
        const { date, time: startTime } = displayDate(showing.start_timestamp);
        const { time: endTime } = displayDate(showing.stop_timestamp);

        return (
          <TouchableHighlight
            onPress={handleShowingSelect(showing.id)}
            style={{ borderRadius: 32 }}
            key={showing.id}
          >
            <View style={styles.card}>
              <Text style={styles.title}>{showing.show?.name}</Text>
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
    </ScrollView>
  );
}
function displayDate(timestamp: string) {
  const date = new Date(timestamp);
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
