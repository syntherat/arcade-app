import { useEffect, useState } from "react";
import { Modal, View, Text, Pressable } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function QrScanModal({ visible, onClose, onScanned }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    // Ask permission when modal opens (only then)
    if (visible && !permission?.granted) {
      requestPermission();
    }
  }, [visible]);

  if (!visible) return null;

  const hasPerm = !!permission?.granted;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <View
          style={{
            padding: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "900" }}>
            Scan Wallet QR
          </Text>
          <Pressable onPress={onClose}>
            <Text style={{ color: "#f97316", fontWeight: "900" }}>Close</Text>
          </Pressable>
        </View>

        {!hasPerm ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              gap: 12,
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              Camera permission needed.
            </Text>

            <Pressable
              onPress={requestPermission}
              style={{
                backgroundColor: "#f97316",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 14,
              }}
            >
              <Text style={{ color: "black", fontWeight: "900" }}>
                Allow Camera
              </Text>
            </Pressable>
          </View>
        ) : (
          <CameraView
            style={{ flex: 1 }}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={(res) => {
              if (locked) return;

              const raw = String(res?.data || "").trim();
              if (!raw) return;

              setLocked(true);

              // QR can be JSON or plain string
              let code = raw;
              try {
                const obj = JSON.parse(raw);
                if (obj?.wallet_code) code = obj.wallet_code;
                if (obj?.code) code = obj.code;
              } catch {}

              onScanned(code);
              onClose();

              // prevent double-scans
              setTimeout(() => setLocked(false), 800);
            }}
          />
        )}
      </View>
    </Modal>
  );
}
