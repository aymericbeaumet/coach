# Coach+

PWA minimaliste (sans framework — HTML/CSS/JS) qui affiche **la séance du jour** :
un échauffement commun suivi du programme kettlebell en rotation **A → B → C → D**,
le tout de façon déterministe.

- **Rotations** : le 11 août 2026 = Jour A. Chaque jour civil avance d'un cran
  (`program.js`). Aucun serveur applicatif.
- **Écran d'accueil** : deux sections (Échauffement + Séance) avec l'aperçu du jour
  regroupé par blocs, une estimation de durée et d'heure de fin, puis un bouton
  *Commencer*. L'accueil s'adapte à la hauteur disponible et reste verrouillé jusqu'au clic.
- **Format court** : chaque exercice est un écran plein avec sa vidéo d'exemple
  (autoplay avec son + boucle ; seule l'image vidéo est visible). On **glisse verticalement**
  pour naviguer ; sur ordinateur, toute la page capte le défilement, y compris la vidéo.
- **Progression** : une barre orange de 3 px, tout en haut de l'écran, avance avec
  chaque passage de la séance.
- **Tours guidés** : les triplets et flows sont déroulés dans leur ordre réel
  (mouvement 1 → mouvement 2 → mobilité → tour suivant). Chaque côté a son propre
  écran ; le tour courant et le côté à travailler sont toujours affichés, sans
  transition à mémoriser.
- **Validation** : le bouton du bas valide le passage courant et avance automatiquement
  vers le mouvement suivant. Un message de fin clôt la séance.
- **Chrono** : sur les exercices en secondes, un minuteur en bas à droite peut être
  lancé ; à 0 il valide le passage et avance (usage optionnel).
- **Sans état** : rafraîchir la page redémarre la séance depuis le début.
- **Installable** sur iPhone : Partager → « Sur l'écran d'accueil ».
- **Plein écran mobile** : fond bord à bord sous l'encoche et l'indicateur d'accueil,
  avec les commandes maintenues dans les zones sûres en portrait et paysage.
- **Hors-ligne** : l'app shell est mise en cache par le service worker (`sw.js`).
  Les vidéos YouTube nécessitent une connexion.

## Le programme

Chaque jour commence par `WARMUP`, puis :

- **Jour A — poussée + charnière** : swings, pompes, gainage, isométrie et mobilité thoracique.
- **Jour B — tirage + squat** : tractions, split squat, rowing et mobilité des hanches.
- **Jour C — vertical + gainage suspendu** : get-up, développé, gainage et mobilité.
- **Jour D — mobilité longue** : flow chargé et tenues longues.

Tout le programme se modifie dans [`program.js`](program.js), un module de configuration
lisible sans la verbosité du JSON. `WARMUP` contient l'échauffement commun et `PROGRAM`
les jours A/B/C/D. Chaque exercice a un `video` (l'ID YouTube), peut avoir `start` / `end`
pour retirer une intro ou une conclusion, et un `block` pour regrouper les exercices.
Les `estimatedMinutes` alimentent l'estimation affichée sur l'accueil.

Les vidéos montrent directement le mouvement ; `start` / `end` permettent de rogner
les démonstrations qui contiennent une introduction ou une conclusion.

> Vidéos : YouTube exige depuis fin 2025 un referrer valide, sinon « Error 153 ».
> L'iframe est donc créé avec `referrerpolicy="strict-origin-when-cross-origin"`
> (+ `<meta name="referrer">`).

## Développement local

Installer les dépendances puis lancer le serveur Vite avec rechargement automatique :

```sh
npm install
npm run dev         # http://localhost:5173
```

Le serveur écoute aussi sur le réseau local pour tester la PWA depuis un téléphone.
En développement, les anciens service workers sont automatiquement désinscrits afin
qu'ils n'interfèrent pas avec le rechargement à chaud.

Pour vérifier la version statique de production :

```sh
npm run build
npm run preview
```

Le déploiement GitHub Pages continue à publier directement les fichiers source du
dépôt ; `dist/` sert uniquement à vérifier localement que Vite compile correctement.

`./serve.sh` reste disponible comme serveur statique minimal, sans rechargement.

## Logo et icônes

Le master généré est [`icons/logo-source.png`](icons/logo-source.png). Les favicons et
icônes PWA sont dérivés avec `sips` (inclus dans macOS) :

```sh
node tools/gen-icons.mjs
```

## Déploiement

GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`) à chaque push sur `main`.
Domaine : <https://coach.aymericbeaumet.com> (fichier `CNAME`).
