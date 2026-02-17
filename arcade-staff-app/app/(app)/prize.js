import { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../src/ui/theme";
import Card from "../../src/ui/Card";
import Field from "../../src/ui/Field";
import Pill from "../../src/ui/Pill";
import Button from "../../src/ui/Button";
import QrScanModal from "../../src/components/QrScanModal";
import { get, post } from "../../src/api/client";

function actionId() {
  return `staff_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function PrizeCounter() {
  const [code, setCode] = useState("");
  const [scanOpen, setScanOpen] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [recent, setRecent] = useState([]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  async function lookup(codeOverride) {
    const c = String(codeOverride ?? code).trim();
    if (!c) return;
    try {
      const data = await get("/wallets/lookup", { code: c });
      setWallet(data?.item || null);
      setRecent(data?.recent || []);
    } catch (e) {
      Alert.alert("Lookup failed", e?.response?.data?.error || e?.message);
    }
  }

  async function redeemTickets() {
    if (!wallet?.wallet_id) return;

    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) {
      Alert.alert("Invalid amount", "Enter a valid ticket amount greater than 0");
      return;
    }

    try {
      await post("/txns/prize-redeem", {
        wallet_id: wallet.wallet_id,
        amount: n,
        reason: "PRIZE_REDEMPTION",
        note: note.trim() || null,
        action_id: actionId(),
      });

      setAmount("");
      setNote("");
      await lookup(wallet.wallet_code);
      Alert.alert("Success", "Tickets debited successfully");
    } catch (e) {
      Alert.alert("Redeem failed", e?.response?.data?.error || e?.message);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: theme.radiusSmall,
              backgroundColor: theme.warningGlow,
              borderWidth: 2,
              borderColor: theme.warning,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="gift-outline" size={22} color={theme.warning} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text, fontSize: 24, fontWeight: "950", letterSpacing: 0.3 }}>
              Prize Counter
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 14, fontWeight: "600", marginTop: 2 }}>
              Redeem prizes by debiting tickets
            </Text>
          </View>
        </View>
      </View>

      <Card glow style={{ gap: 14 }}>
        <Field
          value={code}
          onChangeText={setCode}
          placeholder="Enter wallet code..."
          autoCapitalize="none"
          icon="wallet-outline"
          size="large"
        />

        <View style={{ flexDirection: "row", gap: 12 }}>
          <Button title="Search" onPress={() => lookup()} icon="search" variant="primary" size="large" style={{ flex: 1 }} />
          <Button title="Scan QR" onPress={() => setScanOpen(true)} icon="qr-code-outline" variant="secondary" size="large" style={{ flex: 1 }} />
        </View>
      </Card>

      {wallet ? (
        <>
          <Card style={{ gap: 14 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ color: theme.text, fontSize: 20, fontWeight: "950" }}>{wallet.name}</Text>
              <Pill status={wallet.checkin_status} size="small" />
            </View>

            <View style={{ gap: 8 }}>
              <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: "700" }}>Wallet: {wallet.wallet_code}</Text>
              <Text style={{ color: theme.success, fontSize: 15, fontWeight: "900" }}>
                Tokens: {wallet.balance ?? 0}
              </Text>
              <Text style={{ color: theme.warning, fontSize: 16, fontWeight: "900" }}>
                Tickets: {wallet.reward_points_balance ?? 0}
              </Text>
            </View>
          </Card>

          <Card style={{ gap: 14 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="remove-circle-outline" size={18} color={theme.warning} />
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900", letterSpacing: 0.2 }}>
                Debit Tickets
              </Text>
            </View>

            <Field
              label="Tickets to redeem"
              value={amount}
              onChangeText={setAmount}
              keyboardType="number-pad"
              placeholder="Enter amount"
              icon="ticket-outline"
              size="large"
            />

            <Field
              label="Note (optional)"
              value={note}
              onChangeText={setNote}
              placeholder="Prize name / reason"
              icon="create-outline"
              size="large"
            />

            <Button
              title="Redeem Prize"
              onPress={redeemTickets}
              icon="gift"
              variant="danger"
              size="large"
              disabled={!wallet?.wallet_id}
            />
          </Card>

          {recent.length > 0 && (
            <Card style={{ gap: 14 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="time-outline" size={18} color={theme.textMuted} />
                <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900", letterSpacing: 0.2 }}>
                  Recent Activity
                </Text>
              </View>

              <View style={{ gap: 10 }}>
                {recent.map((t) => (
                  <View
                    key={t.id}
                    style={{
                      padding: 14,
                      borderRadius: theme.radiusSmall,
                      backgroundColor: "rgba(0,0,0,0.35)",
                      borderWidth: 1,
                      borderColor: theme.borderLight,
                      gap: 6,
                    }}
                  >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={{ color: theme.textSubtle, fontSize: 12, fontWeight: "700" }}>
                        {new Date(t.created_at).toLocaleString()}
                      </Text>
                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 8,
                          backgroundColor: t.type === "CREDIT" ? theme.successGlow : theme.errorGlow,
                        }}
                      >
                        <Text
                          style={{
                            color: t.type === "CREDIT" ? theme.success : theme.error,
                            fontSize: 11,
                            fontWeight: "900",
                          }}
                        >
                          {t.type} · {t.currency || "TOKENS"}
                        </Text>
                      </View>
                    </View>
                    <Text style={{ color: theme.text, fontWeight: "800", fontSize: 15 }}>
                      {t.type === "CREDIT" ? "+" : "-"}
                      {t.amount} {String(t.currency || "TOKENS").toLowerCase()} · Balance: {t.balance_after ?? "—"}
                    </Text>
                    <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: "600" }}>{t.reason}</Text>
                  </View>
                ))}
              </View>
            </Card>
          )}
        </>
      ) : (
        <Card style={{ padding: 40, alignItems: "center", gap: 12 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              backgroundColor: theme.cardGlass,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <Ionicons name="gift-outline" size={32} color={theme.textSubtle} />
          </View>
          <Text style={{ color: theme.textMuted, fontSize: 15, fontWeight: "700", textAlign: "center" }}>
            Scan a QR code or enter wallet code to redeem prize tickets
          </Text>
        </Card>
      )}

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
