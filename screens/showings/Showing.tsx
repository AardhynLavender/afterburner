import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ScrollViewProps,
} from "react-native";
import { ShowingScreenProps } from "../../navigation";
import { invariant } from "../../exception/invariant";
import SplashScreen from "../SplashScreen";
import { encodeTicket, useTicketListQuery } from "../../api/ticket";
import QRCode from "react-native-qrcode-svg";
import {
  useShowingGetQuery,
  useShowingDeleteMutation,
} from "../../api/showings";
import { useShowGetQuery } from "../../api/shows";
import DevOnly from "../../components/util/DevOnly";
import { IsAndroid } from "../../util/os";
import Button from "../../components/ui/Button";
import type { Ticket, Showing, Identity } from "../../api/types";
import ShowingTimePicker from "./ShowingTimePicker";

// Horizontal scrolling
// @see https://medium.com/nerd-for-tech/react-native-create-a-horizontal-snap-scrollview-e1d01ac3ba09

const WINDOW_WIDTH = Dimensions.get("window").width;

const CLAIMED_TICKET_OPACITY = 0.3;
const UNCLAIMED_TICKET_OPACITY = 1;

const CARD_WIDTH_PERCENT = 0.75;
const CARD_WIDTH = WINDOW_WIDTH * CARD_WIDTH_PERCENT;
const CARD_GAP = 16;
const CARD_PADDING = 48;
const END_CARD_INSET_PERCENT = (1 - CARD_WIDTH_PERCENT) / 2;
const END_CARD_INSET = WINDOW_WIDTH * END_CARD_INSET_PERCENT - CARD_GAP / 2;

export default function Showing({
  navigation,
  route,
}: ShowingScreenProps<"showing">) {
  const { showingId, showId } = route.params;
  invariant(showingId, "`showingId` is required");
  invariant(showId, "`showId` is required");

  const handleBack = () => navigation.goBack();

  const { show, isLoading: loadingShow } = useShowGetQuery(showId);
  const { showing, isLoading: loadingShowing } = useShowingGetQuery(showingId);
  const { tickets, isLoading: loadingTickets } = useTicketListQuery(showingId);
  if (loadingTickets || loadingShowing || loadingShow) return <SplashScreen />;

  return (
    <View style={styles.container}>
      {showing && <Controls showing={showing} back={handleBack} />}
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

function Controls({
  showing,
  back,
}: {
  showing: Showing & Identity;
  back: () => void;
}) {
  const { deleteShowing, isDeleting } = useShowingDeleteMutation();
  const handleDelete = async () => {
    await deleteShowing(showing.id);
    back();
  };

  return (
    <View style={styles.controls}>
      <View style={{ flex: 1 }} />
      <Button disabled={isDeleting} onPress={handleDelete}>
        Delete
      </Button>
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
      snapToAlignment={IsAndroid() ? "start" : "center"}
      showsHorizontalScrollIndicator={false}
      contentInset={{
        // center the end cards on IOS
        left: END_CARD_INSET,
        right: END_CARD_INSET,
      }}
      contentContainerStyle={{
        // center the end cards on Android
        paddingHorizontal: IsAndroid() ? END_CARD_INSET : 0,
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
    <View
      style={{
        ...styles.ticket,
        width: CARD_WIDTH,
        opacity: ticket.claimed
          ? CLAIMED_TICKET_OPACITY
          : UNCLAIMED_TICKET_OPACITY,
      }}
      key={ticket.id}
    >
      <QRCode
        value={code}
        backgroundColor="transparent"
        size={CARD_WIDTH - CARD_PADDING * 2}
      />
      <DevOnly>
        <Text style={{ flex: 1 }}>{ticket.id}</Text>
      </DevOnly>
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
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    gap: 16,
  },
});
