import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

export default function NotFound() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0a", padding: 20 }}>
      <Text style={{ color: "white", fontSize: 22, fontWeight: "900" }}>Page not found</Text>
      <Text style={{ color: "rgba(255,255,255,0.6)", marginTop: 8, textAlign: "center" }}>
        This route doesn’t exist.
      </Text>

      <Pressable
        onPress={() => router.replace("/login")}
        style={{ marginTop: 16, backgroundColor: "#f97316", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14 }}
      >
        <Text style={{ color: "black", fontWeight: "900" }}>Go to Login</Text>
      </Pressable>
    </View>
  );
}
