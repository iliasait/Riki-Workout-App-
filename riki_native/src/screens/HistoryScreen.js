/**
 * HistoryScreen.js
 * Auteur : Ilias Ait Benaissa
 * Description : Ecran de l'historique des seances. Vue liste triee par date et vue
 *               calendrier mensuel avec possibilite d'enregistrer une seance sur un jour
 *               passe ou de programmer une seance future.
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { parseLocal, todayStr, sessionVolume, exerciseVolume } from "../utils/calc";

export default function HistoryScreen() {
  const { C, hist, exos, presets, planned, planSession, unplanSession, saveSession, bw } = useApp();
  const { t } = useTranslation();
  const [vm, setVm] = useState("list");
  const [mo, setMo] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [planDay, setPlanDay] = useState(null);
  const [detail, setDetail] = useState(null);

  const mN = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const dim = new Date(mo.y, mo.m + 1, 0).getDate();
  const fd = (new Date(mo.y, mo.m, 1).getDay() + 6) % 7;
  const ds = (d) => mo.y + "-" + String(mo.m + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
  const has = (d) => hist.some((h) => h.date === ds(d));
  const getH = (d) => hist.find((h) => h.date === ds(d));
  const hasPlan = (d) => planned.some((p) => p.date === ds(d));
  const today = todayStr();
  const isFuture = (d) => ds(d) > today;

  const allHist = (vm === "list" ? hist : hist.filter((h) => { const d = parseLocal(h.date); return d.getFullYear() === mo.y && d.getMonth() === mo.m; })).slice().sort((a, b) => b.date.localeCompare(a.date));

  const fmtD = (d) => parseLocal(d).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const fmtVol = (v) => (v >= 1000 ? (v / 1000).toFixed(1) + "k" : String(v));

  if (detail) {
    const tv = sessionVolume(detail, bw);
    const ts = detail.exos.reduce((a, e) => a + (e.sets ? e.sets.length : 0), 0);
    return (
      <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 18, paddingTop: 50 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
          <TouchableOpacity onPress={() => setDetail(null)}><Text style={{ color: C.gr, fontSize: 13 }}>← {t("common.back")}</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => { setDetail(null); }} style={{ backgroundColor: "rgba(190,255,108,0.1)", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 }}><Text style={{ color: C.gr, fontSize: 12, fontWeight: "600" }}>{t("history.copy")}</Text></TouchableOpacity>
        </View>
        <Text style={{ color: C.t, fontSize: 20, fontWeight: "800", textTransform: "capitalize", marginBottom: 10 }}>{fmtD(detail.date)}</Text>
        <View style={{ flexDirection: "row", gap: 7, marginBottom: 16 }}>
          <Tag C={C} i="⏱️" t2={detail.dur + " " + t("common.min")} />
          <Tag C={C} i="🏋️" t2={ts + " " + t("session.series")} />
          <Tag C={C} i="📊" t2={tv.toFixed(0) + " " + t("common.kg")} />
        </View>
        {detail.exos.map((exo, i) => {
          const ev = exerciseVolume(exo, bw);
          const isDur = exo.prType === "duration";
          return (
            <View key={i} style={{ backgroundColor: C.c1, borderRadius: 20, borderWidth: 1, borderColor: C.c2, padding: 12, marginBottom: 7 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={{ color: C.t, fontWeight: "600", fontSize: 14 }}>{exo.n}</Text>
                {!isDur && ev > 0 && <Text style={{ color: C.gr, fontSize: 12, fontWeight: "700" }}>{ev.toFixed(0)} kg</Text>}
              </View>
              {(exo.sets || []).map((st, j) => {
                const isBw = !isDur && st.p <= 0;
                const label = isDur ? st.r + "s" : isBw ? st.r + " " + t("common.reps") : st.p + "kg × " + st.r;
                const val = isDur || isBw ? "" : (st.p * st.r).toFixed(0);
                return (
                  <View key={j} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 }}>
                    <Text style={{ color: C.ts, width: 22, fontWeight: "600" }}>{j + 1}.</Text>
                    <Text style={{ flex: 1, color: C.t, fontSize: 13 }}>{label}</Text>
                    <Text style={{ color: C.ts }}>{val}</Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 16, paddingTop: 50 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <Text style={{ color: C.t, fontSize: 26, fontWeight: "800" }}>{t("history.title")}</Text>
        <View style={{ flexDirection: "row", backgroundColor: C.c1, borderRadius: 10, borderWidth: 1, borderColor: C.c2 }}>
          <TouchableOpacity onPress={() => setVm("list")} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: vm === "list" ? "rgba(190,255,108,0.1)" : "transparent", borderRadius: 8 }}>
            <Text style={{ color: vm === "list" ? C.gr : C.ts, fontSize: 11, fontWeight: "600" }}>{t("history.list")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setVm("cal")} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: vm === "cal" ? "rgba(190,255,108,0.1)" : "transparent", borderRadius: 8 }}>
            <Text style={{ color: vm === "cal" ? C.gr : C.ts, fontSize: 11, fontWeight: "600" }}>{t("history.calendar")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {vm === "cal" && (
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <TouchableOpacity onPress={() => setMo((m) => m.m === 0 ? { y: m.y - 1, m: 11 } : { y: m.y, m: m.m - 1 })}><Text style={{ color: C.gr, fontSize: 20, padding: 8 }}>‹</Text></TouchableOpacity>
            <Text style={{ color: C.t, fontWeight: "700", fontSize: 15 }}>{mN[mo.m]} {mo.y}</Text>
            <TouchableOpacity onPress={() => setMo((m) => m.m === 11 ? { y: m.y + 1, m: 0 } : { y: m.y, m: m.m + 1 })}><Text style={{ color: C.gr, fontSize: 20, padding: 8 }}>›</Text></TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => <View key={i} style={{ width: "14.28%", alignItems: "center", paddingVertical: 5 }}><Text style={{ color: C.ts, fontSize: 10, fontWeight: "600" }}>{d}</Text></View>)}
            {Array(fd).fill(null).map((_, i) => <View key={"b" + i} style={{ width: "14.28%" }} />)}
            {Array.from({ length: dim }, (_, i) => i + 1).map((d) => {
              const h = has(d); const td = today === ds(d); const pl = hasPlan(d); const fut = isFuture(d); const past = !fut && !td && !h;
              return (
                <TouchableOpacity key={d} onPress={() => { if (h) setDetail(getH(d)); else setPlanDay(planDay === d ? null : d); }} style={{ width: "14.28%", alignItems: "center", paddingVertical: 9, borderRadius: 10, borderWidth: planDay === d ? 1 : td ? 1 : 0, borderColor: planDay === d ? C.gr : td ? "rgba(190,255,108,0.2)" : "transparent", backgroundColor: h ? "rgba(190,255,108,0.08)" : "transparent" }}>
                  <Text style={{ color: h ? C.gr : td ? C.t : C.ts, fontSize: 13, fontWeight: h ? "700" : "400" }}>{d}</Text>
                  {h && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: C.gr, marginTop: 3 }} />}
                </TouchableOpacity>
              );
            })}
          </View>
          {planDay && (
            <View style={{ backgroundColor: C.c1, borderRadius: 20, borderWidth: 1, borderColor: C.c2, padding: 14, marginTop: 12 }}>
              <Text style={{ color: C.t, fontWeight: "600", fontSize: 13, marginBottom: 10 }}>
                {(isFuture(planDay) || today === ds(planDay)) ? t("history.program") : t("history.record")} {t("common.all").toLowerCase() !== "all" ? "le" : ""} {planDay}/{mo.m + 1}
              </Text>
              <View style={{ flexDirection: "row", gap: 7, flexWrap: "wrap" }}>
                {(isFuture(planDay) || today === ds(planDay)) ? (
                  <>
                    {presets.map((p) => (
                      <TouchableOpacity key={p.id} onPress={() => { planSession(ds(planDay), p.id, p.nom); setPlanDay(null); }} style={{ paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12, backgroundColor: C.c2 }}>
                        <Text style={{ color: C.t, fontSize: 12, fontWeight: "600" }}>{p.nom}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={() => { planSession(ds(planDay), null, "Libre"); setPlanDay(null); }} style={{ paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12, borderWidth: 1, borderStyle: "dashed", borderColor: C.gr }}>
                      <Text style={{ color: C.gr, fontSize: 12, fontWeight: "600" }}>{t("history.free_session")}</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {presets.map((p) => (
                      <TouchableOpacity key={p.id} onPress={() => {
                        const res = p.ids.map((id) => { const ex = exos.find((e) => e.id === id); if (!ex) return null; return { n: ex.n, g: ex.g, prType: ex.prType, sets: [] }; }).filter(Boolean);
                        saveSession({ date: ds(planDay), dur: 0, notes: "", exos: res });
                        setPlanDay(null);
                      }} style={{ paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12, backgroundColor: C.c2 }}>
                        <Text style={{ color: C.t, fontSize: 12, fontWeight: "600" }}>{p.nom}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={() => { saveSession({ date: ds(planDay), dur: 0, notes: "", exos: [] }); setPlanDay(null); }} style={{ paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12, borderWidth: 1, borderStyle: "dashed", borderColor: C.gr }}>
                      <Text style={{ color: C.gr, fontSize: 12, fontWeight: "600" }}>{t("history.free_session")}</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Session list */}
      {allHist.map((s) => {
        const vol = sessionVolume(s, bw);
        const ns = s.exos.reduce((a, e) => a + (e.sets ? e.sets.length : 0), 0);
        return (
          <TouchableOpacity key={s.id} onPress={() => setDetail(s)} style={{ backgroundColor: C.glass, borderRadius: 20, borderWidth: 1, borderColor: C.glassBorder, padding: 12, marginBottom: 7, flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 42, height: 42, borderRadius: 13, backgroundColor: "rgba(190,255,108,0.06)", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 18 }}>💪</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.t, fontWeight: "600", fontSize: 13, textTransform: "capitalize" }}>{fmtD(s.date)}</Text>
              <Text style={{ color: C.ts, fontSize: 11, marginTop: 1 }}>{s.dur}{t("common.min")} · {s.exos.length} exo · {ns} {t("session.series")}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ color: C.gr, fontSize: 14, fontWeight: "800" }}>{fmtVol(vol)}</Text>
              <Text style={{ color: C.ts, fontSize: 9 }}>{t("common.kg")}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
      {allHist.length === 0 && <Text style={{ color: C.ts, fontSize: 13, textAlign: "center", paddingVertical: 40 }}>{t("history.empty")}</Text>}
    </ScrollView>
  );
}

function Tag({ C, i, t2 }) {
  return (
    <View style={{ backgroundColor: C.c1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, flexDirection: "row", alignItems: "center", gap: 5, borderWidth: 1, borderColor: C.c2 }}>
      <Text style={{ fontSize: 12 }}>{i}</Text>
      <Text style={{ color: C.t, fontSize: 12, fontWeight: "500" }}>{t2}</Text>
    </View>
  );
}
