import { View } from "react-native";
import { theme } from "./theme";

export default function Card({ children, style, gradient = false, glow = false }) {
  const cardStyle = [
    {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: gradient ? "transparent" : theme.cardGlass,
      borderRadius: theme.radius,
      padding: 18,
      shadowColor: glow ? theme.accent : "#000",
      shadowOpacity: glow ? 0.3 : 0.4,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    style,
  ];

  if (gradient) {
    return (
      <View style={cardStyle}>
        <View
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: theme.radius,
            opacity: 0.6,
            backgroundColor: theme.card,
          }}
        />
        <View style={{ position: "relative", zIndex: 1 }}>{children}</View>
      </View>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}
