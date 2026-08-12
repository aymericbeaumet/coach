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
 * VERSION NUQUE / INTERSCAPULAIRE
 * L'échauffement est devenu le bloc nuque et haut du dos : rétraction cervicale,
 * Y-T-W, rétractions scapulaires. C'est la partie non négociable de la séance.
 * Hollow hold retiré : le cou finit toujours par faire le travail des abdos.
 * Halos retirés : ils poussent à hausser les épaules.
 * Toutes les poussées et tous les tirages portent la même consigne — épaules
 * basses, menton non projeté. La douleur vient presque toujours de là.
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
  title: 'Échauffement — nuque et haut du dos',
  accent: '#a78bfa',
  estimatedMinutes: 4,
  exercises: [
    { name: 'Chat-vache', weight: '', reps: '8 reps', detail: 'très lentes, vertèbre par vertèbre', sets: 1, video: 'r43PNCct6Yw' },
    { name: 'Rétraction cervicale', weight: '', reps: '8 reps × 3 sec', detail: 'le menton recule à l\'horizontale, la tête ne bascule pas — jamais douloureux', sets: 1, video: 'vhFGQxDVzF8' },
    { name: 'Y-T-W au sol', weight: 'Poids du corps', reps: '8 reps de chaque', detail: 'à plat ventre — le travail se fait entre les omoplates, épaules loin des oreilles', sets: 1, video: '8gBSQQSqXTg' },
    { name: 'Rétraction scapulaire suspendu', weight: 'Poids du corps', reps: '6 reps', detail: 'bras tendus, seules les omoplates descendent — lent', sets: 1, video: 'iKnjSB9VIGo' },
    { name: 'Suspension passive à la barre', weight: 'Poids du corps', reps: '30 sec', detail: 'on relâche tout — si la nuque tire, on raccourcit', sets: 1, seconds: 30, video: '2vspW4N4BMs' },
    { name: 'Squat profond tenu', weight: '', reps: '45 sec', detail: 'talons au sol', sets: 1, seconds: 45, video: 'D3zYzIlbjXM' },
  ],
};

export const PROGRAM = {
  A: {
    title: 'Poussée + charnière',
    accent: '#f97316',
    estimatedMinutes: 16,
    exercises: [
      { block: 'Triplet 1 — 4 tours enchaînés', name: 'Swings 2 mains', weight: '12 kg', reps: '4 × 12 reps', detail: 'tout part des hanches — épaules basses, menton rentré, regard au sol 2 m devant', sets: 4, video: '1cVT3ee9mgU' },
      { block: 'Triplet 1 — 4 tours enchaînés', name: 'Pompes lentes', weight: 'Poids du corps', reps: '4 × 5 reps', detail: '3 s de descente — nuque dans l\'axe du dos, le menton ne part jamais en avant', sets: 4, video: 'WDIpL0pjun0' },
      { block: 'Triplet 1 — 4 tours enchaînés', name: 'Extension thoracique sur serviette', weight: '', reps: '45 sec', detail: 'serviette sous les omoplates, tête posée — c\'est la récupération du triplet', sets: 4, seconds: 45, video: 'VO0Cjl2lsho' },
      { block: 'Triplet 2 — 4 tours enchaînés', name: 'Dead bug lesté', weight: '6 kg', reps: '4 × 5 reps / côté', detail: 'kettlebell bras tendus au-dessus de la poitrine, tête au sol, lombaire collé', sets: 4, video: 'xtTIb6dC-vI' },
      { block: 'Triplet 2 — 4 tours enchaînés', name: 'Isométrie pompe', weight: 'Poids du corps', reps: '4 × 30 sec', detail: 'coudes à 90° — le tendon ; nuque dans l\'axe', sets: 4, seconds: 30, video: 'Jv2hgtdfcC8' },
      { block: 'Triplet 2 — 4 tours enchaînés', name: 'Jefferson curl', weight: '6 kg', reps: '2 reps par tour', detail: 'ultra-lentes — le déroulé démarre sous la nuque, la tête reste dans l\'axe', sets: 4, video: 'YGlAdtSKQaU' },
    ],
  },
  B: {
    title: 'Tirage + squat',
    accent: '#38bdf8',
    estimatedMinutes: 16,
    exercises: [
      { block: 'Triplet 1 — 4 tours enchaînés', name: 'Traction', weight: 'Poids du corps', reps: '4 × 3 reps', detail: 'on descend d\'abord les omoplates, puis on tire — épaules loin des oreilles. Négative de 5 s si la traction ne vient pas', sets: 4, video: 'DGSm56-FixA' },
      { block: 'Triplet 1 — 4 tours enchaînés', name: 'Split squat bulgare', weight: '12 kg', reps: '4 × 6 reps / côté', detail: 'pied arrière sur une chaise, descente lente', sets: 4, video: 'vgn7bSXkgkA' },
      { block: 'Triplet 1 — 4 tours enchaînés', name: 'Pigeon', weight: '', reps: '45 sec (on change de côté à chaque tour)', detail: 'c\'est la récupération du triplet', sets: 4, seconds: 45, video: '1o7awuDGzag' },
      { block: 'Triplet 2 — 4 tours enchaînés', name: 'Rowing un bras', weight: '12 kg', reps: '4 × 8 reps / côté', detail: 'appui sur une chaise — on tire avec l’omoplate, épaule basse et nuque longue', sets: 4, video: 'l5qelXL5nfs' },
      { block: 'Triplet 2 — 4 tours enchaînés', name: 'Planche latérale', weight: 'Poids du corps', reps: '30 sec (on change de côté à chaque tour)', detail: 'hanche haute, épaules et bassin alignés, tête dans le prolongement', sets: 4, seconds: 30, video: '0M-erHBl48U' },
      { block: 'Triplet 2 — 4 tours enchaînés', name: 'Transitions 90/90', weight: '', reps: '6 transitions complètes', detail: 'les deux genoux passent ensemble d’un côté à l’autre — c’est la récupération du triplet', sets: 4, video: 'm51AZSXMvEA' },
    ],
  },
  C: {
    title: 'Vertical + gainage',
    accent: '#34d399',
    estimatedMinutes: 16,
    exercises: [
      { block: 'Triplet 1 — 4 tours enchaînés', name: 'Turkish get-up', weight: '12 kg', reps: '1 rep (on change de côté à chaque tour)', detail: 'très lent — le regard suit la kettlebell sans projeter le menton. Si la nuque tire, on s\'arrête à la position coude', sets: 4, video: 'sgd8n917Zv0' },
      { block: 'Triplet 1 — 4 tours enchaînés', name: 'Portage valise', weight: '12 kg', reps: '30 sec (on change de côté à chaque tour)', detail: 'on marche droit, aucune inclinaison vers la charge, épaule basse', sets: 4, seconds: 30, video: 'UzjGxukrI5k' },
      { block: 'Triplet 1 — 4 tours enchaînés', name: 'Livre ouvert', weight: '', reps: '6 reps (on change de côté à chaque tour)', detail: 'couché sur le côté — c\'est la récupération du triplet', sets: 4, video: 'EHZJns1bXPM' },
      { block: 'Triplet 2 — 4 tours enchaînés', name: 'Développé un bras à demi-genou', weight: '12 kg', reps: '4 × 5 reps / côté', detail: 'épaule basse au départ, on ne hausse pas — côtes basses, aucune cambrure', sets: 4, video: 'UADDmT2rBCc' },
      { block: 'Triplet 2 — 4 tours enchaînés', name: 'Relevé de genoux suspendu', weight: 'Poids du corps', reps: '4 × 6 reps', detail: 'on descend les omoplates avant de monter les genoux — sans balancer', sets: 4, video: 'G6a5267YpHM' },
      { block: 'Triplet 2 — 4 tours enchaînés', name: 'Dorsiflexion cheville genou au mur', weight: '', reps: '45 sec (on change de côté à chaque tour)', detail: 'talon collé — c\'est la récupération du triplet', sets: 4, seconds: 45, video: 'cPN3-FR-clk', start: 2, end: 68 },
    ],
  },
  D: {
    title: 'Mobilité longue',
    accent: '#fbbf24',
    estimatedMinutes: 16,
    exercises: [
      { block: 'Flow — 2 tours enchaînés', name: 'Salutation au soleil', weight: '', reps: '2 enchaînements par tour', detail: 'lent, respiration longue', sets: 2, video: 'STNry5WIBbM' },
      { block: 'Flow — 2 tours enchaînés', name: 'Cossack squat', weight: '6 kg', reps: '2 × 6 reps / côté', detail: 'kettlebell devant en contrepoids, on descend seulement jusqu\'où le talon reste au sol', sets: 2, video: '41om-6NClHo' },
      { block: 'Flow — 2 tours enchaînés', name: 'Jefferson curl', weight: '6 kg', reps: '3 reps par tour', detail: 'ultra-lentes — le déroulé démarre sous la nuque', sets: 2, video: 'YGlAdtSKQaU' },
      { block: 'Tenues longues — un seul passage', name: 'Étirement trapèze supérieur et élévateur', weight: '', reps: '45 sec / côté', detail: 'traction très douce de la main, épaule opposée qui reste basse', sets: 2, seconds: 45, video: 'DZs3FNcuoXA' },
      { block: 'Tenues longues — un seul passage', name: 'Extension thoracique sur serviette', weight: '', reps: '90 sec', detail: 'serviette sous les omoplates, tête posée', sets: 1, seconds: 90, video: 'VO0Cjl2lsho' },
      { block: 'Tenues longues — un seul passage', name: 'Transitions 90/90', weight: '', reps: '10 transitions complètes', detail: 'les deux genoux passent ensemble d’un côté à l’autre, sans forcer', sets: 1, video: 'm51AZSXMvEA' },
      { block: 'Tenues longues — un seul passage', name: 'Pigeon', weight: '', reps: '60 sec / côté', detail: '', sets: 2, seconds: 60, video: '1o7awuDGzag' },
    ],
  },
};
