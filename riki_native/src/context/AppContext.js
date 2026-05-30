/**
 * AppContext.js
 * Auteur : Ilias Ait Benaissa
 * Description : Contexte global de l'application RIKI. Centralise l'etat (exercices,
 *               historique, presets, planification, objectif, poids de corps, theme, langue)
 *               et le charge depuis SQLite au demarrage. Expose un provider et un hook.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getPalette } from "../theme/colors";
import * as DB from "../db/database";
import i18n from "../i18n";

const Ctx = createContext();

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [exos, setExos] = useState([]);
  const [hist, setHist] = useState([]);
  const [presets, setPresets] = useState([]);
  const [planned, setPlanned] = useState([]);
  const [goal, setGoal] = useState(0);
  const [bw, setBw] = useState(0);
  const [onboarded, setOnboarded] = useState(false);
  const [lang, setLang] = useState("fr");

  const C = getPalette(theme);

  // Initialisation au demarrage
  useEffect(() => {
    try {
      DB.initDatabase();
      const savedTheme = DB.getSetting("theme", "dark");
      const savedGoal = parseInt(DB.getSetting("goal", "0"), 10);
      const savedBw = parseFloat(DB.getSetting("bw", "0"));
      const savedOnboarded = DB.getSetting("onboarded") === "1";
      const savedLang = DB.getSetting("lang", "fr");
      setTheme(savedTheme);
      setGoal(savedGoal);
      setBw(savedBw);
      setOnboarded(savedOnboarded);
      setLang(savedLang);
      i18n.changeLanguage(savedLang);
      setExos(DB.getExercises());
      setHist(DB.getSessions());
      setPresets(DB.getPresets());
      setPlanned(DB.getPlanned());
    } catch (e) {
      console.warn("DB init error:", e);
    }
    setReady(true);
  }, []);

  const reload = useCallback(() => {
    setExos(DB.getExercises());
    setHist(DB.getSessions());
    setPresets(DB.getPresets());
    setPlanned(DB.getPlanned());
  }, []);

  const updateTheme = (t) => { setTheme(t); DB.setSetting("theme", t); };
  const updateGoal = (g) => { setGoal(g); DB.setSetting("goal", String(g)); };
  const updateBw = (w) => { setBw(w); DB.setSetting("bw", String(w)); };
  const updateLang = (l) => { setLang(l); i18n.changeLanguage(l); DB.setSetting("lang", l); };
  const finishOnboarding = (g, weight) => {
    setGoal(g);
    if (weight > 0) setBw(weight);
    setOnboarded(true);
    DB.setSetting("goal", String(g));
    if (weight > 0) DB.setSetting("bw", String(weight));
    DB.setSetting("onboarded", "1");
  };

  const addExo = (ex) => { DB.addExercise(ex); setExos(DB.getExercises()); };
  const delExo = (id) => { DB.deleteExercise(id); setExos(DB.getExercises()); };
  const setPR = (id, v) => { DB.updatePR(id, v); setExos(DB.getExercises()); };

  const saveSession = (session) => { DB.addSession(session); setHist(DB.getSessions()); };

  const addPreset = (nom, ids) => { DB.addPreset(nom, ids); setPresets(DB.getPresets()); };
  const delPreset = (id) => { DB.deletePreset(id); setPresets(DB.getPresets()); };

  const planSession = (date, presetId, presetName) => { DB.setPlanned(date, presetId, presetName); setPlanned(DB.getPlanned()); };
  const unplanSession = (date) => { DB.removePlanned(date); setPlanned(DB.getPlanned()); };

  return (
    <Ctx.Provider value={{
      ready, C, theme, updateTheme, exos, hist, presets, planned,
      goal, updateGoal, bw, updateBw, onboarded, finishOnboarding,
      lang, updateLang,
      addExo, delExo, setPR, saveSession,
      addPreset, delPreset, planSession, unplanSession, reload,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() { return useContext(Ctx); }
