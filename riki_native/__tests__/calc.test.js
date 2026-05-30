/**
 * calc.test.js
 * Auteur : Ilias Ait Benaissa
 * Description : Tests unitaires Jest des fonctions de calcul pures de RIKI (src/utils/calc.js).
 *               Couvre le volume (charge, poids du corps, cardio), l'estimation du 1RM,
 *               le calcul de la serie hebdomadaire (y compris aux frontieres de mois),
 *               l'estimation des calories et les utilitaires de date.
 */

import {
  parseLocal, todayStr, weekStartTs,
  setVolume, exerciseVolume, sessionVolume,
  estimate1RM, computeStreak, estimateCalories, totalSets,
} from "../src/utils/calc";

describe("Dates", () => {
  test("parseLocal interprete une date en local (pas UTC)", () => {
    const d = parseLocal("2026-05-29");
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(4); // mai = index 4
    expect(d.getDate()).toBe(29);
  });

  test("todayStr formate au format AAAA-MM-JJ", () => {
    expect(todayStr(new Date(2026, 0, 3))).toBe("2026-01-03");
  });

  test("weekStartTs renvoie le lundi de la semaine", () => {
    const ts = weekStartTs(new Date(2026, 4, 29)); // vendredi 29 mai 2026
    const monday = new Date(ts);
    expect(monday.getDay()).toBe(1); // lundi
    expect(monday.getDate()).toBe(25);
  });
});

describe("Volume", () => {
  test("setVolume = poids x reps", () => {
    expect(setVolume({ weight: 80, reps: 10 })).toBe(800);
  });

  test("exerciseVolume charge = somme poids x reps", () => {
    const exo = { prType: "weight", sets: [{ weight: 100, reps: 8 }, { weight: 100, reps: 8 }] };
    expect(exerciseVolume(exo)).toBe(1600);
  });

  test("exerciseVolume poids du corps = poids de corps x total reps", () => {
    const exo = { prType: "reps", sets: [{ weight: 0, reps: 20 }, { weight: 0, reps: 20 }] };
    expect(exerciseVolume(exo, 75)).toBe(3000);
  });

  test("exerciseVolume poids du corps sans poids renseigne = 0", () => {
    const exo = { prType: "reps", sets: [{ weight: 0, reps: 20 }] };
    expect(exerciseVolume(exo, 0)).toBe(0);
  });

  test("exerciseVolume cardio / duree = 0", () => {
    const exo = { prType: "duration", sets: [{ weight: 0, reps: 600 }] };
    expect(exerciseVolume(exo, 75)).toBe(0);
  });

  test("sessionVolume agrege charge + poids du corps + cardio", () => {
    const session = {
      exos: [
        { prType: "reps", sets: [{ weight: 0, reps: 20 }, { weight: 0, reps: 20 }] }, // 75*40 = 3000
        { prType: "weight", sets: [{ weight: 100, reps: 8 }, { weight: 100, reps: 8 }] }, // 1600
        { prType: "duration", sets: [{ weight: 0, reps: 60 }] }, // 0
      ],
    };
    expect(sessionVolume(session, 75)).toBe(4600);
  });

  test("totalSets compte toutes les series", () => {
    const session = { exos: [{ sets: [{}, {}] }, { sets: [{}] }] };
    expect(totalSets(session)).toBe(3);
  });
});

describe("Estimation du 1RM (Epley)", () => {
  test("une seule repetition = le poids lui-meme", () => {
    expect(estimate1RM(100, 1)).toBe(100);
  });

  test("100 kg x 10 reps ~ 133 kg", () => {
    expect(estimate1RM(100, 10)).toBe(133);
  });

  test("donnees invalides = 0", () => {
    expect(estimate1RM(0, 10)).toBe(0);
    expect(estimate1RM(100, 0)).toBe(0);
  });
});

describe("Serie hebdomadaire (streak)", () => {
  const addDays = (s, n) => {
    const p = s.split("-").map(Number);
    const d = new Date(p[0], p[1] - 1, p[2] + n);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  };

  test("aucune seance = 0", () => {
    expect(computeStreak([], 3, new Date(2026, 4, 29))).toBe(0);
  });

  test("compte les semaines consecutives a travers une frontiere de mois", () => {
    const mondays = ["2026-05-18", "2026-05-11", "2026-05-04", "2026-04-27", "2026-04-20", "2026-04-13", "2026-04-06", "2026-03-30", "2026-03-23", "2026-03-16"];
    const hist = [];
    mondays.forEach((m) => [0, 2].forEach((off) => hist.push({ date: addDays(m, off) })));
    expect(computeStreak(hist, 2, new Date(2026, 4, 29))).toBe(10);
  });

  test("s'arrete a la premiere semaine sous l'objectif", () => {
    const mondays = ["2026-05-18", "2026-05-11", "2026-05-04", "2026-04-27", "2026-04-13"]; // 04-20 manquante
    const hist = [];
    mondays.forEach((m) => [0, 2].forEach((off) => hist.push({ date: addDays(m, off) })));
    expect(computeStreak(hist, 2, new Date(2026, 4, 29))).toBe(4);
  });
});

describe("Estimation des calories (MET)", () => {
  test("course a pied 30 min a 75 kg", () => {
    // 9.8 * 3.5 * 75 / 200 * 30 = 385.875 -> 386
    expect(estimateCalories("Course à pied", 30, 75)).toBe(386);
  });

  test("activite inconnue utilise le MET par defaut", () => {
    expect(estimateCalories("Yoga", 30, 75)).toBe(Math.round((6 * 3.5 * 75) / 200 * 30));
  });

  test("donnees invalides = 0", () => {
    expect(estimateCalories("Vélo", 0, 75)).toBe(0);
    expect(estimateCalories("Vélo", 30, 0)).toBe(0);
  });
});
