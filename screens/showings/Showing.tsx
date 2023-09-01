import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useShowingGetQuery } from "../../api/showings";
import { ShowingScreenProps } from "../../navigation";
import { invariant } from "../../exception/invariant";
import SplashScreen from "../SplashScreen";
import Ticket from "./Ticket";
import { useTicketListQuery } from "../../api/ticket";

export default function Showing({
  navigation,
  route,
}: ShowingScreenProps<"showing">) {
  const { showingId } = route.params;
  invariant(!!showingId, "`showingId` is required");

  const { data: showing, isLoading } = useShowingGetQuery(showingId);
  const { data: tickets } = useTicketListQuery(showingId);

  if (isLoading) return <SplashScreen />;

  invariant(showing?.show, "show is required");

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.tickets}>
          {tickets?.map((ticket) => (
            <View style={styles.ticket}>
              <Ticket
                showingId={showingId}
                key={ticket.id}
                ticketKey={ticket.key!}
                ticketMeta={ticket.meta}
              />
            </View>
          ))}
        </View>
      </ScrollView>
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
  metadata: { gap: 16 },
  tickets: {
    gap: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
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
