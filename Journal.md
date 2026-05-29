# Journal de developpement - RIKI

## Informations generales
- **Projet** : RIKI, application mobile de suivi de musculation
- **Stack technique** : React + Vite + Capacitor (Android)
- **Stockage** : localStorage (fonctionnement 100% hors ligne)
- **Langage d'interface** : francais
- **Developpeur** : Ilias

Ce journal retrace l'integralite du developpement de l'application, dans l'ordre chronologique, en detaillant pour chaque etape les choix effectues, les difficultes rencontrees et les solutions apportees.

---

## Phase 1 : Conception et cahier des charges

Avant d'ecrire la moindre ligne de code, j'ai defini le besoin : une application de musculation simple, gratuite, sans compte ni connexion, qui permette de creer des seances, de les suivre en temps reel et de visualiser sa progression. L'idee directrice etait de m'inspirer de la mecanique de motivation de Duolingo (la serie hebdomadaire) en l'appliquant a la musculation.

J'ai redige un cahier des charges fixant les fonctionnalites attendues : bibliotheque d'exercices, creation de seances personnalisees, suivi des series en direct, statistiques, records personnels, planification, et une interface soignee en mode sombre.

### Choix techniques

J'ai opte pour React avec Vite comme outil de build, pour sa rapidite de compilation et son rechargement a chaud (HMR). Pour le portage mobile, j'ai choisi Capacitor plutot que React Native : Capacitor encapsule l'application web dans une WebView Android, ce qui permet de reutiliser directement tout le code React sans le reecrire. Le stockage repose entierement sur le localStorage du navigateur, ce qui garantit un fonctionnement hors ligne total et evite la mise en place d'un serveur et d'une base de donnees.

---

## Phase 2 : Mise en place du projet et architecture

J'ai initialise le projet avec Vite, puis structure l'application autour d'un composant racine `App.jsx` qui centralise l'etat, et de composants dedies a chaque ecran :
- `Dash.jsx` : le tableau de bord (accueil)
- `ExoList.jsx` : la bibliotheque d'exercices et les ecrans de creation
- `SePage.jsx` : le deroulement d'une seance
- `HistPage.jsx` : l'historique et le calendrier
- `StatsPage.jsx` : les statistiques
- `Onboarding.jsx` : l'ecran d'accueil au premier lancement
- `SlotMachine.jsx` : le tirage aleatoire d'exercice
- `Icons.jsx` : le systeme d'icones
- `constants.js` : le design system, les donnees initiales et les fonctions utilitaires

**Difficulte** : La gestion de l'etat entre de nombreux composants devenait complexe (transmission de proprietes en cascade, ou prop drilling).

**Solution** : J'ai centralise tous les etats principaux (exercices, historique, presets, planification, objectif, theme) dans `App.jsx`, et je les transmets aux composants enfants via les props. Une solution comme Context API ou Zustand aurait ete plus elegante, mais cette approche reste simple, lisible et suffisante pour la taille du projet.

---

## Phase 3 : Modele de donnees et persistance

J'ai defini les structures de donnees : un exercice possede un identifiant, un nom, un groupe musculaire, une description, un record personnel et un type de record (`weight`, `reps` ou `duration`). Une seance enregistree contient une date, une duree, des notes et la liste des exercices avec leurs series.

**Difficulte** : Les donnees doivent persister entre les sessions sans serveur, et certaines operations sur le localStorage peuvent echouer (navigation privee, quota depasse).

**Solution** : Chaque lecture et ecriture du localStorage est encadree par un bloc `try/catch` pour eviter tout plantage. Les etats React sont initialises paresseusement avec une fonction qui lit le localStorage et retourne une valeur par defaut en cas d'echec. Un `useEffect` par donnee assure la sauvegarde automatique a chaque modification.

**Difficulte** : En JavaScript, `new Date("2026-05-29")` interprete la chaine comme une date UTC, ce qui decale l'affichage d'un jour selon le fuseau horaire de l'utilisateur.

**Solution** : J'ai cree une fonction utilitaire `parseLocal` qui decoupe la chaine `"AAAA-MM-JJ"` et construit la date avec `new Date(annee, mois-1, jour)`, forcant ainsi une interpretation en heure locale. Cette fonction est utilisee partout ou une date de l'historique est lue.

---

## Phase 4 : Bibliotheque d'exercices

J'ai constitue une base de plus de 50 exercices repartis en dix groupes musculaires (pectoraux, dos, epaules, biceps, triceps, jambes, mollets, abdominaux, avant-bras, cardio). Chaque exercice porte un type de record adapte : charge en kilogrammes pour les exercices avec poids, repetitions pour les exercices au poids du corps, et duree pour le gainage et le cardio.

L'ecran `ExoList.jsx` propose une recherche par nom et un filtrage par groupe musculaire. Chaque exercice dispose d'une fiche detaillee presentant les muscles cibles et un conseil d'execution.

J'ai egalement ajoute la possibilite de creer ses propres exercices personnalises (nom, groupe, type de record, description) et de les supprimer.

---

## Phase 5 : Systeme de seances

J'ai implemente le coeur de l'application : le deroulement d'une seance. L'ecran de configuration permet de choisir les exercices, de regler le temps de repos, et de selectionner un mode (repetitions fixees ou serie a l'echec). Le deroulement enchaine ensuite les exercices, avec un minuteur de repos circulaire entre les series.

L'interface de saisie s'adapte au type d'exercice : champ poids et repetitions pour les exercices avec charge, champ repetitions seul pour le poids du corps, et chronometre pour les exercices isometriques (gainage).

**Difficulte** : La gestion du minuteur de repos avec `setTimeout` dans React provoquait des problemes de references perimees (stale closures), le compte a rebours se comportant de maniere incorrecte.

**Solution** : J'ai utilise `useRef` pour conserver la reference du minuteur et un `useEffect` avec fonction de nettoyage (`clearTimeout`) pour garantir un decompte fiable et eviter les fuites.

---

## Phase 6 : Historique et detection des records

A la fin d'une seance, celle-ci est enregistree automatiquement dans l'historique avec sa date locale. L'ecran `HistPage.jsx` affiche la liste des seances passees, et chaque seance peut etre ouverte pour consulter le detail des exercices et series.

J'ai mis en place la detection automatique des records personnels : a chaque serie validee, si la performance depasse le record actuel de l'exercice, le record est mis a jour (en kilogrammes, en repetitions ou en duree selon le type).

---

## Phase 7 : Statistiques

L'ecran `StatsPage.jsx` agrege les donnees de l'historique pour donner une vue d'ensemble de la progression : nombre de seances, volume total souleve, duree moyenne, nombre de records. Il propose egalement un graphique du volume quotidien de la semaine, une repartition du volume par groupe musculaire, un classement des records personnels, et une courbe d'evolution du volume sur les douze dernieres seances.

Les graphiques sont dessines en SVG, sans bibliotheque externe, pour rester leger.

---

## Phase 8 : Serie hebdomadaire (streak) et objectif

Inspire de Duolingo, j'ai developpe un systeme de serie : l'utilisateur fixe un objectif de seances par semaine, et l'application compte le nombre de semaines consecutives ou cet objectif a ete atteint. Le tableau de bord affiche cette serie, l'avancement de la semaine en cours sous forme d'anneau de progression, et un calendrier de la semaine.

**Difficulte** : Le calcul de la serie doit parcourir l'historique semaine par semaine en remontant dans le temps, ce qui pouvait etre recalcule inutilement a chaque rendu.

**Solution** : J'ai encapsule ce calcul dans un `useMemo` avec les bonnes dependances, ce qui evite les recalculs superflus. (Ce calcul a ensuite revele un bug subtil, corrige lors de la phase de revue ; voir plus bas.)

---

## Phase 9 : Planification et calendrier

J'ai ajoute un calendrier mensuel dans l'historique, qui distingue visuellement les jours avec seance, les jours planifies et le jour courant. L'utilisateur peut programmer une seance future en lui associant un preset, et retrouver ses seances a venir directement sur le tableau de bord.

---

## Phase 10 : Presets et tirage aleatoire

Pour accelerer le lancement d'une seance, j'ai ajoute des presets (modeles de seance), avec trois presets fournis par defaut (Push Day, Pull Day, Leg Day) et la possibilite d'en creer et d'en supprimer.

J'ai egalement developpe une "machine a sous" (`SlotMachine.jsx`) : un tirage aleatoire anime qui propose un exercice au hasard quand on manque d'inspiration, puis permet de l'ajouter directement a la seance.

---

## Phase 11 : Premier lancement (onboarding)

J'ai cree un ecran d'accueil affiche uniquement au premier lancement : presentation de l'application, puis choix de l'objectif hebdomadaire. L'etat "onboarded" est conserve dans le localStorage pour ne plus reafficher cet ecran ensuite.

---

## Phase 12 : Interface et design

### Theme clair et sombre

J'ai concu un design system centralise dans `constants.js` (palette de couleurs, polices, styles de cartes). Un bouton sur le tableau de bord bascule entre mode sombre (par defaut) et mode clair.

**Difficulte** : Appliquer le theme dynamiquement a toute l'application sans recourir a une bibliotheque de CSS-in-JS.

**Solution** : Une fonction `applyTheme` remplace les valeurs de l'objet de couleurs selon le theme, et un `useMemo` dans `App.jsx` declenche l'application a chaque changement. Le theme choisi est persiste.

### Icones par groupe musculaire

J'ai remplace les icones generiques par huit illustrations SVG representant chaque groupe musculaire.

**Difficulte** : Les SVG sont des silhouettes noires. En mode sombre, elles etaient invisibles sur fond noir.

**Solution** : J'ai applique des filtres CSS pour recolorier les SVG en vert, avec des valeurs de filtre differentes selon le theme (la detection se fait sur la couleur de fond courante).

**Difficulte** : Certains SVG sont au format portrait, d'autres au format paysage, ce qui rendait le rendu inegal.

**Solution** : J'ai liste les types portrait dans un `Set` et applique des dimensions adaptees a chaque orientation dans le composant `ExoSvg`.

**Difficulte** : Les icones apparaissaient trop petites dans la liste et la fiche detaillee.

**Solution** : J'ai agrandi les conteneurs et les images, en ajoutant un `overflow: hidden` pour eviter les debordements.

### Finitions visuelles

J'ai ajoute des animations de transition (apparition, glissement entre onglets), une texture de grain subtile, et travaille la coherence typographique (polices Urbanist et Outfit).

---

## Phase 13 : Experience utilisateur

### Sensibilite du balayage entre onglets

**Difficulte** : La navigation par balayage (swipe) entre les onglets se declenchait trop facilement, provoquant des changements d'onglet involontaires pendant le defilement vertical.

**Solution** : J'ai augmente les seuils de declenchement (distance horizontale minimale portee a 150 pixels, et ratio horizontal/vertical exige porte a 2,5) pour ne reagir qu'a un balayage horizontal franc.

### Conserver le poids entre les series

**Difficulte** : Lors de l'enchainement des series, l'utilisateur devait ressaisir le poids a chaque fois, ce qui etait fastidieux quand la charge ne changeait pas.

**Solution** : J'ai ajoute un interrupteur "Garder le poids" sur l'ecran de seance, dont l'etat est persiste. Quand il est actif, le champ poids n'est pas vide apres chaque serie.

### Enregistrer une seance sur un jour passe

**Difficulte** : Si l'utilisateur oubliait d'enregistrer une seance (par exemple celle de la veille), il n'avait aucun moyen de l'ajouter apres coup.

**Solution** : J'ai rendu les jours passes cliquables dans le calendrier. Un panneau permet d'enregistrer une seance sur le jour choisi a partir d'un preset ou en seance libre. La seance est alors prise en compte dans l'historique, la serie et les statistiques.

---

## Phase 14 : Portage mobile et generation de l'APK

J'ai integre Capacitor pour generer une application Android. La chaine de production suit trois etapes : `npm run build` (Vite produit le dossier `dist`), `npx cap sync` (copie des fichiers web dans le projet Android), puis `./gradlew assembleDebug` (compilation de l'APK).

**Difficulte** : Apres reinstallation de l'APK, des donnees de test semblaient persister.

**Solution** : Le probleme ne venait pas de l'APK mais d'Android, qui conserve les donnees applicatives (dont le localStorage de la WebView) entre deux mises a jour. La solution est de desinstaller l'ancienne version avant d'installer la nouvelle.

---

## Phase 15 : Page de presentation (landing page)

J'ai developpe une page web de presentation statique, en HTML/CSS/JavaScript pur, destinee a heberger le telechargement de l'APK. Elle comprend une section d'accroche avec le logo, un apercu interactif de l'application a quatre onglets, une liste de fonctionnalites, une section "comment ca marche", une foire aux questions a accordeon, des conditions d'utilisation dans une fenetre modale, et un pied de page.

**Difficulte** : Reproduire fidelement l'interface de l'application dans l'apercu, sans framework.

**Solution** : J'ai reproduit manuellement les styles de l'application (couleurs, arrondis, typographie) et gere la navigation entre les ecrans d'apercu avec de simples ecouteurs d'evenements JavaScript.

---

## Phase 16 : Mise en ligne et versionnage

J'ai publie le projet sur GitHub.

**Difficulte** : Les fichiers volumineux (dependances `node_modules`, builds Android, archives) alourdissaient inutilement le depot.

**Solution** : J'ai cree un fichier `.gitignore` excluant ces elements, et distribue l'APK via les Releases de GitHub plutot que dans le depot. L'APK est egalement reference par la page de presentation pour le telechargement.

---

## Phase 17 : Revue de code et corrections

Une fois l'ensemble des fonctionnalites en place, j'ai mene une revue complete du code et des tests de parcours utilisateur dans le navigateur, afin de detecter d'eventuels defauts. Cinq bugs et une amelioration ont decoule de cette phase.

### Bug 1 : Historique non trie par date

**Probleme** : Les seances sont stockees dans un tableau en ordre d'insertion. Tant que toutes etaient enregistrees le jour meme, l'ordre d'insertion correspondait a l'ordre chronologique. Mais avec l'enregistrement de seances sur jours passes, une seance datee dans le passe etait inseree en tete et apparaissait donc en haut de la liste, comme si elle etait la plus recente. La courbe d'evolution des statistiques etait egalement faussee.

**Solution** : Tri explicite par date au moment de l'affichage, sans modifier les donnees stockees. La liste est triee par date decroissante, la courbe d'evolution par date croissante. Le format `AAAA-MM-JJ` permet une comparaison lexicographique directe.

### Bug 2 : Incoherence de fuseau horaire dans le calendrier

**Probleme** : La date du jour etait calculee avec `toISOString()`, qui retourne une date en temps universel (UTC), alors que le reste de l'application utilise la date locale. En soiree, selon le decalage horaire, un jour pouvait etre classe a tort comme futur ou passe.

**Solution** : Remplacement par un calcul de la date locale, coherent avec le reste de l'application.

### Bug 3 : Compteur de records hebdomadaires fige a zero

**Probleme** : Sur le tableau de bord, la tuile "Records" de la semaine affichait toujours zero, la valeur etant restee codee en dur a l'etat de placeholder. Cela contredisait la page de statistiques.

**Solution** : Calcul effectif du nombre de records battus dans la semaine, en verifiant pour chaque exercice si une serie de la semaine atteint son record actuel. Le calcul est protege contre l'absence de donnees.

### Bug 4 : Calcul de la serie errone aux frontieres de mois (risque de blocage)

**Probleme** : Le calcul de la serie reculait d'une semaine via une operation basee sur le numero du jour dans le mois. Lorsqu'une semaine etait a cheval sur deux mois, ce calcul faisait bondir la date en avant au lieu de reculer, ce qui faussait le comptage et, surtout, pouvait provoquer une boucle infinie (blocage de l'application) lorsque plusieurs semaines consecutives traversaient un changement de mois.

**Solution** : Reecriture du calcul. Les seances sont regroupees par debut de semaine (lundi a minuit, en timestamp), et le parcours recule de sept jours fixes a chaque iteration, ce qui gere correctement les changements de mois et d'annee. Une borne de securite (520 iterations) garantit l'absence de boucle infinie. Valide avec un scenario de dix semaines traversant la frontiere mars/avril, et un scenario avec interruption.

### Bug 5 : Abandon de seance sans sauvegarde du travail effectue

**Probleme** : En arretant une seance en cours, les records etaient conserves (ecrits immediatement a chaque serie), mais les series realisees n'etaient pas enregistrees dans l'historique. Un record pouvait donc exister sans seance correspondante, et le volume realise etait perdu.

**Solution** : La logique de sauvegarde a ete factorisee dans une fonction unique, utilisee aussi bien pour terminer que pour arreter une seance. A l'arret, les series deja validees sont enregistrees (seuls les exercices comportant au moins une serie sont conserves). Le bouton a ete renomme d'"Abandonner" en "Arreter" pour refleter ce comportement.

### Amelioration : prise en compte du poids de corps dans le volume

**Constat** : Les exercices au poids du corps (pompes, tractions, dips, abdominaux) n'ajoutaient rien au volume, calcule en kilogrammes. Or le pratiquant deplace bien la masse de son corps a chaque repetition.

**Solution** : Ajout d'un champ "poids de corps" (saisi a l'onboarding, optionnel, et modifiable depuis les reglages). Le volume des exercices au poids du corps est desormais estime comme poids de corps multiplie par le nombre de repetitions. Les exercices avec charge conservent leur calcul, le cardio et le gainage restent a zero. Le type de chaque exercice est stocke dans l'historique pour fiabiliser le calcul. En l'absence de poids renseigne, ces exercices comptent pour zero, sans erreur. L'affichage du detail distingue les series au poids du corps (en repetitions) des series avec charge (en kilogrammes).

### Methode de verification

Les corrections ont ete validees en conditions reelles dans le navigateur, en simulant des parcours complets : creation d'objectif et de poids de corps a l'onboarding, lancement d'une seance via un preset, saisie des series avec maintien du poids, gestion du repos, arret et fin de seance, enregistrement sur jours passes, tirage aleatoire, creation et suppression d'exercices personnalises. J'ai verifie la coherence des donnees entre le tableau de bord, l'historique et les statistiques, le tri par date, le calcul de la serie aux frontieres de mois, la prise en compte du poids de corps dans le volume, et le bon fonctionnement du theme clair et sombre. Aucune erreur n'a ete relevee dans la console durant l'ensemble des tests. La page de presentation a egalement ete testee (accessibilite de l'APK, onglets d'apercu, foire aux questions, fenetre modale).

---

## Bilan technique

### Points forts
- Architecture simple et maintenable a base de hooks React
- Fonctionnement entierement hors ligne grace au localStorage
- Interface soignee, responsive et animee, avec theme clair et sombre
- Couverture fonctionnelle large : seances, presets, statistiques, serie, planification, records, exercices personnalises

### Limitation connue
Pendant une seance, il n'est pas possible de passer a l'exercice suivant sans avoir valide toutes les series prevues. Pour faire moins de series, l'utilisateur doit soit completer le nombre prevu, soit arreter la seance (le travail effectue est alors conserve). Ce comportement releve d'un choix de conception incitant a respecter le programme, mais l'ajout d'un bouton pour passer un exercice constitue un axe d'amelioration.

De plus, l'estimation du volume au poids du corps utilise le poids complet a chaque repetition, alors que certains mouvements n'en sollicitent qu'une fraction. Un coefficient par exercice pourrait affiner ce calcul.

### Axes d'amelioration
- Migration vers Context API ou un gestionnaire d'etat pour reduire la transmission de proprietes en cascade
- Ajout de tests automatises
- Export et import des donnees (sauvegarde)
- Publication sur le Google Play Store avec un APK signe
- Support iOS via Capacitor

### Technologies utilisees
- React (composants fonctionnels et hooks)
- Vite (build et serveur de developpement)
- Capacitor (portage Android)
- Gradle (compilation de l'APK)
- Git et GitHub (versionnage et distribution)
- HTML, CSS et JavaScript pur (page de presentation)
