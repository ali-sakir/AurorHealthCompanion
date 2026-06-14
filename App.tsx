import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./src/services/supabase";
import { Session } from "@supabase/supabase-js";

import AppNavigator from "./src/navigation/AppNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import { Colors } from "./src/constants/theme";

type AppState = "loading" | "auth" | "onboarding" | "app";

export default function App() {
  const [appState, setAppState] = useState<AppState>("loading");
  const [session, setSession] = useState<Session | null>(null);

  const determineState = async (currentSession: Session | null) => {
    if (!currentSession) {
      setAppState("auth");
      return;
    }
    const onboarded = await AsyncStorage.getItem("onboarding_complete");
    setAppState(onboarded === "true" ? "app" : "onboarding");
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      determineState(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      determineState(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (appState === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (appState === "onboarding") {
    return (
      <SafeAreaProvider>
        <OnboardingScreen onComplete={() => setAppState("app")} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {appState === "app" ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
