/*
 * Programme Coach — le seul fichier à modifier pour changer les séances.
 *
 * video : identifiant YouTube (la partie après ?v= dans l'URL)
 * start / end : secondes facultatives pour ne garder que la démonstration
 * estimatedMinutes : durée totale approximative du bloc
 * block : intitulé du groupe d'exercices (à enchaîner en tours quand c'est indiqué)
 *
 * Déroulé d'une journée : WARMUP puis PROGRAM[jour du cycle]
 * Budget : 20 min par jour, échauffement compris.
 *
 * STRUCTURE — aucun temps mort.
 * Chaque bloc est un triplet enchaîné sans pause : deux exercices qui ne se
 * gênent pas (haut / bas, pousser / tirer) plus une mobilité qui tient lieu de
 * récupération. On passe d'un exercice au suivant sans s'arrêter, puis on
 * recommence le tour. Chaque exercice retrouve donc 60 à 90 s avant sa série
 * suivante — le vrai repos d'un travail de force — mais ce temps est occupé.
 * « on change de côté à chaque tour » : tour 1 à droite, tour 2 à gauche, etc.
 *
 * Boucle A → B → C → D → A → … prévue pour être faite tous les jours.
 * Un jour sauté ne casse rien : on reprend simplement la séance suivante.
 * Trois règles qui rendent le quotidien tenable :
 *   1. Peu de reps, jamais jusqu'à l'échec — on cherche la force, pas le volume.
 *   2. Chaque jour un schéma différent : 72 h avant de revenir sur le même.
 *   3. Le jour D est volontairement léger. C'est la soupape du système.
 */

export const ROTATION = {
  reference: '2026-08-11', // Ce jour-là : séance A
  kettlebell: ['A', 'B', 'C', 'D'],
};

export const WARMUP = {
  title: 'Échauffement',
  accent: '#a78bfa',
  estimatedMinutes: 3,
  exercises: [
    { name: 'Halos', weight: '6 kg', reps: '10 tours / côté', detail: 'lent', sets: 2, video: 'wJcmanVh5EE' },
    { name: 'Chat-vache', weight: '', reps: '8 reps', detail: 'très lentes, vertèbre par vertèbre', sets: 1, video: 'r43PNCct6Yw' },
    { name: 'Suspension passive à la barre', weight: 'Poids du corps', reps: '45 sec', detail: 'on relâche tout — épaules aux oreilles, dos qui s\'allonge', sets: 1, seconds: 45, video: '2vspW4N4BMs' },
    { name: 'Squat profond tenu', weight: '', reps: '45 sec', detail: 'talons au sol', sets: 1, seconds: 45, video: 'D3zYzIlbjXM' },
  ],
};

export const PROGRAM = {
  A: {
    title: 'Poussée + charnière',
    accent: '#f97316',
    estimatedMinutes: 17,
    exercises: [
      { block: 'Triplet 1 — 4 tours enchaînés', name: 'Swings 2 mains', weight: '12 kg', reps: '4 × 12 reps', detail: 'explosif, tout part des hanches — on s\'arrête net quand la forme baisse', sets: 4, video: '1cVT3ee9mgU' },
      { block: 'Triplet 1 — 4 tours enchaînés', name: 'Pompes lentes', weight: 'Poids du corps', reps: '4 × 5 reps', detail: '3 s de descente — pieds surélevés dès que les 5 reps sont faciles', sets: 4, video: 'WDIpL0pjun0' },
      { block: 'Triplet 1 — 4 tours enchaînés', name: 'Extension thoracique sur serviette', weight: '', reps: '45 sec', detail: 'serviette sous les omoplates — c\'est la récupération du triplet', sets: 4, seconds: 45, video: 'VO0Cjl2lsho' },
      { block: 'Triplet 2 — 4 tours enchaînés', name: 'Dead bug lesté', weight: '6 kg', reps: '4 × 5 reps / côté', detail: 'kettlebell bras tendus au-dessus de la poitrine, lombaire collé au sol', sets: 4, video: 'xtTIb6dC-vI' },
      { block: 'Triplet 2 — 4 tours enchaînés', name: 'Isométrie pompe', weight: 'Poids du corps', reps: '4 × 30 sec', detail: 'coudes à 90° — le tendon', sets: 4, seconds: 30, video: 'Jv2hgtdfcC8' },
      { block: 'Triplet 2 — 4 tours enchaînés', name: 'Jefferson curl', weight: '6 kg', reps: '2 reps par tour', detail: 'ultra-lentes, vertèbre par vertèbre', sets: 4, video: 'YGlAdtSKQaU' },
    ],
  },
  B: {
    title: 'Tirage + squat',
    accent: '#38bdf8',
    estimatedMinutes: 17,
    exercises: [
      { block: 'Triplet 1 — 4 tours enchaînés', name: 'Traction', weight: 'Poids du corps', reps: '4 × 3 reps', detail: '3 reps propres, jamais plus — si la traction ne vient pas : négative de 5 s', sets: 4, video: 'DGSm56-FixA' },
      { block: 'Triplet 1 — 4 tours enchaînés', name: 'Split squat bulgare', weight: '12 kg', reps: '4 × 6 reps / côté', detail: 'pied arrière sur une chaise, descente lente', sets: 4, video: 'vgn7bSXkgkA' },
      { block: 'Triplet 1 — 4 tours enchaînés', name: 'Pigeon', weight: '', reps: '45 sec (on change de côté à chaque tour)', detail: 'c\'est la récupération du triplet', sets: 4, seconds: 45, video: '1o7awuDGzag' },
      { block: 'Triplet 2 — 4 tours enchaînés', name: 'Rowing australien', weight: 'Poids du corps', reps: '4 × 8 reps', detail: 'sous une table, corps gainé, 2 s de tenue en haut', sets: 4, video: 'KOaCM1HMwU0' },
      { block: 'Triplet 2 — 4 tours enchaînés', name: 'Planche latérale', weight: 'Poids du corps', reps: '30 sec (on change de côté à chaque tour)', detail: 'hanche haute, épaules et bassin alignés', sets: 4, seconds: 30, video: '0M-erHBl48U' },
      { block: 'Triplet 2 — 4 tours enchaînés', name: '90/90 assis', weight: '', reps: '45 sec (on change de côté à chaque tour)', detail: 'c\'est la récupération du triplet', sets: 4, seconds: 45, video: 'm51AZSXMvEA' },
    ],
  },
  C: {
    title: 'Vertical + gainage suspendu',
    accent: '#34d399',
    estimatedMinutes: 17,
    exercises: [
      { block: 'Triplet 1 — 4 tours enchaînés', name: 'Turkish get-up', weight: '12 kg', reps: '1 rep (on change de côté à chaque tour)', detail: 'très lent, chaque position tenue 2 s', sets: 4, video: 'sgd8n917Zv0' },
      { block: 'Triplet 1 — 4 tours enchaînés', name: 'Hollow hold', weight: 'Poids du corps', reps: '4 × 25 sec', detail: 'lombaire collé au sol', sets: 4, seconds: 25, video: 'ytenqCqCIyU' },
      { block: 'Triplet 1 — 4 tours enchaînés', name: 'Livre ouvert', weight: '', reps: '6 reps (on change de côté à chaque tour)', detail: 'couché sur le côté — c\'est la récupération du triplet', sets: 4, video: 'EHZJns1bXPM' },
      { block: 'Triplet 2 — 4 tours enchaînés', name: 'Développé un bras à demi-genou', weight: '12 kg', reps: '4 × 5 reps / côté', detail: 'genou au sol côté charge, côtes basses, aucune cambrure', sets: 4, video: 'UADDmT2rBCc' },
      { block: 'Triplet 2 — 4 tours enchaînés', name: 'Relevé de genoux suspendu', weight: 'Poids du corps', reps: '4 × 6 reps', detail: 'sans balancer — montée lente, descente encore plus lente', sets: 4, video: 'G6a5267YpHM' },
      { block: 'Triplet 2 — 4 tours enchaînés', name: 'Dorsiflexion cheville genou au mur', weight: '', reps: '45 sec (on change de côté à chaque tour)', detail: 'talon collé — c\'est la récupération du triplet', sets: 4, seconds: 45, video: 'cPN3-FR-clk', start: 2, end: 68 },
    ],
  },
  D: {
    title: 'Mobilité longue',
    accent: '#fbbf24',
    estimatedMinutes: 17,
    exercises: [
      { block: 'Flow — 2 tours enchaînés', name: 'Salutation au soleil', weight: '', reps: '2 enchaînements par tour', detail: 'lent, respiration longue', sets: 2, video: 'STNry5WIBbM' },
      { block: 'Flow — 2 tours enchaînés', name: 'Cossack squat', weight: '6 kg', reps: '2 × 6 reps / côté', detail: 'kettlebell devant en contrepoids, on descend seulement jusqu\'où le talon reste au sol', sets: 2, video: '41om-6NClHo' },
      { block: 'Flow — 2 tours enchaînés', name: 'Jefferson curl', weight: '6 kg', reps: '3 reps par tour', detail: 'ultra-lentes, vertèbre par vertèbre', sets: 2, video: 'YGlAdtSKQaU' },
      { block: 'Tenues longues — un seul passage', name: '90/90 assis', weight: '', reps: '60 sec / côté', detail: '', sets: 2, seconds: 60, video: 'm51AZSXMvEA' },
      { block: 'Tenues longues — un seul passage', name: 'Pigeon', weight: '', reps: '60 sec / côté', detail: '', sets: 2, seconds: 60, video: '1o7awuDGzag' },
      { block: 'Tenues longues — un seul passage', name: 'Extension thoracique sur serviette', weight: '', reps: '90 sec', detail: 'serviette sous les omoplates', sets: 1, seconds: 90, video: 'VO0Cjl2lsho' },
      { block: 'Tenues longues — un seul passage', name: 'Ischios jambe tendue sur chaise', weight: '', reps: '60 sec / côté', detail: 'dos plat', sets: 2, seconds: 60, video: 'KY_TGLbgYMs' },
    ],
  },
};
