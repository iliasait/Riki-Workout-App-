# Journal de developpement - RIKI

## Informations generales
- **Projet** : RIKI - Application mobile de suivi de musculation
- **Stack technique** : React + Vite + Capacitor (Android)
- **Stockage** : localStorage (100% hors ligne)
- **Developpeur** : Ilias

---

## Phase 1 : Conception et architecture

### Choix techniques

J'ai opte pour React avec Vite comme bundler pour sa rapidite de build et son HMR performant. Pour la partie mobile, Capacitor a ete choisi plutot que React Native car il permet de reutiliser directement le code web dans une WebView Android sans avoir a reecrire les composants. Le stockage repose entierement sur localStorage, ce qui garantit un fonctionnement 100% hors ligne sans serveur backend.

### Structure du projet

L'application est organisee en composants principaux : `Dash.jsx` (tableau de bord), `ExoList.jsx` (bibliotheque d'exercices), `SePage.jsx` (page de seance en cours), `HistPage.jsx` (historique et calendrier), `StatsPage.jsx` (statistiques), et `Icons.jsx` (systeme d'icones SVG). L'etat global est centralise dans `App.jsx` avec des hooks `useState` et `useEffect` pour la persistance.

### Difficultes rencontrees

**Probleme** : La gestion de l'etat entre les nombreux composants devenait complexe avec beaucoup de props a passer (prop drilling).

**Solution** : J'ai centralise tous les etats principaux (exercices, historique, presets, planification) dans `App.jsx` et je les passe aux composants enfants via props. Bien qu'une solution comme Context API ou Zustand aurait ete plus elegante, cette approche reste simple et suffisante pour la taille du projet.

---

## Phase 2 : Fonctionnalites principales

### Systeme de seances

J'ai implemente un flux complet de seance : configuration (choix des exercices, repos, mode reps fixees ou a l'echec), enchainement des exercices avec timer de repos, et enregistrement automatique dans l'historique a la fin.

**Difficulte** : Gerer le timer de repos avec `setTimeout` dans React posait des problemes de references perimees (stale closures).

**Solution** : Utilisation de `useRef` pour stocker la reference du timeout et nettoyage systematique dans le `useEffect` via la fonction de cleanup (`return () => clearTimeout(tRef.current)`).

### Streak hebdomadaire

J'ai developpe un systeme de streak inspire de Duolingo : l'utilisateur fixe un objectif de seances par semaine, et l'application compte les semaines consecutives ou l'objectif est atteint.

**Difficulte** : Le calcul du streak devait parcourir l'historique semaine par semaine en remontant dans le temps, ce qui posait des problemes de performance a chaque re-render.

**Solution** : Encapsulation du calcul dans un `useMemo` avec les bonnes dependances (`hist`, `goal`, `monday.getTime()`), ce qui evite les recalculs inutiles.

### Gestion des dates locales

**Difficulte** : `new Date("2026-05-29")` en JavaScript interprete la chaine comme UTC, ce qui decalait les dates d'un jour selon le fuseau horaire.

**Solution** : Creation d'une fonction utilitaire `parseLocal(s)` qui decompose la chaine `"YYYY-MM-DD"` et utilise `new Date(year, month-1, day)` pour forcer l'interpretation en heure locale. Cette fonction est utilisee partout ou une date de l'historique est lue.

### Persistance des donnees

**Difficulte** : Les donnees devaient persister entre les sessions sans serveur. Certaines operations `localStorage.setItem` pouvaient echouer (mode prive, quota depasse).

**Solution** : Chaque appel a `localStorage` est encadre dans un bloc `try/catch` pour eviter les crashs. Les etats sont initialises avec une fonction de lecture du localStorage (`useState(() => { try { ... } catch { return defaultValue } })`).

---

## Phase 3 : Interface utilisateur et theme

### Theme clair / sombre

J'ai mis en place un systeme de theming avec des constantes de couleurs (`C.bg`, `C.t`, `C.gr`, etc.) definies dans `constants.js`. Un toggle dans le dashboard permet de basculer entre les deux themes.

**Difficulte** : Appliquer le theme dynamiquement a tous les composants sans CSS-in-JS ou CSS variables globales.

**Solution** : La fonction `applyTheme(theme)` modifie les valeurs de l'objet `C` (couleurs) selon le theme actif, et un `useMemo` dans `App.jsx` applique le changement a chaque modification. Le choix du theme est persiste dans localStorage.

### Icones SVG par groupe musculaire

J'ai remplace les icones generiques par 8 illustrations SVG detaillees representant chaque groupe musculaire (pectoraux, dos, epaules, biceps, triceps, jambes, abdominaux, avant-bras).

**Difficulte 1** : Les SVG sont des silhouettes noires (`fill="#000000"`). En mode sombre, elles etaient invisibles sur fond noir.

**Solution** : Utilisation de filtres CSS (`filter: brightness(0) saturate(100%) invert(...) sepia(...) hue-rotate(...)`) pour recolorier les SVG en vert (`#BEFF6C` en mode sombre, `#4CAF00` en mode clair). La detection du theme se fait via `C.bg === "#060606"`.

**Difficulte 2** : Certains SVG ont un ratio portrait (jambes, avant-bras) et d'autres un ratio paysage (pectoraux, dos, etc.), ce qui rendait le rendu inegal.

**Solution** : Creation d'un `Set` (`PORTRAIT_SVG`) listant les types portrait. Le composant `ExoSvg` applique des dimensions differentes selon le type : `width: portrait ? size : size*1.6` et `height: portrait ? size*1.2 : size`.

**Difficulte 3** : Les icones apparaissaient trop petites dans la liste et la page de detail.

**Solution** : Augmentation progressive des tailles de conteneurs (44px vers 58px dans la liste, 96px vers 120px dans le detail) et des tailles d'image, avec `overflow: hidden` sur les conteneurs pour eviter les debordements.

---

## Phase 4 : Experience utilisateur

### Sensibilite du swipe entre onglets

**Difficulte** : La navigation par swipe entre les onglets se declenchait trop facilement, provoquant des changements d'onglet involontaires lors du scroll vertical.

**Solution** : Augmentation des seuils : distance minimale de 100px a 150px et ratio horizontal/vertical de 1.8x a 2.5x (`Math.abs(diffX) > 150 && Math.abs(diffX) > Math.abs(diffY) * 2.5`).

### Toggle "Garder le poids"

**Difficulte** : Lors de l'enchainement des series, l'utilisateur devait ressaisir le poids a chaque fois, ce qui etait fastidieux quand le poids ne changeait pas.

**Solution** : Ajout d'un toggle "Garder le poids" dans la page de seance. Son etat est persiste dans localStorage (`riki_keepwt`). Quand il est actif, le champ poids n'est pas reinitialise apres chaque serie (`if(!keepWt) setWt("")`).

### Enregistrement de seances sur jours passes

**Difficulte** : Si l'utilisateur oubliait d'enregistrer une seance (par exemple celle de la veille), il n'avait aucun moyen de l'ajouter retroactivement. Le calendrier ne permettait d'interagir qu'avec les jours futurs ou le jour actuel.

**Solution** : Modification du composant `HistPage.jsx` pour rendre les jours passes cliquables dans le calendrier. Un panneau "Enregistrer le X" s'affiche avec les presets disponibles ou l'option "Seance libre". La seance est directement ajoutee a l'historique avec la date du jour selectionne, et elle est automatiquement prise en compte dans le calcul du streak et les statistiques du dashboard.

---

## Phase 5 : Build et deploiement

### Generation de l'APK

Le processus de build suit la chaine : `npm run build` (Vite genere le dossier `dist`), `npx cap sync` (copie les assets web dans le projet Android), puis `./gradlew assembleDebug` (compilation de l'APK Android).

**Difficulte** : L'APK construit sur la machine de developpement contenait les donnees de test dans le cache du WebView.

**Solution** : Le probleme ne venait pas de l'APK lui-meme mais de la reinstallation par-dessus une version existante. Android conserve les donnees applicatives (dont le localStorage du WebView) entre les mises a jour. La solution est de desinstaller l'ancienne version avant d'installer la nouvelle.

### Landing page

J'ai developpe une landing page statique en HTML/CSS/JS pur, comprenant : une section hero avec le logo et boutons de telechargement, un mockup interactif de l'application avec 4 onglets navigables, une grille de fonctionnalites, une section "Comment ca marche" en 3 etapes, une FAQ avec accordeon JavaScript, et des conditions d'utilisation dans une modale.

**Difficulte** : Reproduire fidelement l'interface de l'application dans le mockup de la landing page sans utiliser de framework.

**Solution** : Reproduction manuelle des styles CSS de l'app (couleurs, border-radius, typographie) dans le mockup HTML. Les onglets sont geres par des event listeners JavaScript qui basculent la visibilite des divs `.preview-screen`.

### Deploiement sur GitHub

**Difficulte** : Les fichiers volumineux (node_modules, builds Android, fichiers zip) alourdissaient le depot.

**Solution** : Creation d'un `.gitignore` excluant `node_modules/`, `dist/`, les fichiers `.zip`, les builds Gradle et le dossier `.gradle`. L'APK est distribue via les GitHub Releases plutot que dans le depot directement.

---

## Phase 6 : Revue de code et corrections

Apres l'ajout de la fonctionnalite d'enregistrement de seances sur jours passes, j'ai realise une revue complete du code afin d'identifier d'eventuels effets de bord. Deux bugs ont ete detectes et corriges.

### Bug 1 : Historique non trie par date

**Probleme** : Les seances sont stockees dans un tableau en ordre d'insertion (les nouvelles seances sont ajoutees en tete via `[nouvelle, ...hist]`). Tant que toutes les seances etaient enregistrees le jour meme, l'ordre d'insertion correspondait a l'ordre chronologique. Mais avec la nouvelle fonctionnalite, une seance enregistree pour une date passee etait inseree en tete du tableau et apparaissait donc en haut de la liste de l'historique, comme si elle etait la plus recente. La courbe d'evolution du volume dans les statistiques etait egalement faussee car elle reposait sur l'ordre du tableau.

**Solution** : Tri explicite par date au moment de l'affichage, sans modifier la structure de donnees stockee. Dans `HistPage.jsx`, la liste est triee par date decroissante (`.slice().sort((a,b) => b.date.localeCompare(a.date))`). Dans `StatsPage.jsx`, la courbe d'evolution est triee par date croissante avant de prendre les 12 dernieres seances. Le tri sur des chaines au format `YYYY-MM-DD` fonctionne directement avec une comparaison lexicographique.

### Bug 2 : Incoherence de fuseau horaire dans le calendrier

**Probleme** : Dans `HistPage.jsx`, la date du jour etait calculee avec `new Date().toISOString().slice(0,10)`, qui retourne la date en temps universel (UTC). Le reste de l'application utilise la date locale. En soiree, selon le decalage horaire, cette difference pouvait classer une date comme "future" ou "passee" de maniere incorrecte, ce qui affectait le comportement du calendrier (jour cliquable ou non, distinction entre programmer une seance future et enregistrer une seance passee).

**Solution** : Remplacement de `toISOString()` par un calcul de la date locale coherent avec le reste de l'application (`getFullYear()`, `getMonth()`, `getDate()` avec formatage manuel sur deux chiffres).

### Methode de verification

Les corrections ont ete validees en conditions reelles : injection de donnees de test contenant une seance back-datee inseree en derniere position, puis verification que l'historique s'affiche bien dans l'ordre chronologique decroissant, que l'enregistrement d'une seance sur un jour passe la positionne correctement dans la liste, et que les statistiques se calculent sans erreur. Aucune erreur console n'a ete relevee.

---

## Bilan technique

### Points forts
- Architecture simple et maintenable avec React hooks
- Fonctionnement 100% hors ligne grace a localStorage
- Interface responsive et fluide avec animations CSS
- Systeme de theming flexible (clair/sombre)

### Axes d'amelioration identifies
- Migration vers Context API ou Zustand pour reduire le prop drilling
- Ajout de tests unitaires et d'integration
- Implementation d'un export/import des donnees (backup)
- Publication sur le Google Play Store avec un APK signe
- Support iOS via Capacitor

### Outils et technologies utilises
- **React 18** : Composants fonctionnels et hooks
- **Vite 8** : Build et serveur de developpement
- **Capacitor 7** : Bridge web vers Android natif
- **Gradle** : Build de l'APK Android
- **Git / GitHub** : Versioning et distribution
- **CSS-in-JS (inline styles)** : Styling des composants
