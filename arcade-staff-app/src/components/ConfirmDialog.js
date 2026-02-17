import { Modal, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../ui/theme";
import Button from "../ui/Button";

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal visible={!!visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.65)",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <Pressable
          onPress={onCancel}
          style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
        />

        <View
          style={{
            width: "100%",
            maxWidth: 420,
            borderRadius: theme.radiusLarge,
            borderWidth: 1,
            borderColor: theme.borderStrong,
            backgroundColor: theme.bg,
            padding: 16,
            gap: 12,
            shadowColor: "#000",
            shadowOpacity: 0.35,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 8 },
            elevation: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                backgroundColor: destructive ? theme.errorGlow : theme.warningGlow,
                borderWidth: 1,
                borderColor: destructive ? theme.error : theme.warning,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={destructive ? "alert-circle-outline" : "help-circle-outline"}
                size={18}
                color={destructive ? theme.error : theme.warning}
              />
            </View>
            <Text style={{ color: theme.text, fontSize: 17, fontWeight: "900", flex: 1 }}>{title}</Text>
          </View>

          <Text style={{ color: theme.textMuted, fontSize: 14, lineHeight: 20, fontWeight: "600" }}>
            {message}
          </Text>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
            <Button
              title={cancelText}
              onPress={onCancel}
              variant="secondary"
              size="default"
              style={{ flex: 1 }}
            />
            <Button
              title={confirmText}
              onPress={onConfirm}
              variant={destructive ? "danger" : "primary"}
              size="default"
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
