import React from "react";
import Show from "./show/Show";
import ShowList from "./ShowsList";
import {
  RootScreenProps,
  ShowsStackNavigator,
  ShowsStackScreen,
} from "../../navigation";
import { StackNavigationOptions } from "@react-navigation/stack";

const options: StackNavigationOptions = {
  headerShown: false,
  animationEnabled: false,
};

export default function Shows({}: RootScreenProps<"shows">) {
  return (
    <ShowsStackNavigator initialRouteName="showList">
      <ShowsStackScreen
        options={options}
        name="showList"
        component={ShowList}
      />
      <ShowsStackScreen
        name="show"
        component={Show}
        options={options}
        initialParams={{ showId: null }}
      />
    </ShowsStackNavigator>
  );
}
