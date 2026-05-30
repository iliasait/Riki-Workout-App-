/**
 * TabNavigator.js
 * Auteur : Ilias Ait Benaissa
 * Description : Navigation principale par onglets (React Navigation bottom tabs).
 *               Cinq onglets : Accueil, Exercices, Seance, Historique, Stats.
 */

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon } from "react-native-svg";

import DashScreen from "../screens/DashScreen";
import ExoScreen from "../screens/ExoScreen";
import SessionScreen from "../screens/SessionScreen";
import HistoryScreen from "../screens/HistoryScreen";
import StatsScreen from "../screens/StatsScreen";

const Tab = createBottomTabNavigator();

function TabIcon({ name, color, size }) {
  const p = { fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  if (name === "home") return (<Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" {...p} /><Path d="M9 21V12h6v9" {...p} /></Svg>);
  if (name === "dumbbell") return (<Svg width={size} height={size} viewBox="0 0 24 24"><Rect x="1" y="9" width="3" height="6" rx="1" {...p} /><Rect x="4" y="7" width="3" height="10" rx="1" {...p} /><Rect x="17" y="7" width="3" height="10" rx="1" {...p} /><Rect x="20" y="9" width="3" height="6" rx="1" {...p} /><Line x1="7" y1="12" x2="17" y2="12" {...p} /></Svg>);
  if (name === "bolt") return (<Svg width={size} height={size} viewBox="0 0 24 24"><Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" {...p} /></Svg>);
  if (name === "history") return (<Svg width={size} height={size} viewBox="0 0 24 24"><Circle cx="12" cy="12" r="9" {...p} /><Polyline points="12 7 12 12 15 14" {...p} /><Path d="M3 12h2" {...p} /></Svg>);
  if (name === "stats") return (<Svg width={size} height={size} viewBox="0 0 24 24"><Circle cx="12" cy="12" r="10" {...p} /><Rect x="7" y="14" width="2" height="4" rx="0.5" {...p} strokeWidth={1.5} /><Rect x="11" y="11" width="2" height="7" rx="0.5" {...p} strokeWidth={1.5} /><Rect x="15" y="8" width="2" height="10" rx="0.5" {...p} strokeWidth={1.5} /></Svg>);
  return null;
}

const ICONS = { Dash: "home", Exos: "dumbbell", Session: "bolt", History: "history", Stats: "stats" };

export default function TabNavigator() {
  const { t } = useTranslation();
  const { C } = useApp();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => <TabIcon name={ICONS[route.name]} color={color} size={size} />,
        tabBarActiveTintColor: C.gr,
        tabBarInactiveTintColor: "#555",
        tabBarStyle: { backgroundColor: C.navBg, borderTopColor: C.navBorder, borderTopWidth: 1, height: 84, paddingBottom: 20, paddingTop: 8 },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "400", letterSpacing: 0.3 },
      })}
    >
      <Tab.Screen name="Dash" component={DashScreen} options={{ tabBarLabel: t("tab.home") }} />
      <Tab.Screen name="Exos" component={ExoScreen} options={{ tabBarLabel: t("tab.exos") }} />
      <Tab.Screen name="Session" component={SessionScreen} options={{ tabBarLabel: t("tab.session") }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarLabel: t("tab.history") }} />
      <Tab.Screen name="Stats" component={StatsScreen} options={{ tabBarLabel: t("tab.stats") }} />
    </Tab.Navigator>
  );
}
