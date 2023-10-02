import React from "react";
import { useActiveShow } from "../../../api/activeShow";
import { usePersistent } from "../../../api/persistent";
import SplashScreen from "../../SplashScreen";
import CurrentChapter from "./display/CurrentChapter";
import StartShow from "./StartShow";
import { Text } from "react-native";
import { ShowScreenProps } from "../../../navigation";

export default function ShowDisplay({
  navigation,
  route,
}: ShowScreenProps<"showDisplay">) {
  const { activeShow, error, loading: loadingActiveShow } = useActiveShow();

  // I don't like how many times we have to call getParent() here... not ideal
  const navigateTicketScanner = () =>
    navigation.getParent()?.getParent()?.navigate("scan");

  const navigateEdit = () =>
    navigation.navigate("showEditor", { showId: route.params.showId });

  const [, setCurrentPosition] = usePersistent("current-position", 0);
  const [currentTrack, setCurrentTrack, readingCurrentTrack] =
    usePersistent<number>("current-track", null);

  if (readingCurrentTrack || loadingActiveShow) return <SplashScreen />;
  if (error) return <Text>Error: {JSON.stringify(error)}</Text>;

  // no active show found, render the start show screen
  if (!activeShow || (activeShow && currentTrack === null)) {
    const handleStart = () => setCurrentTrack(0);

    return (
      <StartShow
        onStart={handleStart}
        onScan={navigateTicketScanner}
        onEdit={navigateEdit}
        title={"The Anderson Localization"} // todo: fetch show... get name
        description={"Don't start yet! we'll let you know when to begin"}
      />
    );
  }

  if (!activeShow.chapters.length) return <Text>No chapters found...</Text>;

  const handleNext = () => {
    const nextTrack = (currentTrack ?? 0) + 1;
    if (nextTrack >= activeShow.chapters.length) setCurrentTrack(null);
    else setCurrentTrack(nextTrack);
    setCurrentPosition(0);
  };

  return (
    <CurrentChapter
      chapter={activeShow.chapters[currentTrack ?? 0]}
      onNext={handleNext}
    />
  );
}
