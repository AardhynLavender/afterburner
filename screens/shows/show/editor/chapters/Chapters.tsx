import React from "react";
import { invariant } from "../../../../../exception/invariant";
import {
  EditorScreenProps,
  ChapterEditorNavigation,
  ChapterEditorStackNavigator,
  ChapterEditorStackScreen,
} from "../../../../../navigation";
import ChapterEditor from "./ChapterEditor";
import ChapterList from "./ChapterList";
import CreateChapter from "./CreateChapter";

const options = {
  headerShown: false,
  animationEnabled: false,
};

export default function Chapters({ route }: EditorScreenProps<"chapters">) {
  const { show } = route.params;
  invariant(show, "`show` is required");

  return (
    <ChapterEditorStackNavigator initialRouteName="list">
      <ChapterEditorStackScreen
        name="list"
        component={ChapterList}
        initialParams={{ show }}
        options={options}
      />
      <ChapterEditorStackScreen
        name="chapter"
        component={ChapterEditor}
        initialParams={{ show }}
        options={{ ...options, title: "Edit Chapter" }}
      />
      <ChapterEditorStackScreen
        name="create"
        component={CreateChapter}
        initialParams={{ showId: show.id, chapterId: undefined }}
        options={{ ...options, title: "New Chapter" }}
      />
    </ChapterEditorStackNavigator>
  );
}
