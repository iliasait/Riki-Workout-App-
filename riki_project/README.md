# RIKI — Application de suivi de musculation & cardio

## Contenu du ZIP

- `App.jsx` — Prototype React interactif (ouvrir dans Claude artifacts)
- `logo_riki.png` — Logo officiel
- `cdc_riki.pdf` — Cahier des charges
- `rapport_riki.pdf` — Rapport de projet (~80 pages)
- `README.md` — Ce fichier

## Prototype (App.jsx)

Ouvrir dans l'interface Claude (artifact React) pour tester.

### Fonctionnalités
- Dashboard avec logo, streak Duolingo, anneau progression, presets
- 31 exercices (muscu + cardio) avec illustrations SVG
- Séance guidée : config → workout exo par exo → timer repos circulaire
- PR par type : poids (kg), répétitions, durée (isométrique)
- Historique liste + calendrier, copie de séance, Voir +
- Stats : volume, répartition par groupe, leaderboard PR filtrable
- Slot machine verticale, création exo/preset
- Swipe entre pages, navigation prioritaire sur overlays
- Thème sombre #0A0A0A + accents vert/lime #B2FF59

## Code React Native (production)

### Stack prévue
- React Native CLI
- react-native-sqlite-storage
- React Navigation 6
- react-native-svg
- react-native-reanimated
- react-native-localize + i18next

### Structure
```
src/
├── screens/        # Dashboard, Exercices, Seance, Historique, Stats
├── components/     # NavBar, ExoCard, Timer, SlotMachine, StatCard
├── services/       # DatabaseService, StatsService, StreakService
├── models/         # Exercice, Serie, Seance, Programme
├── navigation/     # TabNavigator + StackNavigator
├── i18n/           # fr.json, en.json
├── theme/          # colors.js, typography.js
└── assets/         # logo, SVG illustrations
```

### Build APK
```bash
npx react-native init RikiApp
cd RikiApp
# Copier le code source dans src/
cd android && ./gradlew assembleRelease
```

## Auteur
Ilias AIT — L3 Informatique, IED Paris 8 — 2025-2026
