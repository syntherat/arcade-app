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
  const showPrize = role === "PRIZE" || role === "GAME" || role === "STAFF" || !role;

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.bg,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
          shadowColor: "transparent",
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: "900",
          letterSpacing: 0.3,
          fontSize: 18,
        },
        tabBarStyle: {
          backgroundColor: theme.bg,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: 66,
          paddingBottom: 10,
          paddingTop: 10,
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: -4 },
          elevation: 20,
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textSubtle,
        tabBarLabelStyle: {
          fontWeight: "800",
          fontSize: 12,
          letterSpacing: 0.3,
        },
        headerRight: () => (
          <Pressable
            onPress={() => {
              logout();
              router.replace("/login");
            }}
            style={({ pressed }) => ({
              marginRight: 14,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: theme.radiusSmall,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: pressed ? theme.cardHover : theme.cardGlass,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            })}
          >
            <Ionicons name="log-out-outline" size={18} color={theme.accent} />
            <Text style={{ color: theme.accent, fontWeight: "900", fontSize: 13 }}>Logout</Text>
          </Pressable>
        ),
      }}
    >
      {showGate && (
        <Tabs.Screen
          name="gate"
          options={{
            title: "Gate Check-In",
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: focused ? theme.purpleGlow : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name={focused ? "enter" : "enter-outline"} color={color} size={size} />
              </View>
            ),
          }}
        />
      )}

      {showGame && (
        <Tabs.Screen
          name="game"
          options={{
            title: "Game Counter",
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: focused ? theme.accentGlow : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name={focused ? "game-controller" : "game-controller-outline"} color={color} size={size} />
              </View>
            ),
          }}
        />
      )}

      {showPrize && (
        <Tabs.Screen
          name="prize"
          options={{
            title: "Prize Counter",
            tabBarIcon: ({ color, size, focused }) => (
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: focused ? theme.warningGlow : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name={focused ? "gift" : "gift-outline"} color={color} size={size} />
              </View>
            ),
          }}
        />
      )}
    </Tabs>
  );
}
