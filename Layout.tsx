import React, { useState } from "react";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { useAuth } from "./contexts/auth";
import { RootTabNavigator, RootTabScreen } from "./navigation";
import { Shows, Scan, Showings, Settings } from "./screens";
import { NavigationContainer } from "@react-navigation/native";
import Fi from "react-native-vector-icons/Feather";

const stdProps: BottomTabNavigationOptions = {
  tabBarShowLabel: false,
};

export default function Layout() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <RootTabNavigator initialRouteName="scan">
        {/* <RootTabScreen
              name="home"
              component={Home}
              options={{
                title: "Home",
                tabBarIcon: ({ color, size }) => (
                  <Fi name="home" size={size} color={color} />
                ),
                ...stdProps,
              }}
            /> */}
        <RootTabScreen
          name="shows"
          component={Shows}
          options={{
            title: "Shows",
            tabBarIcon: ({ color, size }) => (
              <Fi name="info" size={size} color={color} />
            ),
            ...stdProps,
          }}
        />
        <RootTabScreen
          name="scan"
          component={Scan}
          options={{
            title: "Scan Ticket",
            unmountOnBlur: true, // unmount camera when not in view
            tabBarIcon: ({ color, size }) => (
              <Fi name="camera" size={size} color={color} />
            ),
            ...stdProps,
          }}
        />
        {/* <RootTabScreen
              name="memories"
              component={Memories}
              options={{
                title: "Your Memories",
                tabBarIcon: ({ color, size }) => (
                  <Fi name="cloud" size={size} color={color} />
                ),
                ...stdProps,
              }}
            /> */}
        {user && (
          <RootTabScreen
            name="showings"
            component={Showings}
            options={{
              title: "Showings",
              tabBarIcon: ({ color, size }) => (
                <Fi name="book" size={size} color={color} />
              ),
              ...stdProps,
            }}
          />
        )}
        <RootTabScreen
          name="settings"
          component={Settings}
          options={{
            title: "User Settings",
            tabBarIcon: ({ color, size }) => (
              <Fi name="settings" size={size} color={color} />
            ),
            ...stdProps,
          }}
        />
      </RootTabNavigator>
    </NavigationContainer>
  );
}
