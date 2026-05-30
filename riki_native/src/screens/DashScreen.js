/**
 * DashScreen.js
 * Auteur : Ilias Ait Benaissa
 * Description : Tableau de bord de RIKI. Affiche la serie hebdomadaire, les statistiques
 *               de la semaine (volume, seances, duree, records), les dots des jours, les
 *               seances planifiees, les presets rapides et les boutons de demarrage.
 */

import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { parseLocal, weekStartTs, sessionVolume, computeStreak, todayStr } from "../utils/calc";
import Svg, { Circle as SvgCircle } from "react-native-svg";
import SlotMachine from "../components/SlotMachine";

export default function DashScreen({ navigation }) {
  const { C, theme, updateTheme, exos, hist, presets, delPreset, goal, updateGoal, bw, updateBw, planned, unplanSession, lang, updateLang } = useApp();
  const { t } = useTranslation();
  const [showGoal, setShowGoal] = useState(false);
  const [showSlot, setShowSlot] = useState(false);

  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const weekHist = hist.filter((h) => parseLocal(h.date) >= monday);
  const workoutDays = new Set();
  weekHist.forEach((h) => { const d = parseLocal(h.date); workoutDays.add(d.getDay()); });
  const weekDone = workoutDays.size;
  const weekVol = weekHist.reduce((a, s) => a + sessionVolume(s, bw), 0);
  const weekDur = weekHist.length > 0 ? Math.round(weekHist.reduce((a, s) => a + s.dur, 0) / weekHist.length) : 0;
  const weekPR = exos.filter((e) => e.pr > 0 && weekHist.some((s) => s.exos.some((x) => x.n === e.n && x.sets.some((st) => (e.prType === "weight" ? st.p : st.r) >= e.pr)))).length;
  const streakOk = weekDone >= goal;

  const streak = useMemo(() => computeStreak(hist, goal, now), [hist, goal]);

  const today = todayStr();
  const upcoming = planned.filter((p) => p.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const dayMap = [1, 2, 3, 4, 5, 6, 0];
  const dayLabels = ["L", "M", "M", "J", "V", "S", "D"];

  const fmtVol = (v) => (v >= 1000 ? (v / 1000).toFixed(1) + "k" : String(v));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: 24 }}>
      {/* Header */}
      <View style={{ padding: 16, paddingTop: 50 }}>
        <Text style={{ textAlign: "center", fontSize: 22, fontWeight: "800", color: C.gr, marginBottom: 12 }}>RIKI</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <TouchableOpacity onPress={() => setShowGoal(!showGoal)} style={{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: C.glass, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: C.glassBorder }}>
            <Text style={{ fontSize: 16 }}>🔥</Text>
            <View>
              <Text style={{ color: C.gr, fontSize: 16, fontWeight: "800" }}>{streak}</Text>
              <Text style={{ color: C.ts, fontSize: 8, letterSpacing: 0.5 }}>{t("dash.streak_unit")}</Text>
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity onPress={() => updateLang(lang === "fr" ? "en" : "fr")} style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: C.glassBorder, backgroundColor: C.glass, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: C.gr, fontSize: 12, fontWeight: "700" }}>{lang === "fr" ? "EN" : "FR"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => updateTheme(theme === "dark" ? "light" : "dark")} style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: C.glassBorder, backgroundColor: C.glass, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 16 }}>{theme === "dark" ? "☀️" : "🌙"}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {showGoal && (
          <View style={{ backgroundColor: C.c1, borderRadius: 20, borderWidth: 1, borderColor: C.c2, padding: 14, marginBottom: 14 }}>
            <Text style={{ color: C.t, fontSize: 13, fontWeight: "600", marginBottom: 10 }}>{t("dash.weekly_goal")}</Text>
            <View style={{ flexDirection: "row", gap: 6 }}>
              {[2, 3, 4, 5, 6, 7].map((n) => (
                <TouchableOpacity key={n} onPress={() => updateGoal(n)} style={{ flex: 1, paddingVertical: 11, borderRadius: 12, backgroundColor: goal === n ? C.gr : C.c2, alignItems: "center" }}>
                  <Text style={{ color: goal === n ? C.bg : C.ts, fontWeight: "700", fontSize: 15 }}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ color: C.t, fontSize: 13, fontWeight: "600", marginTop: 14, marginBottom: 8 }}>{t("dash.bodyweight")}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: C.c2, borderRadius: 12, paddingHorizontal: 12 }}>
              <TextInput value={bw > 0 ? String(bw) : ""} onChangeText={(v) => updateBw(parseFloat(v) || 0)} keyboardType="decimal-pad" placeholder="ex: 75" placeholderTextColor={C.c3} style={{ flex: 1, color: C.t, fontSize: 14, fontWeight: "600", textAlign: "center", paddingVertical: 10 }} />
              <Text style={{ color: C.ts, fontSize: 12 }}>kg</Text>
            </View>
            <Text style={{ color: C.ts, fontSize: 10, marginTop: 6, opacity: 0.7 }}>{t("dash.bw_hint")}</Text>
          </View>
        )}
      </View>

      <View style={{ paddingHorizontal: 18 }}>
        {/* Weekly card */}
        <View style={{ backgroundColor: C.glass, borderRadius: 20, borderWidth: 1, borderColor: C.glassBorder, padding: 18, marginBottom: 14 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 14 }}>
            <Text style={{ color: C.t, fontWeight: "700", fontSize: 15 }}>{t("dash.this_week")}</Text>
            {streakOk && <Text style={{ color: C.gr, fontSize: 11, fontWeight: "600", backgroundColor: "rgba(190,255,108,0.1)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>{t("dash.goal_reached")}</Text>}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
            <View style={{ width: 76, height: 76 }}>
              <Svg viewBox="0 0 76 76" style={{ width: 76, height: 76, transform: [{ rotate: "-90deg" }] }}>
                <SvgCircle cx="38" cy="38" r="30" fill="none" stroke={C.c2} strokeWidth="5" />
                <SvgCircle cx="38" cy="38" r="30" fill="none" stroke={C.gr} strokeWidth="5" strokeDasharray={2 * Math.PI * 30} strokeDashoffset={2 * Math.PI * 30 * (1 - Math.min(weekDone / (goal || 1), 1))} strokeLinecap="round" />
              </Svg>
              <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: C.gr, fontSize: 22, fontWeight: "800" }}>{weekDone}</Text>
                <Text style={{ color: C.ts, fontSize: 9 }}>/{goal}</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              {[
                [t("dash.volume"), fmtVol(weekVol) + " kg"],
                [t("dash.sessions"), String(weekDone)],
                [t("dash.avg_duration"), (weekDur || "—") + " " + t("common.min")],
                [t("dash.records"), weekPR + " PR"],
              ].map(([label, val], i) => (
                <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={{ color: C.ts, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</Text>
                  <Text style={{ color: i === 3 ? C.gr : C.t, fontSize: 14, fontWeight: "800" }}>{val}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Week dots */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 18, paddingHorizontal: 2 }}>
          {dayLabels.map((d, i) => {
            const jsDay = dayMap[i];
            const done = workoutDays.has(jsDay);
            const isToday = now.getDay() === jsDay;
            return (
              <View key={i} style={{ alignItems: "center", gap: 5 }}>
                <Text style={{ color: done ? C.gr : C.ts, fontSize: 10, fontWeight: "600" }}>{d}</Text>
                <View style={{ width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: done ? "rgba(190,255,108,0.12)" : "transparent", borderWidth: 2, borderColor: isToday ? C.gr : done ? "rgba(190,255,108,0.3)" : C.c2 }}>
                  {done && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: C.gr }} />}
                  {!done && isToday && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.c3 }} />}
                </View>
              </View>
            );
          })}
        </View>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: C.ts, fontSize: 11, fontWeight: "600", letterSpacing: 0.5, textTransform: "uppercase" }}>{t("dash.planned")}</Text>
            {upcoming.slice(0, 3).map((p) => (
              <View key={p.date} style={{ backgroundColor: C.glass, borderRadius: 20, borderWidth: 1, borderColor: C.glassBorder, padding: 12, marginTop: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Text style={{ fontSize: 14 }}>📅</Text>
                  <View>
                    <Text style={{ color: C.t, fontSize: 13, fontWeight: "600" }}>{p.date}</Text>
                    <Text style={{ color: C.ts, fontSize: 11 }}>{p.preset}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => unplanSession(p.date)}>
                  <Text style={{ color: C.ts, fontSize: 16, padding: 4 }}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Presets */}
        {presets.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: C.ts, fontSize: 11, fontWeight: "600", letterSpacing: 0.5, textTransform: "uppercase" }}>{t("dash.quick_sessions")}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
              {presets.map((p) => (
                <View key={p.id} style={{ marginRight: 10, position: "relative" }}>
                  <TouchableOpacity onPress={() => navigation.navigate("Session", { presetIds: [...p.ids] })} style={{ backgroundColor: C.glass, borderRadius: 16, borderWidth: 1, borderColor: C.glassBorder, padding: 14, minWidth: 120 }}>
                    <Text style={{ color: C.gr, fontSize: 16, marginBottom: 6 }}>⚡</Text>
                    <Text style={{ color: C.t, fontWeight: "700", fontSize: 13 }}>{p.nom}</Text>
                    <Text style={{ color: C.ts, fontSize: 10, marginTop: 3 }}>{p.ids.length} exercices</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => delPreset(p.id)} style={{ position: "absolute", top: 6, right: 6, width: 20, height: 20, borderRadius: 10, backgroundColor: "rgba(255,77,77,0.15)", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: C.rd, fontSize: 10 }}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* CTA */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity onPress={() => navigation.navigate("Session")} style={{ flex: 1, height: 60, borderRadius: 18, backgroundColor: C.gr, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: C.bg, fontWeight: "800", fontSize: 17, letterSpacing: 0.5 }}>{t("common.start")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowSlot(true)} style={{ width: 60, height: 60, borderRadius: 18, borderWidth: 1, borderColor: C.glassBorder, backgroundColor: C.glass, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 24 }}>🎲</Text>
          </TouchableOpacity>
        </View>
      </View>
      {showSlot && <SlotMachine exos={exos} C={C} onClose={() => setShowSlot(false)} onSelect={(ex) => { setShowSlot(false); navigation.navigate("Session", { presetIds: [ex.id] }); }} />}
    </ScrollView>
  );
}
