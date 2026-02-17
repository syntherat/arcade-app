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

export default function Gate() {
  const [code, setCode] = useState("");
  const [scanOpen, setScanOpen] = useState(false);
  const [item, setItem] = useState(null);
  const [recent, setRecent] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  async function lookup(codeOverride) {
    const c = String(codeOverride ?? code).trim();
    if (!c) return;
    try {
      const data = await get("/wallets/lookup", { code: c });
      const found = data?.item || null;
      setItem(found);
      setRecent(data?.recent || []);
      setTeamMembers(data?.teamMembers || []);
      if (!found) {
        Alert.alert("Not found", "No wallet found for this code");
      }
    } catch (e) {
      Alert.alert("Lookup failed", e?.response?.data?.error || e?.message);
    }
  }

  async function approve() {
    if (!item?.reg_id) return;
    try {
      await post("/checkin/approve", { reg_id: item.reg_id });
      await lookup(item.wallet_code);
      Alert.alert("✓ Success", "Check-in approved successfully");
    } catch (e) {
      Alert.alert("Approve failed", e?.response?.data?.error || e?.message);
    }
  }

  async function reject() {
    if (!item?.reg_id) return;
    try {
      const reason = "";
      await post("/checkin/reject", { reg_id: item.reg_id, reason });
      await lookup(item.wallet_code);
      Alert.alert("✓ Success", "Entry rejected successfully");
    } catch (e) {
      Alert.alert("Reject failed", e?.response?.data?.error || e?.message);
    }
  }

  function confirmApprove() {
    if (!item?.reg_id) return;
    Alert.alert("Approve check-in", `Approve check-in for ${item.name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Approve", onPress: approve },
    ]);
  }

  function confirmReject() {
    if (!item?.reg_id) return;
    Alert.alert("Reject entry", `Reject entry for ${item.name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Reject", style: "destructive", onPress: reject },
    ]);
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={{ padding: 16, gap: 16 }}
    >
      {/* Header */}
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: theme.radiusSmall,
              backgroundColor: theme.purpleGlow,
              borderWidth: 2,
              borderColor: theme.purple,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="enter-outline" size={22} color={theme.purple} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text, fontSize: 24, fontWeight: "950", letterSpacing: 0.3 }}>
              Gate Check-In
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 14, fontWeight: "600", marginTop: 2 }}>
              Scan or enter wallet code
            </Text>
          </View>
        </View>
      </View>

      {/* Scan Card */}
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
          <Button
            title="Search"
            onPress={() => lookup()}
            icon="search"
            variant="primary"
            size="large"
            style={{ flex: 1 }}
          />
          <Button
            title="Scan QR"
            onPress={() => setScanOpen(true)}
            icon="qr-code-outline"
            variant="secondary"
            size="large"
            style={{ flex: 1 }}
          />
        </View>
      </Card>

      {/* Participant Info */}
      {item ? (
        <>
          <Card style={{ gap: 16 }}>
            {/* Name & Status */}
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.text, fontSize: 22, fontWeight: "950", letterSpacing: 0.2 }}>
                    {item.name}
                  </Text>
                  <Text style={{ color: theme.textMuted, fontSize: 14, fontWeight: "600", marginTop: 4 }}>
                    {item.contact}
                  </Text>
                </View>
                <Pill status={item.checkin_status} />
              </View>

              {/* Divider */}
              <View style={{ height: 1, backgroundColor: theme.border }} />

              {/* Info Grid */}
              <View style={{ gap: 10 }}>
                <InfoRow icon="wallet" label="Wallet Code" value={item.wallet_code} />
                <InfoRow icon="card" label="Reg Number" value={item.reg_no || "—"} />
                <InfoRow 
                  icon="cash" 
                  label="Tokens Balance" 
                  value={`${item.balance ?? 0} tokens`} 
                  color={theme.success} 
                />
                <InfoRow 
                  icon="ticket" 
                  label="Tickets Balance" 
                  value={`${item.reward_points_balance ?? 0} tickets`} 
                  color={theme.success} 
                />
              </View>

              {item.reject_reason ? (
                <View
                  style={{
                    padding: 12,
                    borderRadius: theme.radiusSmall,
                    backgroundColor: theme.errorGlow,
                    borderWidth: 1,
                    borderColor: theme.error,
                  }}
                >
                  <Text style={{ color: theme.error, fontWeight: "800", fontSize: 13 }}>
                    ⚠️ Reject Reason: {item.reject_reason}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Button
                title="Approve"
                onPress={confirmApprove}
                icon="checkmark-circle"
                variant="success"
                size="large"
                style={{ flex: 1 }}
              />
              <Button
                title="Reject"
                onPress={confirmReject}
                icon="close-circle"
                variant="danger"
                size="large"
                style={{ flex: 1 }}
              />
            </View>
          </Card>

          {/* Team Members */}
          {teamMembers.length > 0 && (
            <Card style={{ gap: 14 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="people-outline" size={18} color={theme.purple} />
                <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900", letterSpacing: 0.2 }}>
                  Team Members ({teamMembers.length} {teamMembers.length === 1 ? 'person' : 'people'})
                </Text>
              </View>

              <View
                style={{
                  padding: 10,
                  borderRadius: theme.radiusSmall,
                  backgroundColor: theme.infoGlow,
                  borderWidth: 1,
                  borderColor: theme.info,
                }}
              >
                <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: "700" }}>
                  ℹ️ Each member must scan their own QR code for check-in
                </Text>
              </View>

              <View style={{ gap: 10 }}>
                {teamMembers.map((member, idx) => (
                  <View
                    key={member.member_id || idx}
                    style={{
                      padding: 14,
                      borderRadius: theme.radiusSmall,
                      backgroundColor: "rgba(0,0,0,0.35)",
                      borderWidth: 1,
                      borderColor: theme.borderLight,
                      gap: 8,
                    }}
                  >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                          <View
                            style={{
                              paddingHorizontal: 6,
                              paddingVertical: 2,
                              borderRadius: 4,
                              backgroundColor: member.is_primary ? theme.purpleGlow : theme.accentGlow,
                              borderWidth: 1,
                              borderColor: member.is_primary ? theme.purple : theme.accent,
                            }}
                          >
                            <Text
                              style={{
                                color: member.is_primary ? theme.purple : theme.accent,
                                fontSize: 10,
                                fontWeight: "900",
                              }}
                            >
                              {member.is_primary ? "LEAD" : `#${member.position}`}
                            </Text>
                          </View>
                          <Text style={{ color: theme.text, fontSize: 15, fontWeight: "800" }}>
                            {member.name}
                          </Text>
                        </View>
                        <View style={{ marginTop: 4, gap: 2 }}>
                          <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: "600" }}>
                            {member.contact}
                          </Text>
                          {member.wallet_code && (
                            <Text style={{ color: theme.textSubtle, fontSize: 11, fontWeight: "600" }}>
                              Wallet: {member.wallet_code} · {member.balance ?? 0} tokens · {member.reward_points_balance ?? 0} tickets
                            </Text>
                          )}
                        </View>
                      </View>
                      <Pill status={member.checkin_status} size="small" />
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          )}

          {/* Recent Activity */}
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
                      {t.type === "CREDIT" ? "+" : "-"}{t.amount} {String(t.currency || "TOKENS").toLowerCase()} · Balance: {t.balance_after ?? "—"}
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
            <Ionicons name="scan-outline" size={32} color={theme.textSubtle} />
          </View>
          <Text style={{ color: theme.textMuted, fontSize: 15, fontWeight: "700", textAlign: "center" }}>
            Scan a QR code or enter wallet code to begin check-in
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

function InfoRow({ icon, label, value, color }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          backgroundColor: theme.cardGlass,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={16} color={theme.textMuted} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.textSubtle, fontSize: 12, fontWeight: "700" }}>{label}</Text>
        <Text style={{ color: color || theme.text, fontSize: 15, fontWeight: "800", marginTop: 2 }}>
          {value}
        </Text>
      </View>
    </View>
  );
}
