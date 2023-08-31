import React, { useState } from "react";
import { loadAsync } from "expo-font";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { registerRootComponent } from "expo";
import { SafeAreaProvider } from "react-native-safe-area-view";
import AuthProvider from "./contexts/auth";
import Layout from "./Layout";

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
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
