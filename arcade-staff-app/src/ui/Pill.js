import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "./theme";

export default function Pill({ status }) {
  const s = String(status || "").toUpperCase();

  let bg = "rgba(234,179,8,0.14)";
  let bd = "rgba(234,179,8,0.22)";
  let fg = "rgba(254,240,138,0.95)";
  let icon = "alert-circle";

  if (s === "CHECKED_IN") {
    bg = "rgba(34,197,94,0.14)";
    bd = "rgba(34,197,94,0.22)";
    fg = "rgba(187,247,208,0.95)";
    icon = "checkmark-circle";
  } else if (s === "REJECTED") {
    bg = "rgba(239,68,68,0.14)";
    bd = "rgba(239,68,68,0.22)";
    fg = "rgba(254,202,202,0.95)";
    icon = "close-circle";
  }

  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: bd,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      <Ionicons name={icon} size={14} color={fg} />
      <Text style={{ color: fg, fontSize: 12, fontWeight: "900", letterSpacing: 0.2 }}>
        {s}
      </Text>
    </View>
  );
}
