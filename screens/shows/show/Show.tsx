import React from "react";
import { StyleSheet } from "react-native";
import { invariant } from "../../../exception/invariant";
import {
  ShowsScreenProps,
  ShowStackNavigator,
  ShowStackScreen,
} from "../../../navigation";
import ShowDisplay from "./ShowDisplay";
import ShowEditor from "./editor/ShowEditor";

const options = {
  headerShown: false,
  animationEnabled: false,
};

export default function Show({ route }: ShowsScreenProps<"show">) {
  const { showId } = route.params;
  invariant(showId, "`showId` is required");

  return (
    <ShowStackNavigator initialRouteName="showDisplay">
      <ShowStackScreen
        name="showDisplay"
        component={ShowDisplay}
        options={options}
        initialParams={{ showId }}
      />
      <ShowStackScreen
        name="showEditor"
        component={ShowEditor}
        options={{ animationEnabled: false }}
        initialParams={{ showId }}
      />
    </ShowStackNavigator>
  );
}

const styles = StyleSheet.create({});
