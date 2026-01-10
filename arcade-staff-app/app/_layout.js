import { Stack, router, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "../src/auth/store";

export default function RootLayout() {
  const token = useAuthStore((s) => s.token);
  const hydrate = useAuthStore((s) => s.hydrate);
  const segments = useSegments();

  const [ready, setReady] = useState(false);

  // ✅ hydrate ONLY ONCE (important)
  useEffect(() => {
    (async () => {
      try {
        await hydrate();
      } finally {
        setReady(true);
      }
    })();
  }, []); // ✅ DO NOT put [hydrate] here

  // ✅ auth guard redirects (so logout always kicks you out of (app))
  useEffect(() => {
    if (!ready) return;

    const inApp = segments[0] === "(app)";
    const inLogin = segments[0] === "login";

    if (!token && inApp) {
      router.replace("/login");
    } else if (token && inLogin) {
      router.replace("/(app)/gate");
    }
  }, [token, ready, segments]);

  if (!ready) return null;

  // ✅ Let Expo Router render routes normally; we only guard via redirects
  return <Stack screenOptions={{ headerShown: false }} />;
}
