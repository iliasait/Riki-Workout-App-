/**
 * StatsScreen.js
 * Auteur : Ilias Ait Benaissa
 * Description : Ecran de statistiques. Volume quotidien (barres), repartition par groupe
 *               musculaire (barres horizontales), classement des records personnels et
 *               courbe d'evolution du volume (polyline SVG).
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { GROUPS } from "../data/exercises";
import { parseLocal, sessionVolume, exerciseVolume } from "../utils/calc";
import Svg, { Polyline, Circle as SvgCircle, Path as SvgPath, Defs, LinearGradient, Stop } from "react-native-svg";

export default function StatsScreen() {
  const { C, exos, hist, bw } = useApp();
  const { t } = useTranslation();
  const [prTab, setPrTab] = useState("all");
  const [showAllPR, setShowAllPR] = useState(false);

  const dayLabels = ["L", "M", "M", "J", "V", "S", "D"];
  const dayMap = [1, 2, 3, 4, 5, 6, 0];
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const data = dayMap.map((jsDay) =>
    hist.filter((h) => { const d = parseLocal(h.date); return d >= monday && d.getDay() === jsDay; })
      .reduce((a, s) => a + sessionVolume(s, bw), 0)
  );
  const mx = Math.max(...data, 1);

  const gd = GROUPS.filter((g) => g !== "Cardio").map((g) => {
    const v = hist.reduce((a, s) => a + s.exos.filter((e) => e.g === g).reduce((b, e) => b + exerciseVolume(e, bw), 0), 0);
    return { g, v };
  }).filter((d) => d.v > 0).sort((a, b) => b.v - a.v);
  const mg = gd.length > 0 ? Math.max(...gd.map((d) => d.v)) : 1;
  const totalV = gd.reduce((a, d) => a + d.v, 0);

  const prList = exos.filter((e) => e.pr > 0 && (prTab === "all" || e.g === prTab)).sort((a, b) => b.pr - a.pr);
  const prFmt = (ex) => ex.prType === "duration" ? ex.pr + "s" : ex.prType === "reps" ? ex.pr + " " + t("common.reps") : ex.pr + " " + t("common.kg");

  const recentHist = [...hist].sort((a, b) => a.date.localeCompare(b.date)).slice(-12);
  const evoData = recentHist.map((s) => sessionVolume(s, bw));
  const evoMin = evoData.length > 0 ? Math.min(...evoData) : 0;
  const evoMax = evoData.length > 0 ? Math.max(...evoData) : 1;
  const evoRange = evoMax - evoMin || 1;
  const co = evoData.map((v, i) => ({ x: evoData.length > 1 ? (i / (evoData.length - 1)) * 280 + 10 : 150, y: 100 - ((v - evoMin) / evoRange) * 85 }));
  const hasEvo = evoData.length >= 2;
  const area = hasEvo ? "M" + co[0].x + ",100 " + co.map((c) => "L" + c.x + "," + c.y).join(" ") + " L" + co[co.length - 1].x + ",100 Z" : "";
  const line = hasEvo ? co.map((c) => c.x + "," + c.y).join(" ") : "";

  const fmtVol = (v) => (v >= 1000 ? (v / 1000).toFixed(1) + "k" : String(v));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 16, paddingTop: 50, paddingBottom: 24 }}>
      <Text style={{ color: C.t, fontSize: 26, fontWeight: "800", marginBottom: 16 }}>{t("stats.title")}</Text>

      {/* Stat cards */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {[
          { v: String(hist.length), l: t("stats.sessions") },
          { v: fmtVol(totalV), l: t("stats.volume"), c: C.gr },
          { v: String(Math.round(hist.reduce((a, s) => a + s.dur, 0) / (hist.length || 1))), l: t("stats.avg_min"), sub: t("common.min") },
          { v: String(exos.filter((e) => e.pr > 0).length), l: t("stats.records"), c: C.gr },
        ].map((d, i) => (
          <View key={i} style={{ width: "48%", backgroundColor: C.glass, borderRadius: 20, borderWidth: 1, borderColor: C.glassBorder, padding: 14 }}>
            <Text style={{ color: C.ts, fontSize: 10, fontWeight: "600", letterSpacing: 1, marginBottom: 6 }}>{d.l}</Text>
            <Text style={{ color: d.c || C.t, fontSize: 22, fontWeight: "800" }}>{d.v}{d.sub && <Text style={{ color: C.ts, fontSize: 11, fontWeight: "400" }}> {d.sub}</Text>}</Text>
          </View>
        ))}
      </View>

      {/* Daily volume */}
      <Text style={{ color: C.t, fontSize: 14, fontWeight: "700", marginBottom: 10 }}>{t("stats.daily_volume")}</Text>
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 6, height: 100, backgroundColor: C.glass, borderRadius: 20, borderWidth: 1, borderColor: C.glassBorder, paddingHorizontal: 10, paddingVertical: 14, marginBottom: 16 }}>
        {data.map((v, i) => (
          <View key={i} style={{ flex: 1, alignItems: "center", gap: 3 }}>
            {v > 0 ? <Text style={{ color: C.ts, fontSize: 8 }}>{fmtVol(v)}</Text> : <Text style={{ color: C.c3, fontSize: 8 }}>—</Text>}
            <View style={{ width: "100%", height: v > 0 ? Math.max(5, (v / mx) * 65) : 4, borderRadius: 4, backgroundColor: v > 0 ? C.gr : C.c2, opacity: v > 0 ? 0.5 + (v / mx) * 0.5 : 0.2 }} />
            <Text style={{ color: C.ts, fontSize: 9, fontWeight: "600" }}>{dayLabels[i]}</Text>
          </View>
        ))}
      </View>

      {/* By group */}
      <Text style={{ color: C.t, fontSize: 14, fontWeight: "700", marginBottom: 10 }}>{t("stats.by_group")}</Text>
      <View style={{ backgroundColor: C.c1, borderRadius: 20, borderWidth: 1, borderColor: C.c2, padding: 14, marginBottom: 16 }}>
        {gd.length === 0 && <Text style={{ color: C.ts, fontSize: 12, textAlign: "center", marginVertical: 8 }}>{t("stats.no_data")}</Text>}
        {gd.map((d) => (
          <View key={d.g} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
              <Text style={{ color: C.t, fontSize: 12, fontWeight: "500" }}>{d.g}</Text>
              <Text style={{ color: C.ts, fontSize: 11 }}>{fmtVol(d.v)} · {(d.v / totalV * 100).toFixed(0)}%</Text>
            </View>
            <View style={{ height: 6, backgroundColor: C.c2, borderRadius: 4, overflow: "hidden" }}>
              <View style={{ height: "100%", width: (d.v / mg) * 100 + "%", borderRadius: 4, backgroundColor: C.gr }} />
            </View>
          </View>
        ))}
      </View>

      {/* Records */}
      <Text style={{ color: C.t, fontSize: 14, fontWeight: "700", marginBottom: 10 }}>{t("stats.records")}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10, maxHeight: 36 }}>
        <Chip label={t("common.all")} active={prTab === "all"} onPress={() => setPrTab("all")} C={C} />
        {GROUPS.slice(0, 6).map((g) => <Chip key={g} label={g} active={prTab === g} onPress={() => setPrTab(prTab === g ? "all" : g)} C={C} />)}
      </ScrollView>
      <View style={{ backgroundColor: C.c1, borderRadius: 20, borderWidth: 1, borderColor: C.c2, padding: 12, marginBottom: 16 }}>
        {prList.length === 0 && <Text style={{ color: C.ts, fontSize: 12, textAlign: "center", marginVertical: 10 }}>{t("stats.no_pr")}</Text>}
        {(showAllPR ? prList : prList.slice(0, 5)).map((ex, i) => (
          <View key={ex.id} style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8, borderBottomWidth: i < prList.length - 1 ? 1 : 0, borderBottomColor: C.c2 }}>
            <Text style={{ color: i < 3 ? C.gr : C.ts, fontWeight: "800", fontSize: 14, width: 24, textAlign: "center" }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : (i + 1) + "."}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.t, fontSize: 13, fontWeight: "500" }}>{ex.n}</Text>
              <Text style={{ color: C.ts, fontSize: 10, marginTop: 1 }}>{ex.g}</Text>
            </View>
            <Text style={{ color: C.gr, fontSize: 15, fontWeight: "800" }}>{prFmt(ex)}</Text>
          </View>
        ))}
        {!showAllPR && prList.length > 5 && (
          <TouchableOpacity onPress={() => setShowAllPR(true)} style={{ padding: 10, borderRadius: 10, borderWidth: 1, borderColor: C.gr, alignItems: "center", marginTop: 8 }}>
            <Text style={{ color: C.gr, fontSize: 12, fontWeight: "600" }}>{t("stats.see_more")} ({prList.length - 5} PR)</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Evolution curve */}
      <Text style={{ color: C.t, fontSize: 14, fontWeight: "700", marginBottom: 10 }}>{t("stats.evolution")}</Text>
      <View style={{ backgroundColor: C.glass, borderRadius: 20, borderWidth: 1, borderColor: C.glassBorder, padding: 14 }}>
        {hasEvo ? (
          <Svg viewBox="0 0 300 110" style={{ width: "100%", height: 110 }}>
            <Defs><LinearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><Stop offset="0%" stopColor={C.gr} stopOpacity="0.2" /><Stop offset="100%" stopColor={C.gr} stopOpacity="0" /></LinearGradient></Defs>
            <SvgPath d={area} fill="url(#ag)" />
            <Polyline points={line} fill="none" stroke={C.gr} strokeWidth="2.5" strokeLinejoin="round" />
            {co.map((c, i) => <SvgCircle key={i} cx={c.x} cy={c.y} r="4.5" fill={C.gr} stroke={C.bg} strokeWidth="2.5" />)}
          </Svg>
        ) : (
          <Text style={{ color: C.ts, fontSize: 13, textAlign: "center", paddingVertical: 24 }}>{t("stats.need_two")}</Text>
        )}
      </View>
    </ScrollView>
  );
}

function Chip({ label, active, onPress, C }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: active ? "rgba(190,255,108,0.1)" : C.c1, borderWidth: 1, borderColor: active ? "rgba(190,255,108,0.2)" : "transparent", marginRight: 5 }}>
      <Text style={{ color: active ? C.gr : C.ts, fontSize: 11, fontWeight: active ? "700" : "400" }}>{label}</Text>
    </TouchableOpacity>
  );
}
