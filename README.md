# RIKI - Ton coach de musculation

Application mobile de suivi de musculation, gratuite et 100% hors ligne.

## Fonctionnalites

- Seances personnalisees avec presets
- 50+ exercices avec illustrations par groupe musculaire
- Statistiques detaillees (volume, duree, records)
- Streak hebdomadaire (comme Duolingo, mais pour la muscu)
- Slot machine pour choisir un exercice au hasard
- Planification de seances
- Theme clair / sombre
- 100% offline, aucun compte requis

## Tech Stack

- **Frontend** : React + Vite
- **Mobile** : Capacitor (Android)
- **Donnees** : localStorage (tout reste sur le telephone)

## Installation

```bash
cd riki_project
npm install
npm run dev
```

## Build APK

```bash
npm run build
npx cap sync
cd android
./gradlew assembleDebug
```

L'APK se trouve dans `android/app/build/outputs/apk/debug/`.

## Telecharger

L'APK est disponible dans les [Releases](../../releases).

## Structure

```
riki_project/     # Code source React + Capacitor
riki_landing/     # Landing page statique
```

## Licence

Projet personnel. Tous droits reserves.
