# Coach

PWA minimaliste (sans framework — HTML/CSS/JS) qui affiche **la séance du jour** :
un échauffement commun suivi du programme kettlebell en rotation **A → B → C → D**,
le tout de façon déterministe.

- **Rotations** : le 11 août 2026 = Jour A. Chaque jour civil avance d'un cran
  (`program.js`). Aucun serveur applicatif.
- **Écran d'accueil** : deux sections (Échauffement + Séance) avec l'aperçu du jour
  regroupé par blocs, une estimation de durée et d'heure de fin, puis un bouton
  *Commencer*.
- **Format court** : chaque exercice est un écran plein avec sa vidéo d'exemple
  (autoplay avec son + boucle ; lecteur YouTube épuré). On **glisse verticalement**
  pour naviguer ; sur ordinateur, toute la page capte le défilement, y compris la vidéo.
- **Compteur de séries** : le badge centré en bas se tape pour décompter jusqu'à 0 ;
  à 0 l'exercice passe automatiquement au suivant. Un message de fin clôt la séance.
- **Chrono** : sur les exercices en secondes, un minuteur en haut à droite peut être
  lancé ; à 0 il décrémente le compteur de séries (usage optionnel).
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

Ouvrir `index.html` en `file://` ne fonctionne pas (le service worker et les vidéos
YouTube exigent une vraie origine http). Lancer un petit serveur :

```sh
./serve.sh          # http://localhost:8000
```

## Logo et icônes

Le master généré est [`icons/logo-source.png`](icons/logo-source.png). Les favicons et
icônes PWA sont dérivés avec `sips` (inclus dans macOS) :

```sh
node tools/gen-icons.mjs
```

## Déploiement

GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`) à chaque push sur `main`.
Domaine : <https://coach.aymericbeaumet.com> (fichier `CNAME`).
