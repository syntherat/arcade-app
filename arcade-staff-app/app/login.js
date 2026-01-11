import { useState } from "react";
import { View, Text, Alert } from "react-native";
import { post } from "../src/api/client";
import { useAuthStore } from "../src/auth";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../src/ui/theme";
import Card from "../src/ui/Card";
import Field from "../src/ui/Field";
import Button from "../src/ui/Button";

export default function Login() {
  const setSession = useAuthStore((s) => s.setSession);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    try {
      setLoading(true);

      const data = await post("/auth/login", { username, password });

      if (!data?.token) {
        Alert.alert("Login failed", "No token returned from server");
        return;
      }

      await setSession({ token: data.token, staff: data.staff });
      router.replace("/(app)/gate");
    } catch (e) {
      Alert.alert("Login failed", e?.response?.data?.error || e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, padding: 18, justifyContent: "center" }}>
      <View style={{ gap: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: "rgba(249,115,22,0.16)",
              borderWidth: 1,
              borderColor: "rgba(249,115,22,0.25)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="ticket-outline" size={22} color={theme.accent} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text, fontSize: 22, fontWeight: "950", letterSpacing: 0.2 }}>
              Arcade Staff
            </Text>
            <Text style={{ color: theme.mut, marginTop: 2, fontWeight: "700" }}>
              Gate + Game Counter App
            </Text>
          </View>
        </View>

        <Card style={{ gap: 12 }}>
          <Field
            label="Username"
            icon="person-outline"
            value={username}
            onChangeText={setUsername}
            placeholder="e.g. staff01"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Field
            label="Password"
            icon="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />

          <Button
            title={loading ? "Signing in…" : "Login"}
            icon="arrow-forward"
            onPress={onLogin}
            loading={loading}
            disabled={!username || !password}
          />
        </Card>

        <Text style={{ textAlign: "center", color: theme.mut2, fontSize: 12, fontWeight: "700" }}>
          Tip: use the same Wi-Fi as the server for smooth scanning.
        </Text>
      </View>
    </View>
  );
}
