import { Platform } from "react-native";

export const theme = {
  // Backgrounds
  bg: "#0a0a0a",
  bgGradient: ["#0a0a0a", "#1a1a1a"],
  card: "rgba(255,255,255,0.05)",
  cardGlass: "rgba(255,255,255,0.08)",
  cardHover: "rgba(255,255,255,0.10)",
  
  // Borders
  border: "rgba(255,255,255,0.10)",
  borderLight: "rgba(255,255,255,0.06)",
  borderStrong: "rgba(255,255,255,0.15)",
  
  // Text
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.70)",
  textSubtle: "rgba(255,255,255,0.50)",
  textDisabled: "rgba(255,255,255,0.30)",
  
  // Accents & Colors
  accent: "#ff6b35",
  accentDark: "#e85d2f",
  accentLight: "#ff8f66",
  accentGlow: "rgba(255,107,53,0.25)",
  
  // Status Colors
  success: "#00d9a7",
  successDark: "#00c296",
  successGlow: "rgba(0,217,167,0.20)",
  
  error: "#ff5470",
  errorDark: "#e64960",
  errorGlow: "rgba(255,84,112,0.20)",
  
  warning: "#ffc107",
  warningDark: "#e6ae06",
  warningGlow: "rgba(255,193,7,0.20)",
  
  info: "#4da3ff",
  infoDark: "#3d8fe6",
  infoGlow: "rgba(77,163,255,0.20)",
  
  // Purple accent
  purple: "#a855f7",
  purpleLight: "#c084fc",
  purpleGlow: "rgba(168,85,247,0.20)",
  
  // Design tokens
  radius: 8,
  radiusSmall: 6,
  radiusLarge: 12,
  shadow: "rgba(0,0,0,0.40)",
  glow: "rgba(255,107,53,0.30)",
  
  // Typography
  fontFamily: Platform.select({
    ios: "System",
    android: "Roboto",
    web: "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
  }),
};
