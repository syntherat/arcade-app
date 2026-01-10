import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { post } from "../src/api/client";
import { useAuthStore } from "../src/auth";
import { router } from "expo-router";

export default function Login() {
  const setSession = useAuthStore((s) => s.setSession);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    console.log("Login pressed", { username });

    try {
      setLoading(true);

      const data = await post("/auth/login", { username, password });
      console.log("Login response:", data);

      if (!data?.token) {
        Alert.alert("Login failed", "No token returned from server");
        return;
      }

      // ✅ update store
      await setSession({ token: data.token, staff: data.staff });

      // ✅ force navigation away from /login
      // if you want a role-based route later, we can do that too.
      router.replace("/(app)/gate");
    } catch (e) {
      console.log("Login error raw:", e);
      console.log("Login error response:", e?.response?.data);
      Alert.alert("Login failed", e?.response?.data?.error || e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0a0a0a", padding: 20, justifyContent: "center" }}>
      <Text style={{ color: "white", fontSize: 22, fontWeight: "900" }}>Arcade Staff</Text>
      <Text style={{ color: "rgba(255,255,255,0.6)", marginTop: 6 }}>
        Gate + Game Counter App
      </Text>

      <View style={{ marginTop: 16, gap: 10 }}>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          placeholderTextColor="rgba(255,255,255,0.35)"
          autoCapitalize="none"
          style={{
            color: "white",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.12)",
            backgroundColor: "rgba(255,255,255,0.05)",
            padding: 12,
            borderRadius: 14,
          }}
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="rgba(255,255,255,0.35)"
          secureTextEntry
          style={{
            color: "white",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.12)",
            backgroundColor: "rgba(255,255,255,0.05)",
            padding: 12,
            borderRadius: 14,
          }}
        />

        <Pressable
          onPress={onLogin}
          disabled={loading}
          style={{
            backgroundColor: "#f97316",
            padding: 12,
            borderRadius: 14,
            alignItems: "center",
            opacity: loading ? 0.7 : 1,
          }}
        >
          <Text style={{ color: "black", fontWeight: "900" }}>
            {loading ? "Signing in..." : "Login"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
