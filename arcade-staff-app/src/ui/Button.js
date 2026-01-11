import { Pressable, Text, ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "./theme";

export default function Button({
  title,
  onPress,
  disabled,
  loading,
  icon,
  variant = "primary", // primary | ghost
  style,
}) {
  const primary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          height: 46,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 10,
          paddingHorizontal: 14,
          backgroundColor: primary ? theme.accent : "transparent",
          borderWidth: primary ? 0 : 1,
          borderColor: primary ? "transparent" : theme.border2,
          opacity: disabled || loading ? 0.65 : pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          {icon ? (
            <View style={{ marginTop: 1 }}>
              <Ionicons
                name={icon}
                size={18}
                color={primary ? "#0a0a0a" : theme.text}
              />
            </View>
          ) : null}
          <Text
            style={{
              color: primary ? "#0a0a0a" : theme.text,
              fontWeight: "900",
              letterSpacing: 0.2,
            }}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}
