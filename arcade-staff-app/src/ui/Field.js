import { View, TextInput, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "./theme";

export default function Field({
  label,
  icon,
  hint,
  error,
  style,
  inputStyle,
  size = "default", // small | default | large
  ...props
}) {
  const heights = { small: 42, default: 50, large: 56 };
  const fontSize = { small: 13, default: 14, large: 15 }[size];

  return (
    <View style={{ gap: 8 }}>
      {label ? (
        <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: "800", letterSpacing: 0.2 }}>
          {label}
        </Text>
      ) : null}

      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingHorizontal: 14,
            height: heights[size],
            borderRadius: theme.radiusSmall,
            borderWidth: 1,
            borderColor: error ? theme.error : theme.border,
            backgroundColor: theme.cardGlass,
            shadowColor: error ? theme.error : "#000",
            shadowOpacity: error ? 0.15 : 0.05,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          },
          style,
        ]}
      >
        {icon ? <Ionicons name={icon} size={19} color={theme.textSubtle} /> : null}

        <TextInput
          placeholderTextColor={theme.textSubtle}
          style={[
            {
              flex: 1,
              color: theme.text,
              fontSize: fontSize,
              fontWeight: "600",
              letterSpacing: 0.2,
            },
            inputStyle,
          ]}
          {...props}
        />
      </View>

      {error ? (
        <Text style={{ color: theme.error, fontSize: 12, fontWeight: "700", letterSpacing: 0.2 }}>
          {error}
        </Text>
      ) : hint ? (
        <Text style={{ color: theme.textSubtle, fontSize: 12, fontWeight: "600", letterSpacing: 0.2 }}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
