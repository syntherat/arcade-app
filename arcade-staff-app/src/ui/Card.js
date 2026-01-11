import { View } from "react-native";
import { theme } from "./theme";

export default function Card({ children, style }) {
  return (
    <View
      style={[
        {
          borderWidth: 1,
          borderColor: theme.border,
          backgroundColor: theme.card,
          borderRadius: theme.radius,
          padding: 14,
          shadowColor: "#000",
          shadowOpacity: 0.25,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 4,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
