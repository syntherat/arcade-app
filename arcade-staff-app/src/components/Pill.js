import { View, Text } from "react-native";

export default function Pill({ status }) {
  const s = String(status || "");
  let bg = "rgba(234,179,8,0.18)";
  let bd = "rgba(234,179,8,0.28)";
  let fg = "rgba(254,240,138,0.95)";

  if (s === "CHECKED_IN") {
    bg = "rgba(34,197,94,0.18)";
    bd = "rgba(34,197,94,0.28)";
    fg = "rgba(187,247,208,0.95)";
  } else if (s === "REJECTED") {
    bg = "rgba(239,68,68,0.18)";
    bd = "rgba(239,68,68,0.28)";
    fg = "rgba(254,202,202,0.95)";
  }

  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: bg, borderWidth: 1, borderColor: bd }}>
      <Text style={{ color: fg, fontSize: 12, fontWeight: "800" }}>{s}</Text>
    </View>
  );
}
