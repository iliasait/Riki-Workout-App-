/**
 * App.js
 * Auteur : Ilias Ait Benaissa
 * Description : Point d'entree de l'application RIKI (React Native / Expo).
 *               Initialise le provider de contexte, l'internationalisation, la navigation
 *               et affiche l'ecran d'onboarding au premier lancement.
 */

import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider, useApp } from "./src/context/AppContext";
import TabNavigator from "./src/navigation/TabNavigator";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import "./src/i18n";

function Main() {
  const { ready, onboarded, C } = useApp();
  if (!ready) return (
    <View style={{ flex: 1, backgroundColor: "#060606", alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" color="#BEFF6C" />
    </View>
  );
  if (!onboarded) return <OnboardingScreen />;
  return (
    <NavigationContainer theme={{ dark: true, colors: { background: C.bg, card: C.navBg, text: C.t, border: C.navBorder, primary: C.gr, notification: C.gr } }}>
      <TabNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Main />
      </AppProvider>
    </SafeAreaProvider>
  );
}
