import React, { useState } from "react";
import { loadAsync } from "expo-font";
import { useEffect } from "react";
import { registerRootComponent } from "expo";
import { SafeAreaProvider } from "react-native-safe-area-view";
import AuthProvider from "./contexts/auth";
import Layout from "./Layout";
import { QueryClientProvider } from "./api/client";
import ErrorBoundary from "./exception/boundary";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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

export default function App() {
  const loading = useLoading();

  if (loading) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <SafeAreaProvider>
          <QueryClientProvider>
            <AuthProvider>
              <Layout />
            </AuthProvider>
          </QueryClientProvider>
        </SafeAreaProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

registerRootComponent(App);
