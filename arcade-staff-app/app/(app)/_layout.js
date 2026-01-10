import { Tabs } from "expo-router";
import { Pressable, Text } from "react-native";
import { useAuthStore } from "../../src/auth";
import { useRouter } from "expo-router";

export default function AppLayout() {
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const staff = useAuthStore((s) => s.staff);
  const router = useRouter();

  // ✅ DON'T use <Redirect /> here (your RootLayout already redirects)
  if (!token) return null;

  const role = staff?.role;
  const showGate = role === "GATE" || role === "STAFF" || !role;
  const showGame = role === "GAME" || role === "STAFF" || !role;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#0a0a0a" },
        headerTintColor: "white",
        tabBarStyle: { backgroundColor: "#0a0a0a", borderTopColor: "rgba(255,255,255,0.12)" },
        tabBarActiveTintColor: "#f97316",
        tabBarInactiveTintColor: "rgba(255,255,255,0.6)",
        headerRight: () => (
          <Pressable
            onPress={() => {
              logout();
              router.replace("/login"); // optional, RootLayout guard will also handle it
            }}
            style={{ marginRight: 12 }}
          >
            <Text style={{ color: "#f97316", fontWeight: "800" }}>Logout</Text>
          </Pressable>
        ),
      }}
    >
      {showGate && <Tabs.Screen name="gate" options={{ title: "Gate" }} />}
      {showGame && <Tabs.Screen name="game" options={{ title: "Game" }} />}
    </Tabs>
  );
}
