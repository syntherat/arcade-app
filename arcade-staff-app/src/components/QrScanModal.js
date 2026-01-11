import { useEffect, useState } from "react";
import { Modal, View, Text, Pressable } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../ui/theme";

export default function QrScanModal({ visible, onClose, onScanned }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (visible && !permission?.granted) requestPermission();
  }, [visible]);

  if (!visible) return null;

  const hasPerm = !!permission?.granted;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "black" }}>
        {/* Top Bar */}
        <View
          style={{
            paddingTop: 16,
            paddingHorizontal: 14,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(255,255,255,0.10)",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Ionicons name="qr-code-outline" size={18} color={theme.accent} />
            <Text style={{ color: "white", fontSize: 16, fontWeight: "950", letterSpacing: 0.2 }}>
              Scan Wallet QR
            </Text>
          </View>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => ({
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.14)",
              backgroundColor: pressed ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            })}
          >
            <Ionicons name="close" size={18} color="white" />
            <Text style={{ color: "white", fontWeight: "900" }}>Close</Text>
          </Pressable>
        </View>

        {!hasPerm ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20, gap: 12 }}>
            <Ionicons name="camera-outline" size={28} color="white" />
            <Text style={{ color: "white", textAlign: "center", fontWeight: "800" }}>
              Camera permission needed.
            </Text>

            <Pressable
              onPress={requestPermission}
              style={{
                backgroundColor: theme.accent,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 14,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ionicons name="checkmark" size={18} color="#0a0a0a" />
              <Text style={{ color: "#0a0a0a", fontWeight: "950" }}>Allow Camera</Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <CameraView
              style={{ flex: 1 }}
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={(res) => {
                if (locked) return;

                const raw = String(res?.data || "").trim();
                if (!raw) return;

                setLocked(true);

                let code = raw;
                try {
                  const obj = JSON.parse(raw);
                  if (obj?.wallet_code) code = obj.wallet_code;
                  if (obj?.code) code = obj.code;
                } catch {}

                onScanned(code);
                onClose();

                setTimeout(() => setLocked(false), 800);
              }}
            />

            {/* Overlay */}
            <View pointerEvents="none" style={{ position: "absolute", inset: 0, alignItems: "center", justifyContent: "center" }}>
              <View
                style={{
                  width: 250,
                  height: 250,
                  borderRadius: 24,
                  borderWidth: 2,
                  borderColor: "rgba(249,115,22,0.85)",
                  backgroundColor: "rgba(0,0,0,0.08)",
                }}
              />
              <Text style={{ color: "rgba(255,255,255,0.85)", marginTop: 14, fontWeight: "800" }}>
                Align QR inside the frame
              </Text>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}
