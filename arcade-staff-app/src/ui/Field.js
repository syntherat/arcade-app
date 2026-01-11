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
  ...props
}) {
  return (
    <View style={{ gap: 8 }}>
      {label ? (
        <Text style={{ color: theme.mut, fontSize: 12, fontWeight: "800" }}>
          {label}
        </Text>
      ) : null}

      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 12,
            height: 46,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: error ? "rgba(239,68,68,0.45)" : theme.border,
            backgroundColor: "rgba(255,255,255,0.05)",
          },
          style,
        ]}
      >
        {icon ? (
          <Ionicons name={icon} size={18} color={theme.mut2} />
        ) : null}

        <TextInput
          placeholderTextColor={theme.mut2}
          style={[
            {
              flex: 1,
              color: theme.text,
              fontSize: 14,
              fontWeight: "700",
              letterSpacing: 0.2,
            },
            inputStyle,
          ]}
          {...props}
        />
      </View>

      {error ? (
        <Text style={{ color: "rgba(239,68,68,0.9)", fontSize: 12, fontWeight: "700" }}>
          {error}
        </Text>
      ) : hint ? (
        <Text style={{ color: theme.mut2, fontSize: 12, fontWeight: "700" }}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
