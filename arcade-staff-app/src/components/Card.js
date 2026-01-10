import { View } from "react-native";

export default function Card({ children, style }) {
  return (
    <View
      style={[
        {
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.10)",
          backgroundColor: "rgba(255,255,255,0.05)",
          borderRadius: 18,
          padding: 14,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
