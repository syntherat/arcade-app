import { Tabs } from "expo-router";
import { Pressable, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../src/auth";
import { useRouter } from "expo-router";
import { theme } from "../../src/ui/theme";

export default function AppLayout() {
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const staff = useAuthStore((s) => s.staff);
  const router = useRouter();

  if (!token) return null;

  const role = staff?.role;
  const showGate = role === "GATE" || role === "STAFF" || !role;
  const showGame = role === "GAME" || role === "STAFF" || !role;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.bg },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: "900", letterSpacing: 0.2 },
        tabBarStyle: {
          backgroundColor: theme.bg,
          borderTopColor: theme.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.mut,
        headerRight: () => (
          <Pressable
            onPress={() => {
              logout();
              router.replace("/login");
            }}
            style={({ pressed }) => ({
              marginRight: 10,
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: pressed ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            })}
          >
            <Ionicons name="log-out-outline" size={18} color={theme.accent} />
            <Text style={{ color: theme.accent, fontWeight: "900" }}>Logout</Text>
          </Pressable>
        ),
      }}
    >
      {showGate && (
        <Tabs.Screen
          name="gate"
          options={{
            title: "Gate",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="qr-code-outline" color={color} size={size} />
            ),
          }}
        />
      )}

      {showGame && (
        <Tabs.Screen
          name="game"
          options={{
            title: "Game",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="game-controller-outline" color={color} size={size} />
            ),
          }}
        />
      )}
    </Tabs>
  );
}
