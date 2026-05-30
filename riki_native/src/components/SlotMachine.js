/**
 * SlotMachine.js
 * Auteur : Ilias Ait Benaissa
 * Description : Composant de tirage aleatoire d'exercice. Affiche une liste verticale
 *               qui defile et decelere progressivement jusqu'a s'arreter sur un exercice
 *               choisi au hasard. L'utilisateur peut ensuite l'ajouter a sa seance.
 */

import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Modal, StyleSheet, Dimensions } from "react-native";
import { useTranslation } from "react-i18next";

const ITEM_H = 76;

export default function SlotMachine({ exos, C, onClose, onSelect }) {
  const { t } = useTranslation();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const doSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    const targetIdx = Math.floor(Math.random() * exos.length);
    const totalScroll = exos.length * ITEM_H * (3 + Math.random() * 2) + targetIdx * ITEM_H;

    Animated.timing(scrollY, {
      toValue: totalScroll,
      duration: 3000 + Math.random() * 1000,
      useNativeDriver: true,
    }).start(() => {
      setResult(exos[targetIdx]);
      setSpinning(false);
    });
  };

  const tripled = [...exos, ...exos, ...exos, ...exos, ...exos];
  const totalH = exos.length * ITEM_H;

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <View style={[s.overlay, { backgroundColor: "rgba(0,0,0,0.95)" }]}>
        <TouchableOpacity onPress={onClose} style={s.closeBtn}>
          <Text style={{ color: C.t, fontSize: 20, opacity: 0.6 }}>✕</Text>
        </TouchableOpacity>
        <Text style={{ color: C.gr, fontSize: 18, fontWeight: "800", marginBottom: 16 }}>{t("slot.title")}</Text>
        <View style={{ width: 270, height: ITEM_H * 5, borderRadius: 18, backgroundColor: C.c1, borderWidth: 1, borderColor: C.c2, overflow: "hidden" }}>
          {/* Selection indicator */}
          <View style={{ position: "absolute", top: ITEM_H * 2, left: 0, right: 0, height: ITEM_H, borderWidth: 2, borderColor: C.gr, borderRadius: 12, backgroundColor: "rgba(190,255,108,0.06)", zIndex: 10 }} pointerEvents="none" />
          <Animated.View style={{ transform: [{ translateY: Animated.multiply(scrollY, -1).interpolate({ inputRange: [-999999, 999999], outputRange: [-999999, 999999] }) }], paddingTop: ITEM_H * 2 }}>
            {tripled.map((ex, i) => (
              <View key={i} style={{ height: ITEM_H, flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: C.c2 }}>
                <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: "rgba(190,255,108,0.08)", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 18 }}>💪</Text>
                </View>
                <View>
                  <Text style={{ color: C.t, fontWeight: "600", fontSize: 13 }}>{ex.n}</Text>
                  <Text style={{ color: C.ts, fontSize: 11 }}>{ex.g}</Text>
                </View>
              </View>
            ))}
          </Animated.View>
        </View>
        {result && !spinning && (
          <View style={{ marginTop: 18, alignItems: "center" }}>
            <Text style={{ color: C.gr, fontSize: 16, fontWeight: "800" }}>🎉 {result.n}</Text>
            <TouchableOpacity onPress={() => onSelect(result)} style={{ marginTop: 10, paddingHorizontal: 24, paddingVertical: 11, borderRadius: 12, backgroundColor: C.gr }}>
              <Text style={{ color: C.bg, fontWeight: "700", fontSize: 13 }}>{t("common.add")}</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity onPress={doSpin} disabled={spinning} style={{ marginTop: 18, paddingHorizontal: 32, paddingVertical: 13, borderRadius: 16, backgroundColor: spinning ? C.c1 : C.gr }}>
          <Text style={{ color: spinning ? C.ts : C.bg, fontWeight: "800", fontSize: 15 }}>{spinning ? "..." : t("slot.spin")}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  closeBtn: { position: "absolute", top: 50, right: 20 },
});
