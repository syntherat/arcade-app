import { useState } from "react";
import { View, Text, Alert, ScrollView, Pressable, Animated } from "react-native";
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
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ padding: 20, justifyContent: "center", minHeight: "100%" }}
    >
      <View style={{ maxWidth: 460, width: "100%", alignSelf: "center", gap: 24 }}>
        {/* Header with Icon */}
        <View style={{ alignItems: "center", gap: 10, marginBottom: 12 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: theme.radius,
              backgroundColor: theme.accentGlow,
              borderWidth: 2,
              borderColor: theme.accent,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: theme.accent,
              shadowOpacity: 0.5,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: 8 },
            }}
          >
            <Ionicons name="game-controller" size={38} color={theme.accent} />
          </View>

          <View style={{ alignItems: "center", gap: 4 }}>
            <Text
              style={{
                color: theme.text,
                fontSize: 32,
                fontWeight: "900",
                letterSpacing: 0.5,
                textAlign: "center",
              }}
            >
              Insights Staff
            </Text>
            <Text
              style={{
                color: theme.textMuted,
                fontSize: 15,
                fontWeight: "700",
                textAlign: "center",
                letterSpacing: 0.2,
              }}
            >
              Gate & Game Management
            </Text>
          </View>
        </View>

        {/* Login Card */}
        <Card glow style={{ gap: 20 }}>
          <View style={{ gap: 16 }}>
            <Field
              label="Username"
              icon="person-outline"
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
              autoCapitalize="none"
              autoCorrect={false}
              size="large"
            />

            <Field
              label="Password"
              icon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              size="large"
            />
          </View>

          <Button
            title={loading ? "Signing in…" : "Sign In"}
            icon="arrow-forward"
            onPress={onLogin}
            loading={loading}
            disabled={!username || !password}
            size="large"
          />
        </Card>

        {/* Footer */}
        <Text
          style={{
            textAlign: "center",
            color: theme.textSubtle,
            fontSize: 12,
            fontWeight: "700",
            letterSpacing: 0.3,
          }}
        >
          © 2026 VRCADE Staff Portal
        </Text>
      </View>
    </ScrollView>
  );
}
