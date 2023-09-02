import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  ScrollViewProps,
} from "react-native";
import { useShowingGetQuery } from "../../api/showings";
import { ShowingScreenProps } from "../../navigation";
import { invariant } from "../../exception/invariant";
import SplashScreen from "../SplashScreen";
import { Ticket } from "../../api/types";
import { encodeTicket, useTicketListQuery } from "../../api/ticket";
import QRCode from "react-native-qrcode-svg";

// Horizontal scrolling
// @see https://medium.com/nerd-for-tech/react-native-create-a-horizontal-snap-scrollview-e1d01ac3ba09

const WINDOW_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH_PERCENT = 0.75;
const CARD_WIDTH = WINDOW_WIDTH * CARD_WIDTH_PERCENT;
const CARD_GAP = 16;
const CARD_PADDING = 48;
const END_CARD_INSET_PERCENT = (1 - CARD_WIDTH_PERCENT) / 2;
const END_CARD_INSET = WINDOW_WIDTH * END_CARD_INSET_PERCENT - CARD_GAP / 2;

export default function Showing({ route }: ShowingScreenProps<"showing">) {
  const { showingId } = route.params;
  invariant(showingId, "`showingId` is required");

  const { data: showing, isLoading } = useShowingGetQuery(showingId);
  const { data: tickets } = useTicketListQuery(showingId);

  if (isLoading) return <SplashScreen />;

  invariant(showing?.show, "show is required");

  return (
    <View style={styles.container}>
      <CardScrollView>
        {tickets?.map((ticket) => (
          <TicketCard ticket={ticket} key={ticket.id} />
        ))}
      </CardScrollView>
      <View style={styles.metadata}>
        <Text style={styles.heading}>{showing?.show.name}</Text>
        <Text>{showing?.show.description}</Text>
      </View>
    </View>
  );
}

function CardScrollView({ children, ...scrollViewProps }: ScrollViewProps) {
  return (
    <ScrollView
      horizontal
      pagingEnabled
      decelerationRate={0}
      snapToInterval={CARD_WIDTH + CARD_GAP}
      snapToAlignment={Platform.OS === "android" ? "start" : "center"}
      showsHorizontalScrollIndicator={false}
      contentInset={{
        // center the end cards on IOS
        left: END_CARD_INSET,
        right: END_CARD_INSET,
      }}
      contentContainerStyle={{
        // center the end cards on Android
        paddingHorizontal: Platform.OS === "android" ? END_CARD_INSET : 0,
      }}
      {...scrollViewProps}
    >
      {children}
    </ScrollView>
  );
}

function TicketCard({ ticket }: { ticket: Ticket }) {
  const code = encodeTicket(ticket);

  return (
    <View style={{ ...styles.ticket, width: CARD_WIDTH }} key={ticket.id}>
      <QRCode
        value={code}
        backgroundColor="transparent"
        size={CARD_WIDTH - CARD_PADDING * 2}
      />
      <Text style={{ flex: 1 }}>Ticket #{ticket.id}</Text>
      <Text>{ticket.claimed ? "Taken" : "Available"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    gap: 32,
    paddingVertical: 24,
  },
  metadata: { gap: 16, paddingHorizontal: 24 },
  ticket: {
    padding: CARD_PADDING,
    backgroundColor: "#efefef",
    borderRadius: 32,
    gap: 16,
    marginHorizontal: CARD_GAP / 2,
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
