import { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import Card from "../../src/components/Card";
import Field from "../../src/components/Field";
import Pill from "../../src/components/Pill";
import QrScanModal from "../../src/components/QrScanModal";
import { get, post } from "../../src/api/client";

export default function Gate() {
  const [code, setCode] = useState("");
  const [scanOpen, setScanOpen] = useState(false);
  const [item, setItem] = useState(null);
  const [recent, setRecent] = useState([]);

  async function lookup(codeOverride) {
    const c = String(codeOverride ?? code).trim();
    if (!c) return;
    try {
      const data = await get("/wallets/lookup", { code: c });
      setItem(data?.item || null);
      setRecent(data?.recent || []);
    } catch (e) {
      Alert.alert("Lookup failed", e?.response?.data?.error || e?.message);
    }
  }

  async function approve() {
    if (!item?.reg_id) return;
    try {
      const data = await post("/checkin/approve", { reg_id: item.reg_id });
      // refresh lookup to see wallet+reg status updated
      await lookup(item.wallet_code);
      Alert.alert("Success", "Checked-in approved");
    } catch (e) {
      Alert.alert("Approve failed", e?.response?.data?.error || e?.message);
    }
  }

  async function reject() {
    if (!item?.reg_id) return;
    try {
      // keep reason empty for speed; you can add a modal later
      const reason = "";
      await post("/checkin/reject", { reg_id: item.reg_id, reason });
      await lookup(item.wallet_code);
      Alert.alert("Done", "Rejected");
    } catch (e) {
      Alert.alert("Reject failed", e?.response?.data?.error || e?.message);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#0a0a0a" }} contentContainerStyle={{ padding: 12, gap: 12 }}>
      <Card>
        <Text style={{ color: "white", fontWeight: "900" }}>Gate Check-in</Text>

        <View style={{ marginTop: 10, gap: 10 }}>
          <Field value={code} onChangeText={setCode} placeholder="wallet code" autoCapitalize="none" />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable onPress={() => lookup()} style={{ flex: 1, backgroundColor: "#f97316", padding: 12, borderRadius: 14, alignItems: "center" }}>
              <Text style={{ color: "black", fontWeight: "900" }}>Find</Text>
            </Pressable>
            <Pressable onPress={() => setScanOpen(true)} style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.08)", padding: 12, borderRadius: 14, alignItems: "center" }}>
              <Text style={{ color: "#f97316", fontWeight: "900" }}>Scan</Text>
            </Pressable>
          </View>
        </View>

        {item ? (
          <View style={{ marginTop: 14, gap: 6 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ color: "white", fontSize: 16, fontWeight: "900" }}>{item.name}</Text>
              <Pill status={item.checkin_status} />
            </View>

            <Text style={{ color: "rgba(255,255,255,0.75)" }}>Wallet: {item.wallet_code}</Text>
            <Text style={{ color: "rgba(255,255,255,0.75)" }}>Contact: {item.contact}</Text>
            <Text style={{ color: "rgba(255,255,255,0.75)" }}>Reg No: {item.reg_no || "—"}</Text>
            <Text style={{ color: "rgba(255,255,255,0.75)" }}>Balance: {item.balance}</Text>

            {item.reject_reason ? (
              <Text style={{ color: "#fca5a5", marginTop: 4, fontWeight: "800" }}>
                Reject reason: {item.reject_reason}
              </Text>
            ) : null}

            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <Pressable onPress={approve} style={{ flex: 1, backgroundColor: "#22c55e", padding: 12, borderRadius: 14, alignItems: "center" }}>
                <Text style={{ color: "black", fontWeight: "900" }}>Approve</Text>
              </Pressable>
              <Pressable onPress={reject} style={{ flex: 1, backgroundColor: "#ef4444", padding: 12, borderRadius: 14, alignItems: "center" }}>
                <Text style={{ color: "black", fontWeight: "900" }}>Reject</Text>
              </Pressable>
            </View>

            <Text style={{ color: "rgba(255,255,255,0.55)", marginTop: 12, fontWeight: "800" }}>
              Recent activity
            </Text>
            {recent.map((t) => (
              <View key={t.id} style={{ marginTop: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", padding: 10, borderRadius: 14, backgroundColor: "rgba(0,0,0,0.25)" }}>
                <Text style={{ color: "rgba(255,255,255,0.7)" }}>{new Date(t.created_at).toLocaleString()}</Text>
                <Text style={{ color: "white", fontWeight: "800", marginTop: 2 }}>
                  {t.type} {t.type === "CREDIT" ? "+" : "-"}{t.amount} · After {t.balance_after ?? "—"}
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{t.reason}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ marginTop: 10, color: "rgba(255,255,255,0.55)" }}>
            Scan a wallet QR to check-in.
          </Text>
        )}
      </Card>

      <QrScanModal
        visible={scanOpen}
        onClose={() => setScanOpen(false)}
        onScanned={(c) => {
          setCode(c);
          lookup(c);
        }}
      />
    </ScrollView>
  );
}
