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
import { ShowingScreenProps } from "../../navigation";
import { invariant } from "../../exception/invariant";
import SplashScreen from "../SplashScreen";
import { Ticket, Identity } from "../../api/types";
import { encodeTicket, useTicketListQuery } from "../../api/ticket";
import QRCode from "react-native-qrcode-svg";
import { useShowingGetQuery } from "../../api/showings";
import { useShowGetQuery } from "../../api/shows";
import DevOnly from "../../components/util/DevOnly";

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
  const { showingId, showId } = route.params;
  invariant(showingId, "`showingId` is required");
  invariant(showId, "`showId` is required");

  const { show, isLoading: loadingShow } = useShowGetQuery(showId);
  const { tickets, isLoading: loadingTickets } = useTicketListQuery(showingId);
  if (loadingTickets || loadingShow) return <SplashScreen />;

  return (
    <View style={styles.container}>
      {!tickets?.length ? (
        <NoTickets />
      ) : (
        <CardScrollView>
          {tickets?.map((ticket) => (
            <TicketCard ticket={ticket} key={ticket.id} />
          ))}
        </CardScrollView>
      )}
      <View style={styles.metadata}>
        <Text style={styles.heading}>{show?.name}</Text>
        <Text>{show?.description}</Text>
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

function TicketCard({ ticket }: { ticket: Ticket & Identity }) {
  const code = encodeTicket(ticket);

  return (
    <View style={{ ...styles.ticket, width: CARD_WIDTH }} key={ticket.id}>
      <QRCode
        value={code}
        backgroundColor="transparent"
        size={CARD_WIDTH - CARD_PADDING * 2}
      />
      <DevOnly>
        <Text style={{ flex: 1 }}>Ticket #{ticket.id}</Text>
      </DevOnly>
      <Text>{ticket.claimed ? "Taken" : "Available"}</Text>
    </View>
  );
}

function NoTickets() {
  return (
    <View style={styles.noTicketsHero}>
      <Text>No tickets available</Text>
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
  noTicketsHero: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
