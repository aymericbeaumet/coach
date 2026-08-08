# Coach

PWA minimaliste (sans framework — HTML/CSS/JS) qui affiche **la séance du jour** :
kettlebell (rotation **A → B → C**) suivi des étirements (rotation **J1 → J2 → J3 → J4**),
le tout de façon déterministe.

- **Rotations** : le 8 août 2026 = Jour A & J1. Chaque jour civil avance d'un cran
  (`app.js`). Aucune configuration, aucun serveur.
- **Écran d'accueil** : deux sections (Kettlebell + Étirements) avec l'aperçu du jour,
  puis un bouton *Commencer*.
- **Format court** : chaque exercice est un écran plein avec sa vidéo d'exemple
  (lecture au tap). On **glisse verticalement** pour naviguer.
- **Compteur de séries** : le badge en bas se tape pour décompter jusqu'à 0 ;
  à 0 l'exercice passe automatiquement au suivant. Un message de fin clôt la séance.
- **Sans état** : rafraîchir la page redémarre la séance depuis le début.
- **Installable** sur iPhone : Partager → « Sur l'écran d'accueil ».
- **Hors-ligne** : l'app shell est mise en cache par le service worker (`sw.js`).
  Les vidéos YouTube nécessitent une connexion.

## Le programme

Kettlebell :
- **Jour A — charnière + poussée** : swings, rowing australien, goblet squat, pompes, floor press, carry asymétrique.
- **Jour B — jambes + dos** : turkish get-up, split squat bulgare, SDT roumain unilatéral, rowing un bras, pullover, gainage latéral.
- **Jour C — récup active** : get-up, pullover, halos, carries, mobilité hanches/épaules.

Étirements (Base tous les jours + le bloc du jour J1→J4) : chaîne postérieure, hanches,
dos/thoracique, chevilles/épaules.

Modifier le programme ou les vidéos : éditer les objets `PROGRAM` et `STRETCH` dans
[`app.js`](app.js). Chaque exercice a un `video` (ID YouTube embarquable).

> Vidéos : YouTube exige depuis fin 2025 un referrer valide, sinon « Error 153 ».
> L'iframe est donc créé avec `referrerpolicy="strict-origin-when-cross-origin"`
> (+ `<meta name="referrer">`).

## Icônes

Générées sans dépendance par [`tools/gen-icons.mjs`](tools/gen-icons.mjs) :

```sh
node tools/gen-icons.mjs
```

## Déploiement

GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`) à chaque push sur `main`.
Domaine : <https://coach.aymericbeaumet.com> (fichier `CNAME`).
