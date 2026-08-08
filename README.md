# Kettlebell

PWA minimaliste (sans framework — HTML/CSS/JS) qui affiche **la séance du jour**
d'un programme kettlebell qui tourne en **A → B → C → A …** de façon déterministe.

- **Rotation** : le 8 août 2026 = Jour A. Chaque jour civil avance d'un cran
  (`app.js` → `dayLetter`). Aucune configuration, aucun serveur.
- **Format court** : on appuie sur *Commencer*, puis chaque exercice est un écran
  plein — vidéo d'exemple en lecture auto/boucle (muette, on peut activer le son),
  on **glisse verticalement** pour passer au suivant. Mobile-first, identique sur desktop.
- **Suivi de séance** : chaque série se coche d'un tap (mémorisé pour la journée).
- **Installable** sur iPhone : Partager → « Sur l'écran d'accueil ».
- **Hors-ligne** : l'app shell est mise en cache par le service worker (`sw.js`).
  Les vidéos YouTube nécessitent une connexion.

## Le programme

- **Jour A — charnière + poussée** : swings, rowing australien, goblet squat, pompes, floor press, carry asymétrique.
- **Jour B — jambes + dos** : turkish get-up, split squat bulgare, SDT roumain unilatéral, rowing un bras, pullover, gainage latéral.
- **Jour C — récup active (15 min)** : get-up, pullover, halos, carries, mobilité hanches/épaules.

Modifier le programme ou les vidéos : éditer l'objet `PROGRAM` dans [`app.js`](app.js).
Chaque exercice a un `video` (ID YouTube) et un `q` (requête de secours).

## Icônes

Générées sans dépendance par [`tools/gen-icons.mjs`](tools/gen-icons.mjs) :

```sh
node tools/gen-icons.mjs
```

## Déploiement

GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`) à chaque push sur `main`.
Domaine : <https://kettlebell.aymericbeaumet.com> (fichier `CNAME`).
