/**
 * OnboardingScreen.js
 * Auteur : Ilias Ait Benaissa
 * Description : Ecran d'accueil affiche au premier lancement. Presentation de l'app
 *               puis choix de l'objectif hebdomadaire et du poids de corps (optionnel).
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";

export default function OnboardingScreen() {
  const { C, finishOnboarding } = useApp();
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [g, setG] = useState(null);
  const [w, setW] = useState("");

  if (step === 0) return (
    <View style={[s.wrap, { backgroundColor: C.bg }]}>
      <View style={[s.logoBox, { borderColor: "rgba(190,255,108,0.12)" }]}>
        <Text style={{ fontSize: 48 }}>💪</Text>
      </View>
      <Text style={[s.title, { color: C.t }]}>RIKI</Text>
      <Text style={[s.sub, { color: C.ts }]}>{t("onboarding.tagline")}</Text>
      <TouchableOpacity onPress={() => setStep(1)} style={[s.btn, { backgroundColor: C.gr }]}>
        <Text style={[s.btnTxt, { color: C.bg }]}>{t("onboarding.lets_go")}</Text>
      </TouchableOpacity>
    </View>
  );

  const levels = { 2: t("onboarding.easy"), 3: t("onboarding.easy"), 4: t("onboarding.solid"), 5: t("onboarding.solid"), 6: t("onboarding.intense"), 7: t("onboarding.intense") };

  return (
    <View style={[s.wrap, { backgroundColor: C.bg }]}>
      <Text style={{ color: C.gr, fontSize: 36, marginBottom: 24 }}>🔥</Text>
      <Text style={[s.title2, { color: C.t }]}>{t("onboarding.goal_title")}</Text>
      <Text style={[s.sub2, { color: C.ts }]}>{t("onboarding.goal_q")}</Text>
      <View style={s.grid}>
        {[2, 3, 4, 5, 6, 7].map((n) => (
          <TouchableOpacity key={n} onPress={() => setG(n)} style={[s.goalBtn, { borderColor: g === n ? C.gr : C.c2, backgroundColor: g === n ? "rgba(190,255,108,0.1)" : C.c1 }]}>
            <Text style={{ color: g === n ? C.gr : C.ts, fontSize: 22, fontWeight: "800" }}>{n}</Text>
            <Text style={{ color: g === n ? C.gr : C.ts, fontSize: 9, marginTop: 3, textTransform: "uppercase" }}>{levels[n]}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={{ color: C.ts, fontSize: 12, marginBottom: 6, textAlign: "center" }}>{t("onboarding.bw_label")}</Text>
      <View style={[s.bwRow, { borderColor: C.c2, backgroundColor: C.c1 }]}>
        <TextInput value={w} onChangeText={setW} keyboardType="decimal-pad" placeholder="ex: 75" placeholderTextColor={C.c3} style={[s.bwInput, { color: C.t }]} />
        <Text style={{ color: C.ts, fontSize: 13 }}>kg</Text>
      </View>
      <Text style={{ color: C.ts, fontSize: 10, opacity: 0.7, textAlign: "center", marginBottom: 28 }}>{t("onboarding.bw_hint")}</Text>
      <TouchableOpacity onPress={() => { if (g) finishOnboarding(g, parseFloat(w) || 0); }} disabled={!g} style={[s.btn, { backgroundColor: g ? C.gr : C.c2 }]}>
        <Text style={[s.btnTxt, { color: g ? C.bg : C.ts }]}>{t("common.start")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 30 },
  logoBox: { width: 100, height: 100, borderRadius: 28, borderWidth: 1, alignItems: "center", justifyContent: "center", marginBottom: 28, backgroundColor: "rgba(190,255,108,0.06)" },
  title: { fontSize: 32, fontWeight: "800", marginBottom: 8 },
  sub: { fontSize: 15, textAlign: "center", lineHeight: 24, marginBottom: 36, maxWidth: 260 },
  btn: { width: "100%", height: 58, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  btnTxt: { fontSize: 17, fontWeight: "800", letterSpacing: 0.5 },
  title2: { fontSize: 26, fontWeight: "800", marginBottom: 6 },
  sub2: { fontSize: 14, marginBottom: 28 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10, width: "100%", marginBottom: 20 },
  goalBtn: { width: "30%", padding: 20, borderRadius: 16, borderWidth: 2, alignItems: "center" },
  bwRow: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, marginBottom: 6, width: 160 },
  bwInput: { flex: 1, fontSize: 16, fontWeight: "600", textAlign: "center", paddingVertical: 12 },
});
