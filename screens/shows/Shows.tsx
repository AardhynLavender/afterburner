import React from "react";
import Show from "./show/Show";
import ShowList from "./ShowsList";
import {
  RootScreenProps,
  ShowStackNavigator,
  ShowStackScreen,
} from "../../navigation";
import { StackNavigationOptions } from "@react-navigation/stack";

const options: StackNavigationOptions = {
  headerShown: false,
  animationEnabled: false,
};

export default function Shows({}: RootScreenProps<"shows">) {
  return (
    <ShowStackNavigator initialRouteName="showList">
      <ShowStackScreen options={options} name="showList" component={ShowList} />
      <ShowStackScreen
        name="show"
        component={Show}
        options={options}
        initialParams={{ showId: null }}
      />
    </ShowStackNavigator>
  );
}
