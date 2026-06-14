import { useCallback } from "react";
import * as WebBrowser from "expo-web-browser";
import { Alert } from "react-native";
import { supabase } from "./supabase";

WebBrowser.maybeCompleteAuthSession();

type Provider = "google" | "apple" | "github";

export function useOAuth() {
  const signInWithProvider = useCallback(async (provider: Provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: "pockethealth://auth/callback",
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        Alert.alert("Auth Error", error.message);
        return;
      }

      if (!data.url) {
        Alert.alert("Auth Error", "Could not get the authentication URL.");
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        "pockethealth://auth/callback"
      );

      if (result.type === "success" && result.url) {
        const url = new URL(result.url);

        // Extract tokens from the URL fragment
        const params = new URLSearchParams(url.hash.replace("#", ""));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            Alert.alert("Session Error", sessionError.message);
          }
          // App.tsx onAuthStateChange will navigate to AppNavigator automatically
        }
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong.");
    }
  }, []);

  return { signInWithProvider };
}
