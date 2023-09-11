import { useFonts } from "expo-font";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { ShowScreenProps } from "../../navigation";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Show } from "../../api/types";
import SplashScreen from "../SplashScreen";
import { useShowListQuery } from "../../api/shows";

export default function ShowList({ navigation }: ShowScreenProps<"showList">) {
  const toShow = (showId: string) => () =>
    navigation.navigate("show", { showId });

  const { shows, error, isLoading } = useShowListQuery();

  if (isLoading && !shows) return <SplashScreen />;
  if (error) return <Text>Error loading shows</Text>;
  if (!shows) return <Text>No shows found</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.showList}>
        {shows.map((show) => (
          <ShowCard key={show.id} show={show} onPress={toShow(show.id)} />
        ))}
      </View>
    </View>
  );
}

function ShowCard({
  show,
  onPress: handlePress,
}: {
  show: Show;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.75}>
      <View style={styles.showCard}>
        <Image
          style={styles.showThumb}
          contentFit="cover"
          placeholder={"L85iZ:%78wNo%QtTR$Mw8^R#*0WG"}
        />
        <View style={styles.cardMeta}>
          <Text style={styles.showHeading}>{show.name}</Text>
          <Text>{show.description}</Text>
        </View>
        <View style={styles.alignRight}>
          <TouchableOpacity onPress={() => {}} style={styles.iconButton}>
            <Text style={styles.primary}>Get Tickets</Text>
            <MaterialCommunityIcons
              name="ticket-confirmation"
              size={24}
              style={styles.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 24,
  },
  heading: {
    fontSize: 32,
    fontFamily: "Nimbus sans",
  },
  showList: { gap: 16 },
  showCard: {
    backgroundColor: "#e9e9e9",
    borderRadius: 16 + 16,
    padding: 16,
    gap: 16,
  },
  cardMeta: { padding: 8, gap: 8 },
  alignRight: { flexDirection: "row", justifyContent: "flex-end" },
  showHeading: {
    fontSize: 18,
    fontFamily: "Nimbus sans",
  },
  showThumb: {
    height: 128,
    borderRadius: 16,
  },
  iconButton: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  primary: { color: "#0081f1" },
});
