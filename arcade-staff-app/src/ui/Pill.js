import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "./theme";

export default function Pill({ status, size = "default" }) {
  const s = String(status || "").toUpperCase();

  const configs = {
    CHECKED_IN: {
      bg: theme.successGlow,
      border: theme.success,
      text: theme.success,
      icon: "checkmark-circle",
    },
    REJECTED: {
      bg: theme.errorGlow,
      border: theme.error,
      text: theme.error,
      icon: "close-circle",
    },
    PENDING: {
      bg: theme.warningGlow,
      border: theme.warning,
      text: theme.warning,
      icon: "time",
    },
  };

  const config = configs[s] || configs.PENDING;
  const isSmall = size === "small";

  return (
    <View
      style={{
        paddingHorizontal: isSmall ? 8 : 12,
        paddingVertical: isSmall ? 5 : 7,
        borderRadius: 999,
        backgroundColor: config.bg,
        borderWidth: 1.5,
        borderColor: config.border,
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        shadowColor: config.border,
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      <Ionicons name={config.icon} size={isSmall ? 12 : 14} color={config.text} />
      <Text
        style={{
          color: config.text,
          fontSize: isSmall ? 11 : 12,
          fontWeight: "900",
          letterSpacing: 0.3,
          textTransform: "uppercase",
        }}
      >
        {s}
      </Text>
    </View>
  );
}
