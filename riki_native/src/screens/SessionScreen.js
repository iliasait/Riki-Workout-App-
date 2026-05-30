/**
 * SessionScreen.js
 * Auteur : Ilias Ait Benaissa
 * Description : Ecran de seance de RIKI. Gere la configuration (choix des exercices,
 *               repos, mode), le deroulement (saisie des series, timer de repos circulaire,
 *               chronometre isometrique, detection de PR en temps reel), et l'arret/fin
 *               avec sauvegarde du travail effectue.
 */

import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { todayStr } from "../utils/calc";
import Svg, { Circle as SvgCircle } from "react-native-svg";

export default function SessionScreen({ route, navigation }) {
  const { C, exos, setPR, saveSession } = useApp();
  const { t } = useTranslation();
  const presetIds = route?.params?.presetIds;

  const [sOn, setSOn] = useState(!!presetIds);
  const [sIds, setSIds] = useState(presetIds || []);
  const [step, setStep] = useState("setup");
  const [showAdd, setShowAdd] = useState(false);

  // Quand on navigue vers cet ecran avec des params (preset), mettre a jour
  useEffect(() => {
    if (presetIds && presetIds.length > 0) {
      setSIds([...presetIds]);
      setSOn(true);
      setStep("setup");
    }
  }, [presetIds]);
  const [rest, setRest] = useState(90);
  const [mode, setMode] = useState("fixed");
  const [tR, setTR] = useState(10);
  const [tS, setTS] = useState(4);
  const [cE, setCE] = useState(0);
  const [allS, setAllS] = useState({});
  const [wt, setWt] = useState("");
  const [rp, setRp] = useState("");
  const [tmr, setTmr] = useState(0);
  const [tRun, setTRun] = useState(false);
  const [keepWt, setKeepWt] = useState(false);
  const [isoTime, setIsoTime] = useState(0);
  const [isoRun, setIsoRun] = useState(false);
  const tmrRef = useRef(null);
  const isoRef = useRef(null);

  useEffect(() => {
    if (tRun && tmr > 0) {
      tmrRef.current = setTimeout(() => setTmr((t) => t - 1), 1000);
    } else if (tmr === 0 && tRun) {
      setTRun(false);
      setStep("workout");
    }
    return () => clearTimeout(tmrRef.current);
  }, [tmr, tRun]);

  useEffect(() => {
    if (isoRun) {
      isoRef.current = setInterval(() => setIsoTime((t) => t + 1), 1000);
    } else {
      clearInterval(isoRef.current);
    }
    return () => clearInterval(isoRef.current);
  }, [isoRun]);

  const finishSe = () => {
    const res = sIds.map((id) => {
      const ex = exos.find((e) => e.id === id);
      const ss = allS[id] || [];
      if (ss.length === 0) return null;
      const maxW = Math.max(...ss.map((s) => s.w));
      if (maxW > (ex.pr || 0) && ex.prType === "weight") setPR(id, maxW);
      return { n: ex.n, g: ex.g, prType: ex.prType, sets: ss.map((x) => ({ p: x.w, r: x.r })) };
    }).filter(Boolean);
    if (res.length > 0) saveSession({ date: todayStr(), dur: Math.floor(Math.random() * 30) + 35, notes: "", exos: res });
    setSOn(false); setStep("setup"); setSIds([]); setAllS({}); setCE(0);
    navigation.navigate("Dash");
  };

  // Idle screen
  if (!sOn) return (
    <View style={{ flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center", paddingTop: 80 }}>
      <Text style={{ fontSize: 48 }}>💪</Text>
      <Text style={{ color: C.t, marginTop: 14, fontSize: 18, fontWeight: "800" }}>{t("session.ready")}</Text>
      <Text style={{ color: C.ts, fontSize: 13, marginTop: 4 }}>{t("session.from_home")}</Text>
    </View>
  );

  // Setup screen
  if (step === "setup") return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 16, paddingTop: 50 }}>
      <Text style={{ color: C.t, fontSize: 22, fontWeight: "800", marginBottom: 14 }}>{t("session.configure")}</Text>
      <View style={{ backgroundColor: C.c1, borderRadius: 20, borderWidth: 1, borderColor: C.c2, padding: 14, marginBottom: 12 }}>
        <Text style={{ color: C.t, fontWeight: "700", fontSize: 14, marginBottom: 10 }}>{t("session.exercises")} ({sIds.length})</Text>
        {sIds.length === 0 && <Text style={{ color: C.ts, fontSize: 12, textAlign: "center", marginVertical: 10 }}>{t("session.none")}</Text>}
        {sIds.map((id, i) => {
          const ex = exos.find((e) => e.id === id);
          if (!ex) return null;
          return (
            <View key={id} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 7, borderBottomWidth: i < sIds.length - 1 ? 1 : 0, borderBottomColor: C.c2 }}>
              <Text style={{ color: C.t, fontSize: 13, flex: 1 }}>{ex.n}</Text>
              <TouchableOpacity onPress={() => setSIds((p) => p.filter((x) => x !== id))}><Text style={{ color: C.rd, fontSize: 16 }}>×</Text></TouchableOpacity>
            </View>
          );
        })}
        <TouchableOpacity onPress={() => setShowAdd(!showAdd)} style={{ marginTop: 10, paddingVertical: 10, borderRadius: 12, backgroundColor: C.c2, alignItems: "center" }}>
          <Text style={{ color: C.ts, fontSize: 12 }}>{t("session.add_dots")}</Text>
        </TouchableOpacity>
        {showAdd && (
          <ScrollView style={{ maxHeight: 200, marginTop: 8 }}>
            {exos.filter((e) => !sIds.includes(e.id)).map((e) => (
              <TouchableOpacity key={e.id} onPress={() => { setSIds((p) => [...new Set([...p, e.id])]); }} style={{ paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: C.c2 }}>
                <Text style={{ color: C.t, fontSize: 12 }}>{e.n}</Text>
                <Text style={{ color: C.ts, fontSize: 10 }}>{e.g}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
      <View style={{ backgroundColor: C.c1, borderRadius: 20, borderWidth: 1, borderColor: C.c2, padding: 14, marginBottom: 12 }}>
        <Text style={{ color: C.t, fontWeight: "700", fontSize: 14, marginBottom: 10 }}>{t("session.settings")}</Text>
        <Text style={{ color: C.ts, fontSize: 11 }}>{t("session.rest")} : <Text style={{ color: C.gr, fontWeight: "700" }}>{rest}s</Text></Text>
        <View style={{ flexDirection: "row", gap: 6, marginTop: 8, marginBottom: 10 }}>
          {[60, 90, 120, 180].map((v) => (
            <TouchableOpacity key={v} onPress={() => setRest(v)} style={{ flex: 1, padding: 9, borderRadius: 10, backgroundColor: rest === v ? "rgba(190,255,108,0.1)" : C.c2, alignItems: "center" }}>
              <Text style={{ color: rest === v ? C.gr : C.ts, fontSize: 12, fontWeight: "600" }}>{v}s</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: "row", gap: 6, marginBottom: 10 }}>
          <TouchableOpacity onPress={() => setMode("fixed")} style={{ flex: 1, padding: 9, borderRadius: 10, backgroundColor: mode === "fixed" ? "rgba(190,255,108,0.1)" : C.c2, alignItems: "center" }}>
            <Text style={{ color: mode === "fixed" ? C.gr : C.ts, fontSize: 12, fontWeight: "600" }}>{t("session.reps_fixed")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode("failure")} style={{ flex: 1, padding: 9, borderRadius: 10, backgroundColor: mode === "failure" ? "rgba(190,255,108,0.1)" : C.c2, alignItems: "center" }}>
            <Text style={{ color: mode === "failure" ? C.gr : C.ts, fontSize: 12, fontWeight: "600" }}>{t("session.to_failure")}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.ts, fontSize: 10, textTransform: "uppercase" }}>{t("session.series")}</Text>
            <TextInput value={String(tS)} onChangeText={(v) => setTS(parseInt(v) || 1)} keyboardType="number-pad" style={{ padding: 12, borderRadius: 14, borderWidth: 1, borderColor: C.c2, backgroundColor: C.c1, color: C.t, fontSize: 16, fontWeight: "700", textAlign: "center", marginTop: 3 }} />
          </View>
          {mode === "fixed" && (
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.ts, fontSize: 10, textTransform: "uppercase" }}>{t("session.reps")}</Text>
              <TextInput value={String(tR)} onChangeText={(v) => setTR(parseInt(v) || 1)} keyboardType="number-pad" style={{ padding: 12, borderRadius: 14, borderWidth: 1, borderColor: C.c2, backgroundColor: C.c1, color: C.t, fontSize: 16, fontWeight: "700", textAlign: "center", marginTop: 3 }} />
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity onPress={() => { if (sIds.length === 0) return; setCE(0); setAllS({}); setStep("workout"); }} disabled={sIds.length === 0} style={{ height: 56, borderRadius: 18, backgroundColor: sIds.length > 0 ? C.gr : C.c2, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: sIds.length > 0 ? C.bg : C.ts, fontWeight: "800", fontSize: 16 }}>{t("session.start_n")} ({sIds.length} EXO)</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // Rest screen
  if (step === "rest") {
    const pct = tmr > 0 ? tmr / rest : 0;
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: C.ts, fontSize: 13, fontWeight: "500", textTransform: "uppercase", marginBottom: 20 }}>{t("session.rest_time")}</Text>
        <View style={{ width: 190, height: 190, marginBottom: 24 }}>
          <Svg viewBox="0 0 190 190" style={{ width: 190, height: 190, transform: [{ rotate: "-90deg" }] }}>
            <SvgCircle cx="95" cy="95" r="84" fill="none" stroke={C.c2} strokeWidth="6" />
            <SvgCircle cx="95" cy="95" r="84" fill="none" stroke={C.gr} strokeWidth="6" strokeDasharray={2 * Math.PI * 84} strokeDashoffset={2 * Math.PI * 84 * (1 - pct)} strokeLinecap="round" />
          </Svg>
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: C.gr, fontSize: 48, fontWeight: "800" }}>
              {Math.floor(tmr / 60).toString().padStart(2, "0")}:{(tmr % 60).toString().padStart(2, "0")}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => { setTRun(false); setTmr(0); setStep("workout"); }} style={{ paddingHorizontal: 32, paddingVertical: 12, borderRadius: 14, backgroundColor: C.c1, borderWidth: 1, borderColor: C.c2 }}>
          <Text style={{ color: C.gr, fontWeight: "600", fontSize: 14 }}>{t("session.skip")} →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Workout screen
  const cur = exos.find((e) => e.id === sIds[cE]);
  if (!cur) return null;
  const eSets = allS[cur.id] || [];
  const isDuration = cur.prType === "duration";
  const isReps = cur.prType === "reps";

  const logSet = () => {
    if (isDuration) {
      if (isoTime <= 0) return;
      const ns = { ...allS }; if (!ns[cur.id]) ns[cur.id] = []; ns[cur.id].push({ w: 0, r: isoTime }); setAllS(ns);
      setIsoTime(0); setIsoRun(false);
      if (isoTime > (cur.pr || 0)) setPR(cur.id, isoTime);
      if (ns[cur.id].length < tS) { setTmr(rest); setTRun(true); setStep("rest"); }
      return;
    }
    if (isReps) {
      const r = parseInt(rp) || 0; if (r <= 0) return;
      const ns = { ...allS }; if (!ns[cur.id]) ns[cur.id] = []; ns[cur.id].push({ w: 0, r }); setAllS(ns); setRp("");
      if (r > (cur.pr || 0)) setPR(cur.id, r);
      if (ns[cur.id].length < tS) { setTmr(rest); setTRun(true); setStep("rest"); }
      return;
    }
    const w = parseFloat(wt) || 0; const r = mode === "failure" ? (parseInt(rp) || 0) : tR;
    if (w <= 0 || (mode === "failure" && r <= 0)) return;
    const ns = { ...allS }; if (!ns[cur.id]) ns[cur.id] = []; ns[cur.id].push({ w, r }); setAllS(ns);
    if (!keepWt) setWt(""); setRp("");
    if (w > (cur.pr || 0)) setPR(cur.id, w);
    if (ns[cur.id].length < tS) { setTmr(rest); setTRun(true); setStep("rest"); }
  };
  const nextE = () => { if (cE >= sIds.length - 1) finishSe(); else { setCE(cE + 1); setIsoTime(0); setIsoRun(false); } };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 16, paddingTop: 50 }}>
      {/* Progress bar */}
      <View style={{ flexDirection: "row", gap: 3, marginBottom: 12 }}>
        {sIds.map((_, i) => <View key={i} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: i < cE ? C.gr : i === cE ? C.gd : C.c2 }} />)}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
        <Text style={{ color: C.ts, fontSize: 11 }}>{t("session.exercise")} {cE + 1}/{sIds.length}</Text>
        <TouchableOpacity onPress={finishSe}><Text style={{ color: C.rd, fontSize: 12, fontWeight: "500" }}>{t("common.stop")}</Text></TouchableOpacity>
      </View>
      {/* Exercise card */}
      <View style={{ backgroundColor: C.glass, borderRadius: 20, borderWidth: 1, borderColor: C.glassBorder, padding: 18, alignItems: "center", marginBottom: 14 }}>
        <Text style={{ fontSize: 40 }}>💪</Text>
        <Text style={{ color: C.t, fontSize: 19, fontWeight: "800", marginTop: 8, textAlign: "center" }}>{cur.n}</Text>
        <Text style={{ color: C.gr, fontSize: 12, fontWeight: "500" }}>{cur.g}</Text>
        <View style={{ flexDirection: "row", gap: 20, marginTop: 12 }}>
          <View style={{ alignItems: "center" }}><Text style={{ color: C.ts, fontSize: 10, textTransform: "uppercase" }}>{t("session.set")}</Text><Text style={{ color: C.t, fontSize: 22, fontWeight: "800" }}>{eSets.length + 1}/{tS}</Text></View>
          <View style={{ alignItems: "center" }}><Text style={{ color: C.ts, fontSize: 10, textTransform: "uppercase" }}>{t("session.mode")}</Text><Text style={{ color: C.t, fontSize: 13, fontWeight: "600" }}>{isDuration ? t("session.isometric") : isReps ? t("common.reps") : mode === "fixed" ? tR + " " + t("common.reps") : t("session.to_failure")}</Text></View>
          <View style={{ alignItems: "center" }}><Text style={{ color: C.ts, fontSize: 10, textTransform: "uppercase" }}>{t("session.rest")}</Text><Text style={{ color: C.t, fontSize: 13, fontWeight: "600" }}>{rest}s</Text></View>
        </View>
      </View>

      {/* Input area */}
      {isDuration ? (
        <View style={{ alignItems: "center", marginBottom: 12 }}>
          <Text style={{ color: C.gr, fontSize: 42, fontWeight: "800", marginBottom: 16 }}>
            {Math.floor(isoTime / 60).toString().padStart(2, "0")}:{(isoTime % 60).toString().padStart(2, "0")}
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity onPress={() => setIsoRun(!isoRun)} style={{ paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14, backgroundColor: isoRun ? C.rd : C.gr }}>
              <Text style={{ color: isoRun ? "#fff" : C.bg, fontWeight: "800", fontSize: 15 }}>{isoRun ? t("session.pause") : t("session.start_timer")}</Text>
            </TouchableOpacity>
            {!isoRun && isoTime > 0 && <TouchableOpacity onPress={() => setIsoTime(0)} style={{ paddingHorizontal: 18, paddingVertical: 14, borderRadius: 14, backgroundColor: C.c1, borderWidth: 1, borderColor: C.c2 }}><Text style={{ color: C.ts, fontSize: 14 }}>↺</Text></TouchableOpacity>}
          </View>
          {!isoRun && isoTime > 0 && <TouchableOpacity onPress={logSet} style={{ height: 52, borderRadius: 16, backgroundColor: C.gr, alignItems: "center", justifyContent: "center", width: "100%", marginTop: 12 }}><Text style={{ color: C.bg, fontWeight: "800", fontSize: 15 }}>{t("session.set_done")} — {isoTime}s</Text></TouchableOpacity>}
        </View>
      ) : isReps ? (
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: C.ts, fontSize: 10, textTransform: "uppercase" }}>{t("common.reps")}</Text>
          <TextInput value={rp} onChangeText={setRp} keyboardType="number-pad" style={{ padding: 12, borderRadius: 14, borderWidth: 1, borderColor: C.c2, backgroundColor: C.c1, color: C.t, fontSize: 20, fontWeight: "700", textAlign: "center", marginTop: 4, marginBottom: 10 }} />
          <TouchableOpacity onPress={logSet} style={{ height: 52, borderRadius: 16, backgroundColor: C.gr, alignItems: "center", justifyContent: "center" }}><Text style={{ color: C.bg, fontWeight: "800", fontSize: 15 }}>{t("session.set_done")}</Text></TouchableOpacity>
        </View>
      ) : (
        <View>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.ts, fontSize: 10, textTransform: "uppercase" }}>{t("exo.weight")}</Text>
              <TextInput value={wt} onChangeText={setWt} keyboardType="decimal-pad" style={{ padding: 12, borderRadius: 14, borderWidth: 1, borderColor: C.c2, backgroundColor: C.c1, color: C.t, fontSize: 20, fontWeight: "700", textAlign: "center", marginTop: 4 }} />
            </View>
            {mode === "failure" && (
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.ts, fontSize: 10, textTransform: "uppercase" }}>{t("common.reps")}</Text>
                <TextInput value={rp} onChangeText={setRp} keyboardType="number-pad" style={{ padding: 12, borderRadius: 14, borderWidth: 1, borderColor: C.c2, backgroundColor: C.c1, color: C.t, fontSize: 20, fontWeight: "700", textAlign: "center", marginTop: 4 }} />
              </View>
            )}
          </View>
          <TouchableOpacity onPress={() => setKeepWt(!keepWt)} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12, paddingVertical: 6 }}>
            <View style={{ width: 36, height: 20, borderRadius: 10, backgroundColor: keepWt ? C.gr : C.c2, justifyContent: "center" }}>
              <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: keepWt ? C.bg : "#666", position: "absolute", left: keepWt ? 18 : 2 }} />
            </View>
            <Text style={{ color: keepWt ? C.t : C.ts, fontSize: 12, fontWeight: "500" }}>{t("session.keep_weight")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logSet} style={{ height: 52, borderRadius: 16, backgroundColor: C.gr, alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
            <Text style={{ color: C.bg, fontWeight: "800", fontSize: 15 }}>{t("session.set_done")}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Next/Finish button */}
      {eSets.length >= tS && (
        <TouchableOpacity onPress={nextE} style={{ height: 48, borderRadius: 14, borderWidth: 2, borderColor: C.gr, alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
          <Text style={{ color: C.gr, fontWeight: "700", fontSize: 14 }}>{cE >= sIds.length - 1 ? t("common.finish") : t("common.next") + " →"}</Text>
        </TouchableOpacity>
      )}

      {/* Logged sets */}
      {eSets.length > 0 && (
        <View style={{ backgroundColor: C.c1, borderRadius: 20, borderWidth: 1, borderColor: C.c2, padding: 10, marginTop: 8 }}>
          <Text style={{ color: C.ts, fontSize: 11, fontWeight: "600", textTransform: "uppercase", marginBottom: 4 }}>{t("session.series")}</Text>
          {eSets.map((s, i) => (
            <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
              <Text style={{ color: C.t, fontWeight: "600" }}>#{i + 1}</Text>
              <Text style={{ color: C.ts }}>{isDuration ? s.r + "s" : s.w > 0 ? s.w + "kg × " + s.r : s.r + " " + t("common.reps")}</Text>
              <Text style={{ color: C.gr, fontWeight: "700" }}>{isDuration ? s.r + "s" : s.w > 0 ? (s.w * s.r).toFixed(0) + "kg" : s.r + " " + t("common.reps")}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
