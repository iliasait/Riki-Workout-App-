/**
 * db/database.js
 * Auteur : Ilias Ait Benaissa
 * Description : Couche d'acces aux donnees de RIKI sur SQLite (expo-sqlite).
 *               Initialise les six tables du schema (exercices, seances, series,
 *               presets, seances planifiees, reglages), peuple la base au premier
 *               lancement, et expose les fonctions de lecture/ecriture (DAO).
 */

import * as SQLite from "expo-sqlite";
import { INIT_EX, DEFAULT_PRESETS } from "../data/exercises";

const db = SQLite.openDatabaseSync("riki.db");

/** Cree le schema (6 tables) si necessaire et peuple la base au premier lancement. */
export function initDatabase() {
  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      muscle_group TEXT NOT NULL,
      description TEXT,
      pr REAL DEFAULT 0,
      pr_type TEXT NOT NULL,
      is_custom INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      duration INTEGER DEFAULT 0,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS session_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      exercise_name TEXT NOT NULL,
      muscle_group TEXT,
      pr_type TEXT,
      set_index INTEGER,
      weight REAL DEFAULT 0,
      reps INTEGER DEFAULT 0,
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS presets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      exercise_ids TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS planned_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      preset_id INTEGER,
      preset_name TEXT
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  const seeded = db.getFirstSync("SELECT value FROM settings WHERE key = 'seeded'");
  if (!seeded) {
    const insEx = db.prepareSync(
      "INSERT INTO exercises (id, name, muscle_group, description, pr, pr_type, is_custom) VALUES (?, ?, ?, ?, 0, ?, 0)"
    );
    try {
      INIT_EX.forEach((e) => insEx.executeSync([e.id, e.n, e.g, e.d, e.prType]));
    } finally {
      insEx.finalizeSync();
    }
    DEFAULT_PRESETS.forEach((p) =>
      db.runSync("INSERT INTO presets (id, name, exercise_ids) VALUES (?, ?, ?)", [
        p.id, p.nom, JSON.stringify(p.ids),
      ])
    );
    db.runSync("INSERT INTO settings (key, value) VALUES ('seeded', '1')");
  }
}

/* ----------------------------- Exercices ----------------------------- */

export function getExercises() {
  return db
    .getAllSync("SELECT * FROM exercises ORDER BY id")
    .map((r) => ({
      id: r.id, n: r.name, g: r.muscle_group, d: r.description,
      pr: r.pr, prType: r.pr_type, custom: !!r.is_custom,
    }));
}

export function addExercise(ex) {
  const id = Date.now();
  db.runSync(
    "INSERT INTO exercises (id, name, muscle_group, description, pr, pr_type, is_custom) VALUES (?, ?, ?, ?, 0, ?, 1)",
    [id, ex.n, ex.g, ex.d, ex.prType]
  );
  return id;
}

export function deleteExercise(id) {
  db.runSync("DELETE FROM exercises WHERE id = ?", [id]);
}

export function updatePR(id, value) {
  db.runSync("UPDATE exercises SET pr = ? WHERE id = ?", [value, id]);
}

/* ------------------------------ Seances ------------------------------ */

/** Enregistre une seance et ses series. Retourne l'identifiant cree. */
export function addSession(session) {
  db.runSync("INSERT INTO sessions (date, duration, notes) VALUES (?, ?, ?)", [
    session.date, session.dur || 0, session.notes || "",
  ]);
  const row = db.getFirstSync("SELECT last_insert_rowid() AS id");
  const sid = row.id;
  const ins = db.prepareSync(
    "INSERT INTO session_sets (session_id, exercise_name, muscle_group, pr_type, set_index, weight, reps) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  try {
    session.exos.forEach((exo) => {
      (exo.sets || []).forEach((st, idx) =>
        ins.executeSync([sid, exo.n, exo.g, exo.prType, idx, st.p || 0, st.r || 0])
      );
    });
  } finally {
    ins.finalizeSync();
  }
  return sid;
}

/** Reconstruit les seances sous la forme imbriquee { date, dur, exos:[{ n, g, prType, sets:[{p,r}] }] }. */
export function getSessions() {
  const sessions = db.getAllSync("SELECT * FROM sessions ORDER BY date DESC, id DESC");
  return sessions.map((s) => {
    const rows = db.getAllSync(
      "SELECT * FROM session_sets WHERE session_id = ? ORDER BY id",
      [s.id]
    );
    const byExo = [];
    rows.forEach((r) => {
      let e = byExo.find((x) => x.n === r.exercise_name);
      if (!e) {
        e = { n: r.exercise_name, g: r.muscle_group, prType: r.pr_type, sets: [] };
        byExo.push(e);
      }
      e.sets.push({ p: r.weight, r: r.reps });
    });
    return { id: s.id, date: s.date, dur: s.duration, notes: s.notes, exos: byExo };
  });
}

/* ------------------------------ Presets ------------------------------ */

export function getPresets() {
  return db
    .getAllSync("SELECT * FROM presets ORDER BY id")
    .map((p) => ({ id: p.id, nom: p.name, ids: JSON.parse(p.exercise_ids) }));
}

export function addPreset(nom, ids) {
  db.runSync("INSERT INTO presets (name, exercise_ids) VALUES (?, ?)", [
    nom, JSON.stringify(ids),
  ]);
}

export function deletePreset(id) {
  db.runSync("DELETE FROM presets WHERE id = ?", [id]);
}

/* ------------------------- Seances planifiees ------------------------ */

export function getPlanned() {
  return db
    .getAllSync("SELECT * FROM planned_sessions ORDER BY date")
    .map((p) => ({ date: p.date, presetId: p.preset_id, preset: p.preset_name }));
}

export function setPlanned(date, presetId, presetName) {
  db.runSync("DELETE FROM planned_sessions WHERE date = ?", [date]);
  db.runSync(
    "INSERT INTO planned_sessions (date, preset_id, preset_name) VALUES (?, ?, ?)",
    [date, presetId, presetName]
  );
}

export function removePlanned(date) {
  db.runSync("DELETE FROM planned_sessions WHERE date = ?", [date]);
}

/* ------------------------------ Reglages ----------------------------- */

export function getSetting(key, fallback = null) {
  const row = db.getFirstSync("SELECT value FROM settings WHERE key = ?", [key]);
  return row ? row.value : fallback;
}

export function setSetting(key, value) {
  db.runSync(
    "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    [key, String(value)]
  );
}

export default db;
