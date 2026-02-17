import { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, Alert, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
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

export default function Game() {
  const [games, setGames] = useState([]);
  const [gameId, setGameId] = useState("");
  const [presets, setPresets] = useState([]);
  const [code, setCode] = useState("");
  const [scanOpen, setScanOpen] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [recent, setRecent] = useState([]);

  const selectedGame = useMemo(() => games.find((g) => g.id === gameId) || null, [games, gameId]);

  async function loadGames() {
    try {
      const data = await get("/games");
      const list = data?.items || [];
      setGames(list);

      // ✅ auto-select first game if none selected
      if (!gameId && list[0]?.id) setGameId(list[0].id);
    } catch (e) {
      Alert.alert("Failed to load games", e?.response?.data?.error || e?.message);
    }
  }

  async function loadPresets(gid) {
    if (!gid) return setPresets([]);
    try {
      const data = await get(`/games/${gid}/presets`);
      setPresets(data?.items || []);
    } catch (e) {
      Alert.alert("Failed to load presets", e?.response?.data?.error || e?.message);
      setPresets([]);
    }
  }

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    loadPresets(gameId);
  }, [gameId]);

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

  async function debit(amount, reason = "PLAY") {
    if (!wallet?.wallet_id) return;
    if (!gameId) return Alert.alert("Select a game first");
    try {
      await post("/txns/debit", {
        wallet_id: wallet.wallet_id,
        game_id: gameId,
        amount,
        reason,
        action_id: actionId(),
      });
      await lookup(wallet.wallet_code);
      Alert.alert("✓ Success", `Debited ${amount} tokens`);
    } catch (e) {
      Alert.alert("Debit failed", e?.response?.data?.error || e?.message);
    }
  }

  async function creditPreset(preset) {
    if (!wallet?.wallet_id) return;
    if (!gameId) return Alert.alert("Select a game first");
    try {
      await post("/txns/reward", {
        wallet_id: wallet.wallet_id,
        game_id: gameId,
        preset_id: preset.id,
        amount: preset.amount,
        reason: preset.label,
        action_id: actionId(),
      });
      await lookup(wallet.wallet_code);
      Alert.alert("✓ Success", `Credited ${preset.amount} tickets`);
    } catch (e) {
      Alert.alert("Reward failed", e?.response?.data?.error || e?.message);
    }
  }

  function confirmDebit(amount) {
    if (!wallet?.wallet_id) return;
    Alert.alert("Confirm debit", `Debit ${amount} tokens from ${wallet.name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Debit", style: "destructive", onPress: () => debit(amount, "PLAY") },
    ]);
  }

  function confirmReward(preset) {
    if (!wallet?.wallet_id) return;
    Alert.alert("Confirm reward", `Credit ${preset.amount} tickets to ${wallet.name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Credit", onPress: () => creditPreset(preset) },
    ]);
  }

  const debitButtons = useMemo(() => {
    const arr = Array.isArray(selectedGame?.allowed_debit_amounts) ? selectedGame.allowed_debit_amounts : [];
    const cleaned = arr.map(Number).filter((n) => Number.isFinite(n) && n > 0);
    const def = Number(selectedGame?.default_debit_amount || 0);
    const set = new Set(cleaned);
    if (Number.isFinite(def) && def > 0) set.add(def);
    return Array.from(set).sort((a, b) => a - b);
  }, [selectedGame]);

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
              backgroundColor: theme.accentGlow,
              borderWidth: 2,
              borderColor: theme.accent,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="game-controller" size={22} color={theme.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.text, fontSize: 24, fontWeight: "950", letterSpacing: 0.3 }}>
              Game Counter
            </Text>
            <Text style={{ color: theme.textMuted, fontSize: 14, fontWeight: "600", marginTop: 2 }}>
              Manage wallet transactions
            </Text>
          </View>
        </View>
      </View>

      {/* Game Selection Card */}
      <Card glow style={{ gap: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="list-outline" size={18} color={theme.textMuted} />
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900", letterSpacing: 0.2 }}>
            Select Game
          </Text>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.cardGlass,
            borderRadius: theme.radiusSmall,
            overflow: "hidden",
          }}
        >
          {Platform.OS === "web" ? (
            <select
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              style={{
                width: "100%",
                padding: 14,
                background: "transparent",
                color: theme.text,
                border: "none",
                outline: "none",
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              {games.length === 0 ? <option value="">Loading games...</option> : null}
              {games.map((g) => (
                <option key={g.id} value={g.id} style={{ color: "#1a1a1a", background: "#f5f5f5" }}>
                  {g.name}
                </option>
              ))}
            </select>
          ) : (
            <Picker
              selectedValue={gameId}
              onValueChange={(v) => setGameId(v)}
              dropdownIconColor={theme.textMuted}
              style={{ color: theme.text }}
            >
              {games.length === 0 ? (
                <Picker.Item label="Loading games..." value="" />
              ) : (
                games.map((g) => <Picker.Item key={g.id} label={g.name} value={g.id} />)
              )}
            </Picker>
          )}
        </View>

        {selectedGame && (
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
              Selected: {selectedGame.name} · {games.length} active games
            </Text>
          </View>
        )}
      </Card>

      {/* Wallet Lookup Card */}
      <Card style={{ gap: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="wallet-outline" size={18} color={theme.textMuted} />
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900", letterSpacing: 0.2 }}>
            Wallet Lookup
          </Text>
        </View>

        <Field
          value={code}
          onChangeText={setCode}
          placeholder="Enter wallet code..."
          autoCapitalize="none"
          icon="card-outline"
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

        {wallet ? (
          <View
            style={{
              marginTop: 6,
              padding: 14,
              borderRadius: theme.radiusSmall,
              backgroundColor: theme.successGlow,
              borderWidth: 1,
              borderColor: theme.success,
              gap: 8,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: "950" }}>{wallet.name}</Text>
              <Pill status={wallet.checkin_status} size="small" />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: "700" }}>
                Wallet: {wallet.wallet_code}
              </Text>
              <Text style={{ color: theme.success, fontSize: 16, fontWeight: "950" }}>
                {wallet.balance} tokens · {wallet.reward_points_balance ?? 0} tickets
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={{
              padding: 20,
              alignItems: "center",
              gap: 8,
              backgroundColor: theme.cardGlass,
              borderRadius: theme.radiusSmall,
            }}
          >
            <Ionicons name="scan-circle-outline" size={32} color={theme.textSubtle} />
            <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: "700" }}>
              Scan wallet QR to begin
            </Text>
          </View>
        )}
      </Card>

      {/* Debit Section */}
      <Card style={{ gap: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="remove-circle-outline" size={18} color={theme.error} />
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900", letterSpacing: 0.2 }}>
            Debit (Play)
          </Text>
        </View>
        <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: "600" }}>
          Quick charges from allowed amounts
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {debitButtons.length > 0 ? (
            debitButtons.map((amt) => (
              <Pressable
                key={amt}
                onPress={() => confirmDebit(amt)}
                disabled={!wallet?.wallet_id}
                style={{
                  minWidth: 80,
                  paddingVertical: 14,
                  paddingHorizontal: 18,
                  borderRadius: theme.radiusSmall,
                  backgroundColor: wallet?.wallet_id ? theme.errorGlow : theme.cardGlass,
                  borderWidth: 2,
                  borderColor: wallet?.wallet_id ? theme.error : theme.border,
                  alignItems: "center",
                  opacity: wallet?.wallet_id ? 1 : 0.5,
                }}
              >
                <Text
                  style={{
                    color: wallet?.wallet_id ? theme.error : theme.textSubtle,
                    fontWeight: "900",
                    fontSize: 16,
                  }}
                >
                  -{amt}
                </Text>
              </Pressable>
            ))
          ) : (
            <Text style={{ color: theme.textSubtle, fontSize: 13, fontWeight: "600" }}>
              No debit amounts configured for this game
            </Text>
          )}
        </View>
      </Card>

      {/* Reward Section */}
      <Card style={{ gap: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="add-circle-outline" size={18} color={theme.success} />
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900", letterSpacing: 0.2 }}>
            Reward (Tickets)
          </Text>
        </View>
        <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: "600" }}>
          Active presets that add tickets to wallet
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {presets.length > 0 ? (
            presets.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => confirmReward(p)}
                disabled={!wallet?.wallet_id}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 18,
                  borderRadius: theme.radiusSmall,
                  backgroundColor: wallet?.wallet_id ? theme.successGlow : theme.cardGlass,
                  borderWidth: 2,
                  borderColor: wallet?.wallet_id ? theme.success : theme.border,
                  alignItems: "center",
                  opacity: wallet?.wallet_id ? 1 : 0.5,
                }}
              >
                <Text
                  style={{
                    color: wallet?.wallet_id ? theme.success : theme.textSubtle,
                    fontWeight: "900",
                    fontSize: 15,
                  }}
                >
                      +{p.amount} tickets
                </Text>
                <Text
                  style={{
                    color: wallet?.wallet_id ? theme.textMuted : theme.textSubtle,
                    fontWeight: "700",
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  {p.label}
                </Text>
              </Pressable>
            ))
          ) : (
            <Text style={{ color: theme.textSubtle, fontSize: 13, fontWeight: "600" }}>
              No active presets for this game
            </Text>
          )}
        </View>
      </Card>

      {/* Recent Activity */}
      {wallet && recent.length > 0 && (
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
