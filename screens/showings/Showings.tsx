import React from "react";
import {
  ShowingStackNavigator,
  ShowingStackScreen,
  RootScreenProps,
} from "../../navigation";

import NewShowing from "./NewShowing";
import Showing from "./Showing";
import ShowingList from "./ShowingList";

const options = {
  headerShown: false,
  animationEnabled: false,
};

export default function Showings({}: RootScreenProps<"showings">) {
  return (
    <ShowingStackNavigator initialRouteName="showingList">
      <ShowingStackScreen
        name="showingList"
        component={ShowingList}
        options={options}
      />
      <ShowingStackScreen
        name="showing"
        component={Showing}
        options={{ ...options, headerShown: true }}
      />
      <ShowingStackScreen
        name="newShowing"
        component={NewShowing}
        options={{ ...options, headerShown: true }}
      />
    </ShowingStackNavigator>
  );
}
