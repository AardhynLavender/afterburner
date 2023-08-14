import React from "react";
import Show from "./show/Show";
import ShowList from "./List";
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

export default function Shows({ navigation }: RootScreenProps<"shows">) {
  return (
    <ShowStackNavigator initialRouteName="list">
      <ShowStackScreen options={options} name="list" component={ShowList} />
      <ShowStackScreen
        name="show"
        component={Show}
        options={options}
        initialParams={{ showKey: null }}
      />
    </ShowStackNavigator>
  );
}
