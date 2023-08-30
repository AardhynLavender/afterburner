import { NavigationContainer } from "@react-navigation/native";
import React, { useState } from "react";
import Fi from "react-native-vector-icons/Feather";
import { Home, Memories, Scan, Shows, Settings } from "./screens";
import { RootTabNavigator, RootTabScreen } from "./navigation";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { loadAsync } from "expo-font";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { registerRootComponent } from "expo";
import { SafeAreaProvider } from "react-native-safe-area-view";

const stdProps: BottomTabNavigationOptions = {
  tabBarShowLabel: false,
};

async function load() {
  await loadAsync({
    "Nimbus sans": require("./assets/fonts/NimbusSans-Bold.otf"),
  });
}
function useLoading() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    load().then(() => setLoading(false));
  });

  return loading;
}

const queryClient = new QueryClient();

export default function App() {
  const loading = useLoading();

  if (loading) return null;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
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
                  <Fi name="book-open" size={size} color={color} />
                ),
                ...stdProps,
              }}
            /> */}
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
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
