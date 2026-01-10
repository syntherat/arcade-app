import { create } from "zustand";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const KEY = "STAFF_TOKEN";

const storage = {
  async get(key) {
    if (Platform.OS === "web") {
      return typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    }
    return SecureStore.getItemAsync(key);
  },
  async set(key, value) {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") window.localStorage.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
  async del(key) {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") window.localStorage.removeItem(key);
      return;
    }
    return SecureStore.deleteItemAsync(key);
  },
};

export const useAuthStore = create((set, _get) => ({
  token: null,
  staff: null,

  hydrate: async () => {
    const t = await storage.get(KEY);
    set({ token: t || null, staff: null });
  },

  setSession: ({ token, staff }) => {
    set({ token, staff: staff || null });
    storage.set(KEY, token).catch((e) => console.log("SecureStore set failed:", e));
  },

  logout: () => {
    set({ token: null, staff: null });
    storage.del(KEY).catch((e) => console.log("SecureStore delete failed:", e));
  },
}));

// ✅ debug (must be OUTSIDE create(...) and AFTER it)
globalThis.__AUTH_STORE_ID__ =
  globalThis.__AUTH_STORE_ID__ || Math.random().toString(16).slice(2);

globalThis.__AUTH_STORE_INSTANCE__ =
  (globalThis.__AUTH_STORE_INSTANCE__ || 0) + 1;

console.log("AUTH STORE MODULE LOADED. id =", globalThis.__AUTH_STORE_ID__);
console.log("AUTH STORE INSTANCES =", globalThis.__AUTH_STORE_INSTANCE__);
