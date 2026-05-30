/**
 * exercises.js
 * Auteur : Ilias Ait Benaissa
 * Description : Donnees de reference de l'application : groupes musculaires, mapping
 *               vers les illustrations, bibliotheque initiale de 59 exercices et presets
 *               par defaut. Ces donnees servent a peupler la base SQLite au premier lancement.
 */

export const GROUPS = [
  "Pectoraux", "Dos", "Épaules", "Biceps", "Triceps",
  "Jambes", "Mollets", "Abdominaux", "Avant-bras", "Cardio",
];

// Cle de groupe -> identifiant d'illustration musculaire
export const GRP_ICON = {
  Pectoraux: "bench", Dos: "pullup", "Épaules": "shoulder", Biceps: "curl",
  Triceps: "dip", Jambes: "squat", Mollets: "calf", Abdominaux: "crunch",
  "Avant-bras": "grip", Cardio: "cardio",
};

// prType : "weight" (charge en kg), "reps" (poids du corps), "duration" (isometrie/cardio)
export const INIT_EX = [
  { id: 1, n: "Développé couché barre", g: "Pectoraux", d: "Banc plat, descendre la barre puis pousser.", pr: 0, prType: "weight" },
  { id: 2, n: "Développé couché haltères", g: "Pectoraux", d: "Haltères, plus grande amplitude.", pr: 0, prType: "weight" },
  { id: 3, n: "Développé incliné barre", g: "Pectoraux", d: "Banc 30-45°. Haut des pecs.", pr: 0, prType: "weight" },
  { id: 4, n: "Développé incliné haltères", g: "Pectoraux", d: "Banc 30-45° avec haltères.", pr: 0, prType: "weight" },
  { id: 5, n: "Écarté couché", g: "Pectoraux", d: "Isolation, ouvrir en arc.", pr: 0, prType: "weight" },
  { id: 6, n: "Écarté poulie", g: "Pectoraux", d: "Câbles croisés.", pr: 0, prType: "weight" },
  { id: 7, n: "Pompes", g: "Pectoraux", d: "Poids du corps.", pr: 0, prType: "reps" },
  { id: 8, n: "Pompes diamant", g: "Pectoraux", d: "Mains rapprochées, triceps + pecs intérieurs.", pr: 0, prType: "reps" },
  { id: 9, n: "Pullover", g: "Pectoraux", d: "Haltère, expansion cage thoracique.", pr: 0, prType: "weight" },
  { id: 10, n: "Tractions pronation", g: "Dos", d: "Prise large, grand dorsal.", pr: 0, prType: "reps" },
  { id: 11, n: "Tractions supination", g: "Dos", d: "Prise serrée, biceps + dos.", pr: 0, prType: "reps" },
  { id: 12, n: "Rowing barre", g: "Dos", d: "Buste 45°, tirer vers nombril.", pr: 0, prType: "weight" },
  { id: 13, n: "Rowing haltère", g: "Dos", d: "Un bras, appui sur banc.", pr: 0, prType: "weight" },
  { id: 14, n: "Tirage vertical", g: "Dos", d: "Alternative tractions.", pr: 0, prType: "weight" },
  { id: 15, n: "Tirage horizontal", g: "Dos", d: "Poulie basse, épaisseur du dos.", pr: 0, prType: "weight" },
  { id: 16, n: "Soulevé de terre", g: "Dos", d: "Composé fondamental.", pr: 0, prType: "weight" },
  { id: 17, n: "Soulevé de terre roumain", g: "Dos", d: "Ischio-jambiers et bas du dos.", pr: 0, prType: "weight" },
  { id: 18, n: "Développé militaire", g: "Épaules", d: "Au-dessus de la tête.", pr: 0, prType: "weight" },
  { id: 19, n: "Développé Arnold", g: "Épaules", d: "Rotation pendant le mouvement.", pr: 0, prType: "weight" },
  { id: 20, n: "Élévation latérale", g: "Épaules", d: "Deltoïde moyen.", pr: 0, prType: "weight" },
  { id: 21, n: "Élévation frontale", g: "Épaules", d: "Deltoïde antérieur.", pr: 0, prType: "weight" },
  { id: 22, n: "Oiseau", g: "Épaules", d: "Deltoïde postérieur, buste penché.", pr: 0, prType: "weight" },
  { id: 23, n: "Face pull", g: "Épaules", d: "Santé épaules.", pr: 0, prType: "weight" },
  { id: 24, n: "Shrug", g: "Épaules", d: "Trapèzes supérieurs.", pr: 0, prType: "weight" },
  { id: 25, n: "Curl barre EZ", g: "Biceps", d: "Confort poignets.", pr: 0, prType: "weight" },
  { id: 26, n: "Curl marteau", g: "Biceps", d: "Brachial.", pr: 0, prType: "weight" },
  { id: 27, n: "Curl haltères", g: "Biceps", d: "Curl classique avec supination.", pr: 0, prType: "weight" },
  { id: 28, n: "Curl concentré", g: "Biceps", d: "Isolation maximale, assis.", pr: 0, prType: "weight" },
  { id: 29, n: "Curl pupitre", g: "Biceps", d: "Appui sur pupitre Larry Scott.", pr: 0, prType: "weight" },
  { id: 30, n: "Dips", g: "Triceps", d: "Barres parallèles.", pr: 0, prType: "reps" },
  { id: 31, n: "Extension poulie", g: "Triceps", d: "Pushdown.", pr: 0, prType: "weight" },
  { id: 32, n: "Barre au front", g: "Triceps", d: "Skull crushers, barre EZ.", pr: 0, prType: "weight" },
  { id: 33, n: "Extension nuque haltère", g: "Triceps", d: "Un haltère derrière la tête.", pr: 0, prType: "weight" },
  { id: 34, n: "Kick back", g: "Triceps", d: "Haltère, bras tendu en arrière.", pr: 0, prType: "weight" },
  { id: 35, n: "Squat barre", g: "Jambes", d: "Roi des jambes.", pr: 0, prType: "weight" },
  { id: 36, n: "Squat bulgare", g: "Jambes", d: "Pied arrière surélevé.", pr: 0, prType: "weight" },
  { id: 37, n: "Presse à cuisses", g: "Jambes", d: "Machine 45°.", pr: 0, prType: "weight" },
  { id: 38, n: "Leg extension", g: "Jambes", d: "Isolation quadriceps.", pr: 0, prType: "weight" },
  { id: 39, n: "Leg curl", g: "Jambes", d: "Isolation ischio-jambiers.", pr: 0, prType: "weight" },
  { id: 40, n: "Hip thrust", g: "Jambes", d: "Fessiers.", pr: 0, prType: "weight" },
  { id: 41, n: "Fentes", g: "Jambes", d: "Marchées ou sur place.", pr: 0, prType: "weight" },
  { id: 42, n: "Goblet squat", g: "Jambes", d: "Squat avec haltère ou kettlebell.", pr: 0, prType: "weight" },
  { id: 43, n: "Mollets debout", g: "Mollets", d: "Gastrocnémiens.", pr: 0, prType: "weight" },
  { id: 44, n: "Mollets assis", g: "Mollets", d: "Soléaire.", pr: 0, prType: "weight" },
  { id: 45, n: "Crunch", g: "Abdominaux", d: "Base abdos.", pr: 0, prType: "reps" },
  { id: 46, n: "Planche", g: "Abdominaux", d: "Gainage isométrique.", pr: 0, prType: "duration" },
  { id: 47, n: "Planche latérale", g: "Abdominaux", d: "Gainage obliques.", pr: 0, prType: "duration" },
  { id: 48, n: "Relevé de jambes", g: "Abdominaux", d: "Abdos inférieurs.", pr: 0, prType: "reps" },
  { id: 49, n: "Russian twist", g: "Abdominaux", d: "Obliques avec rotation.", pr: 0, prType: "reps" },
  { id: 50, n: "Ab wheel", g: "Abdominaux", d: "Roue abdominale.", pr: 0, prType: "reps" },
  { id: 51, n: "Farmer walk", g: "Avant-bras", d: "Préhension.", pr: 0, prType: "weight" },
  { id: 52, n: "Wrist curl", g: "Avant-bras", d: "Flexion poignets.", pr: 0, prType: "weight" },
  { id: 53, n: "Course à pied", g: "Cardio", d: "Running, jogging.", pr: 0, prType: "duration" },
  { id: 54, n: "Vélo", g: "Cardio", d: "Vélo stationnaire ou route.", pr: 0, prType: "duration" },
  { id: 55, n: "Rameur", g: "Cardio", d: "Rameur ergomètre.", pr: 0, prType: "duration" },
  { id: 56, n: "Corde à sauter", g: "Cardio", d: "Cardio et coordination.", pr: 0, prType: "duration" },
  { id: 57, n: "HIIT", g: "Cardio", d: "Intervalles haute intensité.", pr: 0, prType: "duration" },
  { id: 58, n: "Elliptique", g: "Cardio", d: "Machine elliptique.", pr: 0, prType: "duration" },
  { id: 59, n: "Natation", g: "Cardio", d: "Nage libre, dos, brasse.", pr: 0, prType: "duration" },
];

export const DEFAULT_PRESETS = [
  { id: 1, nom: "Push Day", ids: [1, 3, 6, 30, 31] },
  { id: 2, nom: "Pull Day", ids: [10, 12, 14, 25, 26] },
  { id: 3, nom: "Leg Day", ids: [35, 37, 38, 40, 43] },
];
