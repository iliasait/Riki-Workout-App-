/**
 * calc.js
 * Auteur : Ilias Ait Benaissa
 * Description : Fonctions de calcul pures de RIKI, isolees de l'interface afin d'etre
 *               testables unitairement avec Jest. Regroupe le calcul de volume (y compris
 *               le poids du corps), l'estimation du 1RM (formule d'Epley), le calcul de la
 *               serie hebdomadaire, l'estimation des calories cardio et les utilitaires de date.
 */

/**
 * Analyse une chaine "AAAA-MM-JJ" comme une date LOCALE (et non UTC),
 * pour eviter le decalage d'un jour selon le fuseau horaire.
 */
export function parseLocal(s) {
  const p = String(s).split("-");
  return new Date(+p[0], +p[1] - 1, +p[2]);
}

/** Retourne la date du jour au format local "AAAA-MM-JJ". */
export function todayStr(d = new Date()) {
  return (
    d.getFullYear() +
    "-" + String(d.getMonth() + 1).padStart(2, "0") +
    "-" + String(d.getDate()).padStart(2, "0")
  );
}

/** Timestamp du lundi (00:00 local) de la semaine contenant la date donnee. */
export function weekStartTs(date) {
  const x = new Date(date);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x.getTime();
}

/** Volume d'une serie : poids x repetitions. */
export function setVolume(set) {
  return (set.weight || 0) * (set.reps || 0);
}

/**
 * Volume d'un exercice au sein d'une seance.
 * - "reps" (poids du corps) : poids de corps x total des repetitions
 * - "duration" (cardio / gainage) : 0 (non comptabilise en volume)
 * - autres (charge) : somme des poids x repetitions
 */
export function exerciseVolume(exo, bodyweight = 0) {
  const sets = exo.sets || [];
  if (exo.prType === "reps") {
    const reps = sets.reduce((a, s) => a + (s.reps || 0), 0);
    return (bodyweight > 0 ? bodyweight : 0) * reps;
  }
  if (exo.prType === "duration") return 0;
  return sets.reduce((a, s) => a + setVolume(s), 0);
}

/** Volume total d'une seance. */
export function sessionVolume(session, bodyweight = 0) {
  return (session.exos || []).reduce((a, e) => a + exerciseVolume(e, bodyweight), 0);
}

/**
 * Estimation du 1RM (one-rep max) par la formule d'Epley :
 * 1RM = poids x (1 + repetitions / 30).
 * Retourne 0 si les donnees sont invalides.
 */
export function estimate1RM(weight, reps) {
  if (!weight || weight <= 0 || !reps || reps <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

/**
 * Calcul de la serie hebdomadaire facon Duolingo : nombre de semaines passees
 * consecutives ou le nombre de jours d'entrainement distincts atteint l'objectif.
 * Regroupe les seances par debut de semaine puis recule de 7 jours a chaque iteration,
 * ce qui gere correctement les changements de mois et d'annee.
 */
export function computeStreak(history, goal, reference = new Date()) {
  if (!goal || goal <= 0 || !history || history.length === 0) return 0;
  const byWeek = {};
  history.forEach((h) => {
    const d = parseLocal(h.date);
    const ws = weekStartTs(d);
    (byWeek[ws] = byWeek[ws] || new Set()).add(d.getDay());
  });
  const monday = new Date(reference);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  let count = 0;
  const cursor = new Date(monday);
  cursor.setDate(cursor.getDate() - 7); // derniere semaine terminee
  for (let i = 0; i < 520; i++) {
    const days = byWeek[cursor.getTime()];
    if (days && days.size >= goal) {
      count++;
      cursor.setDate(cursor.getDate() - 7);
    } else break;
  }
  return count;
}

/**
 * Estimation des calories depensees pour une activite cardio, via la formule MET :
 * calories = MET x 3.5 x poids(kg) / 200 x duree(min).
 * Le MET depend du type d'activite.
 */
export const MET_TABLE = {
  "Course à pied": 9.8,
  "Vélo": 7.5,
  "Rameur": 7.0,
  "Corde à sauter": 11.0,
  "HIIT": 8.0,
  "Elliptique": 5.0,
  "Natation": 8.3,
  default: 6.0,
};

export function estimateCalories(activity, minutes, bodyweight) {
  if (!minutes || minutes <= 0 || !bodyweight || bodyweight <= 0) return 0;
  const met = MET_TABLE[activity] || MET_TABLE.default;
  return Math.round((met * 3.5 * bodyweight) / 200 * minutes);
}

/** Nombre total de series d'une seance. */
export function totalSets(session) {
  return (session.exos || []).reduce((a, e) => a + (e.sets ? e.sets.length : 0), 0);
}
