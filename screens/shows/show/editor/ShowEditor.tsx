import React from "react";
import { useShowGetQuery } from "../../../../api/shows";
import {
  ShowScreenProps,
  EditorTabNavigator,
  EditorTabScreen,
} from "../../../../navigation";
import { invariant } from "../../../../exception/invariant";
import SplashScreen from "../../../SplashScreen";
import Details from "./Details";
import ChapterList from "./chapters/ChapterList";
import Chapters from "./chapters/Chapters";

export default function ShowEditor({
  navigation,
  route,
}: ShowScreenProps<"showEditor">) {
  const { showId } = route.params;
  invariant(showId, "`showId` is required");

  const { show, isLoading } = useShowGetQuery(showId);

  if (!show || isLoading) return <SplashScreen />;

  return (
    <EditorTabNavigator initialRouteName="details">
      <EditorTabScreen
        name="details"
        component={Details}
        initialParams={{ show }}
      />
      <EditorTabScreen
        name="chapters"
        component={Chapters}
        initialParams={{ show }}
      />
    </EditorTabNavigator>
  );
}
