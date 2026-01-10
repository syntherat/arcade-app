import { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, Alert, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Card from "../../src/components/Card";
import Field from "../../src/components/Field";
import Pill from "../../src/components/Pill";
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
    } catch (e) {
      Alert.alert("Debit failed", e?.response?.data?.error || e?.message);
    }
  }

  async function creditPreset(preset) {
    if (!wallet?.wallet_id) return;
    if (!gameId) return Alert.alert("Select a game first");
    try {
      await post("/txns/credit", {
        wallet_id: wallet.wallet_id,
        game_id: gameId,
        preset_id: preset.id,
        amount: preset.amount,
        reason: preset.label,
        action_id: actionId(),
      });
      await lookup(wallet.wallet_code);
    } catch (e) {
      Alert.alert("Credit failed", e?.response?.data?.error || e?.message);
    }
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
    <ScrollView style={{ flex: 1, backgroundColor: "#0a0a0a" }} contentContainerStyle={{ padding: 12, gap: 12 }}>
      <Card>
        <Text style={{ color: "white", fontWeight: "900" }}>Game Counter</Text>
        <Text style={{ color: "rgba(255,255,255,0.6)", marginTop: 6 }}>
          Select a game (shows name, stores id).
        </Text>

        <View style={{ marginTop: 10, gap: 10 }}>
          {/* ✅ GAME PICKER */}
          <View
            style={{
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.12)",
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            {Platform.OS === "web" ? (
              // ✅ Web: HTML select (best UX)
              <select
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                style={{
                  width: "100%",
                  padding: 12,
                  background: "transparent",
                  color: "white",
                  border: "none",
                  outline: "none",
                  fontWeight: 800,
                }}
              >
                {games.length === 0 ? <option value="">Loading...</option> : null}
                {games.map((g) => (
                  <option key={g.id} value={g.id} style={{ color: "black" }}>
                    {g.name}
                  </option>
                ))}
              </select>
            ) : (
              // ✅ Native: RN Picker
              <Picker
                selectedValue={gameId}
                onValueChange={(v) => setGameId(v)}
                dropdownIconColor="white"
                style={{ color: "white" }}
              >
                {games.length === 0 ? (
                  <Picker.Item label="Loading..." value="" />
                ) : (
                  games.map((g) => <Picker.Item key={g.id} label={g.name} value={g.id} />)
                )}
              </Picker>
            )}
          </View>

          {/* optional: show selected */}
          <Text style={{ color: "rgba(255,255,255,0.6)" }}>
            Selected: {selectedGame?.name || "—"} · Active games: {games.length}
          </Text>
        </View>
      </Card>

      <Card>
        <Text style={{ color: "white", fontWeight: "900" }}>Scan / Lookup Wallet</Text>
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

        {wallet ? (
          <View style={{ marginTop: 14, gap: 6 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ color: "white", fontSize: 16, fontWeight: "900" }}>{wallet.name}</Text>
              <Pill status={wallet.checkin_status} />
            </View>
            <Text style={{ color: "rgba(255,255,255,0.75)" }}>Wallet: {wallet.wallet_code}</Text>
            <Text style={{ color: "rgba(255,255,255,0.75)" }}>Balance: {wallet.balance}</Text>
          </View>
        ) : (
          <Text style={{ marginTop: 10, color: "rgba(255,255,255,0.55)" }}>
            Scan a wallet QR to start.
          </Text>
        )}
      </Card>

      <Card>
        <Text style={{ color: "white", fontWeight: "900" }}>Debit (Play)</Text>
        <Text style={{ color: "rgba(255,255,255,0.6)", marginTop: 6 }}>
          Quick charges from game allowed amounts
        </Text>

        <View style={{ marginTop: 10, flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {debitButtons.map((amt) => (
            <Pressable
              key={amt}
              onPress={() => debit(amt, "PLAY")}
              disabled={!wallet?.wallet_id}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderRadius: 14,
                backgroundColor: wallet?.wallet_id ? "rgba(239,68,68,0.20)" : "rgba(255,255,255,0.08)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.10)",
              }}
            >
              <Text style={{ color: wallet?.wallet_id ? "#fca5a5" : "rgba(255,255,255,0.5)", fontWeight: "900" }}>
                -{amt}
              </Text>
            </Pressable>
          ))}
          {debitButtons.length === 0 ? (
            <Text style={{ color: "rgba(255,255,255,0.55)" }}>No allowed debit amounts for this game.</Text>
          ) : null}
        </View>
      </Card>

      <Card>
        <Text style={{ color: "white", fontWeight: "900" }}>Credit (Rewards)</Text>
        <Text style={{ color: "rgba(255,255,255,0.6)", marginTop: 6 }}>
          Only active presets appear (admin controls presets on web control room)
        </Text>

        <View style={{ marginTop: 10, flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {presets.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => creditPreset(p)}
              disabled={!wallet?.wallet_id}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderRadius: 14,
                backgroundColor: wallet?.wallet_id ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.08)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.10)",
              }}
            >
              <Text style={{ color: wallet?.wallet_id ? "#86efac" : "rgba(255,255,255,0.5)", fontWeight: "900" }}>
                +{p.amount} · {p.label}
              </Text>
            </Pressable>
          ))}
          {presets.length === 0 ? (
            <Text style={{ color: "rgba(255,255,255,0.55)" }}>No active presets for this game.</Text>
          ) : null}
        </View>
      </Card>

      {wallet ? (
        <Card>
          <Text style={{ color: "white", fontWeight: "900" }}>Recent Activity</Text>
          {recent.map((t) => (
            <View key={t.id} style={{ marginTop: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", padding: 10, borderRadius: 14, backgroundColor: "rgba(0,0,0,0.25)" }}>
              <Text style={{ color: "rgba(255,255,255,0.7)" }}>{new Date(t.created_at).toLocaleString()}</Text>
              <Text style={{ color: "white", fontWeight: "800", marginTop: 2 }}>
                {t.type} {t.type === "CREDIT" ? "+" : "-"}{t.amount} · After {t.balance_after ?? "—"}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{t.reason}</Text>
            </View>
          ))}
        </Card>
      ) : null}

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
