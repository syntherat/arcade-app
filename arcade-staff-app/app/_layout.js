import { Stack, router, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Platform } from "react-native";
import { useAuthStore } from "../src/auth/store";
import { theme } from "../src/ui/theme";

export default function RootLayout() {
  const token = useAuthStore((s) => s.token);
  const hydrate = useAuthStore((s) => s.hydrate);
  const segments = useSegments();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Apply custom font family for web
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const style = document.createElement("style");
      style.textContent = `
        * {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "SF Pro Display", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await hydrate();
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;

    const inApp = segments[0] === "(app)";
    const inLogin = segments[0] === "login";

    if (!token && inApp) router.replace("/login");
    else if (token && inLogin) router.replace("/(app)/gate");
  }, [token, ready, segments]);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, alignItems: "center", justifyContent: "center", gap: 12 }}>
        <ActivityIndicator />
        <Text style={{ color: theme.mut, fontWeight: "800" }}>Loading…</Text>
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
