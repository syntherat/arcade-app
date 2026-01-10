import { TextInput } from "react-native";

export default function Field(props) {
  return (
    <TextInput
      placeholderTextColor="rgba(255,255,255,0.35)"
      style={{
        color: "white",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
        backgroundColor: "rgba(0,0,0,0.35)",
        padding: 10,
        borderRadius: 14,
      }}
      {...props}
    />
  );
}
