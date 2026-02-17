import { useEffect, useState } from "react";
import { Modal, View, Text, Pressable } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../ui/theme";
import Button from "../ui/Button";

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
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        {/* Header */}
        <View
          style={{
            paddingTop: 20,
            paddingHorizontal: 18,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: theme.bg,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: theme.accentGlow,
                borderWidth: 2,
                borderColor: theme.accent,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="qr-code" size={18} color={theme.accent} />
            </View>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: "950", letterSpacing: 0.3 }}>
              Scan QR Code
            </Text>
          </View>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => ({
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: theme.radiusSmall,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: pressed ? theme.cardHover : theme.cardGlass,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            })}
          >
            <Ionicons name="close" size={20} color={theme.text} />
            <Text style={{ color: theme.text, fontWeight: "900", fontSize: 14 }}>Close</Text>
          </Pressable>
        </View>

        {!hasPerm ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20, gap: 16 }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: theme.radius,
                backgroundColor: theme.errorGlow,
                borderWidth: 2,
                borderColor: theme.error,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="camera-outline" size={40} color={theme.error} />
            </View>
            <Text style={{ color: theme.text, textAlign: "center", fontWeight: "800", fontSize: 18 }}>
              Camera Permission Required
            </Text>
            <Text style={{ color: theme.textMuted, textAlign: "center", fontWeight: "600", fontSize: 14 }}>
              We need camera access to scan QR codes
            </Text>

            <Button
              title="Allow Camera Access"
              onPress={requestPermission}
              icon="checkmark-circle"
              variant="primary"
              size="large"
            />
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
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                inset: 0,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Dark overlay with cutout effect */}
              <View
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.65)",
                }}
              />

              {/* Scanning Frame Container */}
              <View
                style={{
                  width: 260,
                  height: 260,
                  position: "relative",
                }}
              >
                {/* Corner Brackets */}
                {/* Top-left */}
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 40,
                    height: 40,
                    borderTopWidth: 4,
                    borderLeftWidth: 4,
                    borderColor: theme.accent,
                  }}
                />
                {/* Top-right */}
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 40,
                    height: 40,
                    borderTopWidth: 4,
                    borderRightWidth: 4,
                    borderColor: theme.accent,
                  }}
                />
                {/* Bottom-left */}
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: 40,
                    height: 40,
                    borderBottomWidth: 4,
                    borderLeftWidth: 4,
                    borderColor: theme.accent,
                  }}
                />
                {/* Bottom-right */}
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 40,
                    height: 40,
                    borderBottomWidth: 4,
                    borderRightWidth: 4,
                    borderColor: theme.accent,
                  }}
                />

                {/* Scanning animation line */}
                <View
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    right: 0,
                    height: 2,
                    backgroundColor: theme.accent,
                    opacity: 0.5,
                  }}
                />
              </View>

              {/* Instructions */}
              <View
                style={{
                  position: "absolute",
                  bottom: 100,
                  paddingHorizontal: 24,
                  paddingVertical: 14,
                  backgroundColor: "rgba(0,0,0,0.85)",
                  borderRadius: theme.radiusSmall,
                  borderWidth: 1,
                  borderColor: theme.border,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  maxWidth: "80%",
                }}
              >
                <Ionicons name="qr-code" size={20} color={theme.accent} />
                <Text style={{ color: theme.text, fontWeight: "700", fontSize: 14 }}>
                  Position QR code in frame
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}
