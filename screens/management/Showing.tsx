import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useShowingGetQuery, useShowingListQuery } from "../../api/showings";
import { ShowingScreenProps } from "../../navigation";
import { invariant } from "../../exception/invariant";
import SplashScreen from "../SplashScreen";
import Ticket from "./Ticket";

export default function Showing({
  navigation,
  route,
}: ShowingScreenProps<"showing">) {
  const { showingId } = route.params;
  invariant(!!showingId, "`showingId` is required");

  const { data: showing, isLoading } = useShowingGetQuery(showingId);

  if (isLoading) return <SplashScreen />;

  invariant(showing?.show, "show is required");

  return (
    <View style={styles.container}>
      <View style={styles.ticket}>
        <Ticket showingId={showingId} seatKey="A1" />
      </View>
      <View style={styles.metadata}>
        <Text style={styles.heading}>{showing?.show.name}</Text>
        <Text>{showing?.show.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    gap: 16,
    padding: 24,
  },
  metadata: {
    gap: 16,
    flex: 1,
  },
  ticket: {
    padding: 24,
    backgroundColor: "#efefef",
    borderRadius: 32,
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
