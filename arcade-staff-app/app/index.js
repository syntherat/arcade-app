import { Redirect } from "expo-router";

export default function Index() {
  // Always start at /login.
  // Your RootLayout guard will immediately send logged-in users to /(app)/gate.
  return <Redirect href="/login" />;
}
