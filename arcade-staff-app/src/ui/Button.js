import { Pressable, Text, ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "./theme";

export default function Button({
  title,
  onPress,
  disabled,
  loading,
  icon,
  variant = "primary", // primary | secondary | ghost | danger | success
  size = "default", // small | default | large
  style,
}) {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isGhost = variant === "ghost";
  const isDanger = variant === "danger";
  const isSuccess = variant === "success";

  const heights = { small: 38, default: 48, large: 56 };
  const fontSize = { small: 13, default: 14, large: 16 }[size];

  let bgColor = theme.accent;
  let textColor = "#0a0a0a";
  let borderColor = theme.accent;

  if (isSecondary) {
    bgColor = theme.cardGlass;
    textColor = theme.text;
    borderColor = theme.borderStrong;
  } else if (isGhost) {
    bgColor = "transparent";
    textColor = theme.text;
    borderColor = theme.border;
  } else if (isDanger) {
    bgColor = theme.error;
    textColor = "#0a0a0a";
    borderColor = theme.error;
  } else if (isSuccess) {
    bgColor = theme.success;
    textColor = "#0a0a0a";
    borderColor = theme.success;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          height: heights[size],
          borderRadius: theme.radiusSmall,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
          paddingHorizontal: 18,
          backgroundColor: bgColor,
          borderWidth: isGhost || isSecondary ? 1 : 0,
          borderColor: borderColor,
          opacity: disabled || loading ? 0.5 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          shadowColor: isPrimary || isDanger || isSuccess ? bgColor : "#000",
          shadowOpacity: isPrimary || isDanger || isSuccess ? 0.3 : 0,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: isPrimary ? 4 : 0,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary || isDanger || isSuccess ? "#0a0a0a" : theme.accent} />
      ) : (
        <>
          {icon ? (
            <View style={{ marginTop: 1 }}>
              <Ionicons name={icon} size={size === "large" ? 20 : 18} color={textColor} />
            </View>
          ) : null}
          <Text
            style={{
              color: textColor,
              fontWeight: "900",
              fontSize: fontSize,
              letterSpacing: 0.3,
            }}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}
