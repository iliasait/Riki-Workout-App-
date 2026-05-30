/**
 * ExoScreen.js
 * Auteur : Ilias Ait Benaissa
 * Description : Ecran de la bibliotheque d'exercices. Liste filtrable par groupe musculaire
 *               et par recherche textuelle. Permet d'acceder a la fiche detaillee de chaque
 *               exercice et de creer un exercice personnalise.
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, FlatList, Alert, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useApp } from "../context/AppContext";
import { GROUPS } from "../data/exercises";
import { estimate1RM } from "../utils/calc";

export default function ExoScreen() {
  const { C, exos, addExo, delExo } = useApp();
  const { t } = useTranslation();
  const [fg, setFg] = useState(null);
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState(null);
  const [creating, setCreating] = useState(false);

  if (creating) return <NewExoView C={C} t={t} addExo={addExo} onBack={() => setCreating(false)} />;
  if (detail) return <ExoDetailView C={C} t={t} exo={detail} delExo={delExo} onBack={() => setDetail(null)} />;

  const list = exos.filter((e) => (!fg || e.g === fg) && (!q || e.n.toLowerCase().includes(q.toLowerCase())));

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: 50 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16 }}>
        <Text style={{ color: C.t, fontSize: 26, fontWeight: "800" }}>{t("exo.title")}</Text>
        <TouchableOpacity onPress={() => setCreating(true)} style={{ backgroundColor: "rgba(190,255,108,0.1)", borderWidth: 1, borderColor: "rgba(190,255,108,0.15)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 7 }}>
          <Text style={{ color: C.gr, fontSize: 12, fontWeight: "600" }}>+ {t("common.create")}</Text>
        </TouchableOpacity>
      </View>
      <TextInput value={q} onChangeText={setQ} placeholder={t("common.search")} placeholderTextColor={C.c3} style={{ margin: 16, marginBottom: 10, padding: 11, borderRadius: 14, borderWidth: 1, borderColor: C.c2, backgroundColor: C.c1, color: C.t, fontSize: 13 }} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16, marginBottom: 10, maxHeight: 36 }}>
        <Chip label={t("common.all")} active={!fg} onPress={() => setFg(null)} C={C} />
        {GROUPS.map((g) => <Chip key={g} label={g} active={fg === g} onPress={() => setFg(fg === g ? null : g)} C={C} />)}
      </ScrollView>
      <FlatList
        data={list}
        keyExtractor={(e) => String(e.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setDetail(item)} style={{ backgroundColor: C.glass, borderRadius: 20, borderWidth: 1, borderColor: C.glassBorder, padding: 12, marginBottom: 6, flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: "rgba(190,255,108,0.06)", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 18 }}>💪</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.t, fontWeight: "600", fontSize: 13 }} numberOfLines={1}>{item.n}</Text>
              <Text style={{ color: C.ts, fontSize: 11, marginTop: 1 }}>{item.g}</Text>
            </View>
            <Text style={{ color: C.c3, fontSize: 16 }}>›</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function Chip({ label, active, onPress, C }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: active ? "rgba(190,255,108,0.1)" : C.c1, borderWidth: 1, borderColor: active ? "rgba(190,255,108,0.2)" : "transparent", marginRight: 5 }}>
      <Text style={{ color: active ? C.gr : C.ts, fontSize: 11, fontWeight: active ? "700" : "400" }}>{label}</Text>
    </TouchableOpacity>
  );
}

function ExoDetailView({ C, t, exo, delExo, onBack }) {
  const rm = exo.prType === "weight" && exo.pr > 0 ? estimate1RM(exo.pr, 1) : null;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 20, paddingTop: 50 }}>
      <TouchableOpacity onPress={onBack}><Text style={{ color: C.gr, fontSize: 13, marginBottom: 14 }}>← {t("common.back")}</Text></TouchableOpacity>
      <View style={{ backgroundColor: C.c1, borderRadius: 24, borderWidth: 1, borderColor: C.c2, padding: 24, alignItems: "center", marginBottom: 18 }}>
        <Text style={{ fontSize: 48, marginBottom: 12 }}>💪</Text>
        <Text style={{ color: C.t, fontSize: 20, fontWeight: "800", textAlign: "center" }}>{exo.n}</Text>
        <View style={{ backgroundColor: "rgba(190,255,108,0.1)", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 4, marginTop: 8 }}>
          <Text style={{ color: C.gr, fontSize: 12, fontWeight: "600" }}>{exo.g}</Text>
        </View>
        {exo.pr > 0 && <Text style={{ color: C.gr, fontSize: 16, fontWeight: "800", marginTop: 12 }}>PR: {exo.pr} {exo.prType === "weight" ? "kg" : exo.prType === "reps" ? "reps" : "s"}</Text>}
        {rm && <Text style={{ color: C.ts, fontSize: 12, marginTop: 4 }}>{t("exo.estimated_1rm")}: {rm} kg</Text>}
      </View>
      <View style={{ backgroundColor: C.c1, borderRadius: 20, borderWidth: 1, borderColor: C.c2, padding: 16, marginBottom: 10 }}>
        <Text style={{ color: C.t, fontSize: 14, fontWeight: "700", marginBottom: 8 }}>{t("exo.execution")}</Text>
        <Text style={{ color: C.ts, fontSize: 13, lineHeight: 22 }}>{exo.d}</Text>
      </View>
      {exo.custom && (
        <TouchableOpacity onPress={() => { Alert.alert(t("common.delete"), t("exo.delete_exo") + " ?", [{ text: t("common.cancel") }, { text: t("common.delete"), style: "destructive", onPress: () => { delExo(exo.id); onBack(); } }]); }} style={{ padding: 14, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,77,77,0.2)", backgroundColor: "rgba(255,77,77,0.08)", alignItems: "center", marginTop: 6 }}>
          <Text style={{ color: C.rd, fontSize: 14, fontWeight: "600" }}>{t("exo.delete_exo")}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

function NewExoView({ C, t, addExo, onBack }) {
  const [n, setN] = useState("");
  const [g, setG] = useState("Pectoraux");
  const [d, setD] = useState("");
  const [pt, setPt] = useState("weight");

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 20, paddingTop: 50 }}>
      <TouchableOpacity onPress={onBack}><Text style={{ color: C.gr, fontSize: 13, marginBottom: 14 }}>← {t("common.back")}</Text></TouchableOpacity>
      <Text style={{ color: C.t, fontSize: 22, fontWeight: "800", marginBottom: 18 }}>{t("exo.new")}</Text>
      <Text style={{ color: C.ts, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>{t("exo.name")}</Text>
      <TextInput value={n} onChangeText={setN} placeholder="Ex: Tirage Yates..." placeholderTextColor={C.c3} style={{ padding: 12, borderRadius: 14, borderWidth: 1, borderColor: C.c2, backgroundColor: C.c1, color: C.t, fontSize: 14, marginTop: 4, marginBottom: 12 }} />
      <Text style={{ color: C.ts, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{t("exo.group")}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12, maxHeight: 36 }}>
        {GROUPS.map((gr) => <Chip key={gr} label={gr} active={g === gr} onPress={() => setG(gr)} C={C} />)}
      </ScrollView>
      <Text style={{ color: C.ts, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{t("exo.pr_type")}</Text>
      <View style={{ flexDirection: "row", gap: 6, marginBottom: 12 }}>
        {[["weight", t("exo.weight")], ["reps", t("exo.reps_type")], ["duration", t("exo.duration_type")]].map(([v, l]) => (
          <TouchableOpacity key={v} onPress={() => setPt(v)} style={{ flex: 1, padding: 9, borderRadius: 10, backgroundColor: pt === v ? "rgba(190,255,108,0.1)" : C.c2, alignItems: "center" }}>
            <Text style={{ color: pt === v ? C.gr : C.ts, fontSize: 11, fontWeight: "600" }}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={{ color: C.ts, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>{t("exo.description")}</Text>
      <TextInput value={d} onChangeText={setD} placeholder="Consignes..." placeholderTextColor={C.c3} multiline style={{ padding: 12, borderRadius: 14, borderWidth: 1, borderColor: C.c2, backgroundColor: C.c1, color: C.t, fontSize: 13, marginTop: 4, marginBottom: 16, minHeight: 80, textAlignVertical: "top" }} />
      <TouchableOpacity onPress={() => { if (!n.trim()) return; addExo({ n: n.trim(), g, d: d.trim(), prType: pt }); onBack(); }} disabled={!n.trim()} style={{ height: 52, borderRadius: 16, backgroundColor: n.trim() ? C.gr : C.c2, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: n.trim() ? C.bg : C.ts, fontWeight: "700", fontSize: 15 }}>{t("common.create")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
