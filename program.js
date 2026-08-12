/*
 * Programme Coach — le seul fichier à modifier pour changer les séances.
 *
 * video : identifiant YouTube (la partie après ?v= dans l'URL)
 * start / end : secondes facultatives pour ne garder que la démonstration
 * estimatedMinutes : durée totale approximative du bloc
 * block : intitulé du groupe d'exercices (à enchaîner en tours quand c'est indiqué)
 *
 * Déroulé d'une journée : WARMUP puis PROGRAM[jour du cycle]
 * Budget : environ 20 min par jour, échauffement compris (4 + 16 min).
 *
 * VERSION NUQUE + DOS SENSIBLE
 * L'échauffement prépare la nuque, les omoplates, la colonne et les hanches.
 * Le travail de force reste sous-maximal : amplitude confortable, exécution
 * contrôlée et jamais jusqu'à l'échec. Réduire la charge, l'amplitude ou passer
 * un mouvement qui aggrave nettement les symptômes.
 *
 * Les quatre postures demandées sont réparties dans la rotation :
 * Pavanamuktasana, Balasana, Ardha Matsyendrasana et la posture jambe croisée
 * (figure 4 allongée). Le jour D les rassemble dans un retour au calme plus long.
 *
 * STRUCTURE — récupération active.
 * Chaque bloc en tours associe force ou stabilité à une mobilité. On passe d'un
 * exercice au suivant sans se presser ; la mobilité sert de récupération avant
 * le tour suivant. « on change de côté à chaque tour » donne deux passages par
 * côté sur un bloc de quatre tours.
 *
 * Boucle A → B → C → D → E → F → A → … prévue pour être faite tous les jours.
 * Un jour sauté ne casse rien : on reprend simplement la séance suivante.
 * Trois règles qui rendent le quotidien tenable :
 *   1. Peu de reps et 2 à 3 reps propres en réserve.
 *   2. Les rappels d'un même schéma utilisent une variante ou une charge différente.
 *   3. Le jour D reste volontairement plus léger ; E et F complètent l'équilibre.
 */

export const ROTATION = {
  reference: '2026-08-11', // Ce jour-là : séance A
  kettlebell: ['A', 'B', 'C', 'D', 'E', 'F'],
};

export const WARMUP = {
  title: 'Échauffement',
  accent: '#a78bfa',
  estimatedMinutes: 4,
  exercises: [
    { name: 'Chat-vache', weight: '', reps: '6 reps', detail: 'très lentes, dans une amplitude confortable', sets: 1, video: 'r43PNCct6Yw' },
    { name: 'Rétraction cervicale', weight: '', reps: '6 reps × 3 sec', detail: 'le menton recule à l\'horizontale, la tête ne bascule pas — jamais en force', sets: 1, video: 'vhFGQxDVzF8' },
    { name: 'Y-T-W au sol', weight: 'Poids du corps', reps: '5 reps de chaque', detail: 'à plat ventre — épaules loin des oreilles, petite amplitude', sets: 1, video: '8gBSQQSqXTg' },
    { name: 'Rétraction scapulaire suspendu', weight: 'Poids du corps', reps: '6 reps', detail: 'bras tendus, seules les omoplates descendent — lent et sans tirer sur la nuque', sets: 1, video: 'iKnjSB9VIGo' },
    { name: 'Squat profond tenu', weight: '', reps: '30 sec', detail: 'se tenir à une chaise si besoin, profondeur confortable', sets: 1, seconds: 30, video: 'D3zYzIlbjXM' },
  ],
};

export const PROGRAM = {
  A: {
    title: 'Poussée + charnière',
    accent: '#f97316',
    estimatedMinutes: 16,
    exercises: [
      { block: 'Force + mobilité — 4 tours enchaînés', name: 'Soulevé de terre kettlebell', weight: '6–12 kg', reps: '4 × 8 reps', detail: 'pousser le sol, charge près du corps — mouvement lent et amplitude confortable', sets: 4, video: '7K7ejiXdaX0' },
      { block: 'Force + mobilité — 4 tours enchaînés', name: 'Pompes lentes', weight: 'Poids du corps', reps: '4 × 5 reps', detail: '3 s de descente — corps gainé, nuque dans l\'axe ; mains surélevées si besoin', sets: 4, video: 'WDIpL0pjun0' },
      { block: 'Force + mobilité — 4 tours enchaînés', name: 'Balasana — posture de l\'enfant', weight: '', reps: '30 sec', detail: 'genoux écartés, front soutenu si nécessaire — respiration lente, sans forcer les genoux', sets: 4, seconds: 30, video: 'W2hM6cqI6fs', start: 14, end: 69 },
      { block: 'Stabilité + souplesse — 4 tours enchaînés', name: 'Dead bug lesté', weight: '0–6 kg', reps: '4 × 10 reps alternées', detail: 'tête au sol, côtes basses — sans charge si les lombaires quittent le tapis', sets: 4, video: 'xtTIb6dC-vI' },
      { block: 'Stabilité + souplesse — 4 tours enchaînés', name: 'Isométrie pompe', weight: 'Poids du corps', reps: '4 × 20 sec', detail: 'coudes confortables, corps gainé et nuque longue — mains surélevées si besoin', sets: 4, seconds: 20, video: 'Jv2hgtdfcC8' },
      { block: 'Stabilité + souplesse — 4 tours enchaînés', name: 'Pavanamuktasana — un genou', weight: '', reps: '30 sec (on change de côté à chaque tour)', detail: 'allongé, tête posée ; rapprocher doucement le genou sans écraser la hanche', sets: 4, seconds: 30, video: 'ZzTrddYD1RU' },
    ],
  },
  B: {
    title: 'Tirage + jambes',
    accent: '#38bdf8',
    estimatedMinutes: 16,
    exercises: [
      { block: 'Force + mobilité — 4 tours enchaînés', name: 'Traction', weight: 'Poids du corps', reps: '4 × 3 reps', detail: 'on descend d\'abord les omoplates, puis on tire — négative de 5 s si nécessaire', sets: 4, video: 'DGSm56-FixA' },
      { block: 'Force + mobilité — 4 tours enchaînés', name: 'Split squat bulgare', weight: '6–12 kg', reps: '6 reps (on change de côté à chaque tour)', detail: 'appui stable, descente lente et profondeur qui reste confortable', sets: 4, video: 'vgn7bSXkgkA' },
      { block: 'Force + mobilité — 4 tours enchaînés', name: 'Posture jambe croisée — figure 4', weight: '', reps: '40 sec (on change de côté à chaque tour)', detail: 'sur le dos, cheville sur la cuisse opposée ; tirer doucement, sans pression dans le genou', sets: 4, seconds: 40, video: 'eKp2f5-jRbI' },
      { block: 'Stabilité + mobilité — 4 tours enchaînés', name: 'Rowing un bras', weight: '6–12 kg', reps: '8 reps (on change de côté à chaque tour)', detail: 'appui sur une chaise — tirer avec l’omoplate, épaule basse et nuque longue', sets: 4, video: 'l5qelXL5nfs' },
      { block: 'Stabilité + mobilité — 4 tours enchaînés', name: 'Planche latérale', weight: 'Poids du corps', reps: '25 sec (on change de côté à chaque tour)', detail: 'genou du dessous au sol si besoin ; épaules, bassin et tête alignés', sets: 4, seconds: 25, video: '0M-erHBl48U' },
      { block: 'Stabilité + mobilité — 4 tours enchaînés', name: 'Transitions 90/90', weight: '', reps: '6 transitions complètes', detail: 'les deux genoux passent ensemble d’un côté à l’autre, sans forcer', sets: 4, video: 'm51AZSXMvEA' },
    ],
  },
  C: {
    title: 'Vertical + stabilité',
    accent: '#34d399',
    estimatedMinutes: 16,
    exercises: [
      { block: 'Force + souplesse — 4 tours enchaînés', name: 'Turkish get-up', weight: '0–6 kg', reps: '1 rep (on change de côté à chaque tour)', detail: 'très lent — sans charge ou arrêt à la position coude si le mouvement n’est pas confortable', sets: 4, video: 'sgd8n917Zv0' },
      { block: 'Force + souplesse — 4 tours enchaînés', name: 'Portage valise', weight: '6–12 kg', reps: '30 sec (on change de côté à chaque tour)', detail: 'marcher droit, sans inclinaison vers la charge, épaule basse', sets: 4, seconds: 30, video: 'UzjGxukrI5k' },
      { block: 'Force + souplesse — 4 tours enchaînés', name: 'Ardha Matsyendrasana', weight: '', reps: '30 sec (on change de côté à chaque tour)', detail: 'grandir la colonne puis tourner très doucement — ne jamais utiliser le bras comme levier', sets: 4, seconds: 30, video: 'yYy6w8_hLTE' },
      { block: 'Stabilité + mobilité — 4 tours enchaînés', name: 'Développé un bras à demi-genou', weight: '6–12 kg', reps: '5 reps (on change de côté à chaque tour)', detail: 'côtes basses, aucune cambrure — réduire la charge avant de compenser', sets: 4, video: 'UADDmT2rBCc' },
      { block: 'Stabilité + mobilité — 4 tours enchaînés', name: 'Relevé de genoux suspendu', weight: 'Poids du corps', reps: '4 × 6 reps', detail: 'sans balancer ni creuser le bas du dos — arrêter si la suspension tire sur la nuque', sets: 4, video: 'G6a5267YpHM' },
      { block: 'Stabilité + mobilité — 4 tours enchaînés', name: 'Dorsiflexion cheville genou au mur', weight: '', reps: '40 sec (on change de côté à chaque tour)', detail: 'talon collé, mouvement souple', sets: 4, seconds: 40, video: 'cPN3-FR-clk', start: 2, end: 68 },
    ],
  },
  D: {
    title: 'Force douce + mobilité',
    accent: '#fbbf24',
    estimatedMinutes: 16,
    exercises: [
      { block: 'Force douce + mobilité — 2 tours enchaînés', name: 'Salutation au soleil', weight: '', reps: '2 enchaînements par tour', detail: 'lent, respiration longue — plier les genoux et raccourcir l’amplitude si besoin', sets: 2, video: 'STNry5WIBbM' },
      { block: 'Force douce + mobilité — 2 tours enchaînés', name: 'Cossack squat', weight: '0–6 kg', reps: '2 × 6 reps / côté', detail: 'contrepoids facultatif, descendre seulement dans une amplitude confortable', sets: 2, video: '41om-6NClHo' },
      { block: 'Force douce + mobilité — 2 tours enchaînés', name: 'Dead bug', weight: 'Poids du corps', reps: '2 × 12 reps alternées', detail: 'tête au sol, expiration longue, lombaires en contact avec le tapis', sets: 2, video: 'xtTIb6dC-vI' },
      { block: 'Souplesse du dos — un seul passage', name: 'Pavanamuktasana — deux genoux', weight: '', reps: '45 sec', detail: 'tête et épaules posées ; enlacer les genoux sans tirer ni se balancer', sets: 1, seconds: 45, video: 'ZzTrddYD1RU' },
      { block: 'Souplesse du dos — un seul passage', name: 'Balasana — posture de l\'enfant', weight: '', reps: '60 sec', detail: 'front soutenu si besoin, fesses vers les talons seulement jusqu’au confort', sets: 1, seconds: 60, video: 'W2hM6cqI6fs', start: 14, end: 69 },
      { block: 'Souplesse du dos — un seul passage', name: 'Posture jambe croisée — figure 4', weight: '', reps: '45 sec / côté', detail: 'sur le dos, traction douce derrière la cuisse — relâcher si le genou pince', sets: 2, seconds: 45, video: 'eKp2f5-jRbI' },
      { block: 'Souplesse du dos — un seul passage', name: 'Ardha Matsyendrasana', weight: '', reps: '30 sec / côté', detail: 'version douce, jambe du dessous tendue si nécessaire ; respirer sans chercher plus loin', sets: 2, seconds: 30, video: 'yYy6w8_hLTE' },
      { block: 'Souplesse du dos — un seul passage', name: 'Extension thoracique sur serviette', weight: '', reps: '60 sec', detail: 'serviette sous les omoplates, tête entièrement posée', sets: 1, seconds: 60, video: 'VO0Cjl2lsho' },
    ],
  },
  E: {
    title: 'Chaîne postérieure + tirage',
    accent: '#c084fc',
    estimatedMinutes: 16,
    exercises: [
      { block: 'Force + mobilité — 4 tours enchaînés', name: 'Pont fessier', weight: '0–6 kg', reps: '4 × 10 reps', detail: 'pousser dans les talons et serrer les fessiers — s’arrêter avant de cambrer', sets: 4, video: 'kHl7NOEs8qs', start: 16 },
      { block: 'Force + mobilité — 4 tours enchaînés', name: 'Rowing un bras', weight: '6–12 kg', reps: '8 reps (on change de côté à chaque tour)', detail: 'appui sur une chaise — tirer avec l’omoplate, épaule basse et nuque longue', sets: 4, video: 'l5qelXL5nfs' },
      { block: 'Force + mobilité — 4 tours enchaînés', name: 'Posture jambe croisée — figure 4', weight: '', reps: '35 sec (on change de côté à chaque tour)', detail: 'sur le dos, cheville sur la cuisse opposée ; traction douce, sans pression dans le genou', sets: 4, seconds: 35, video: 'eKp2f5-jRbI' },
      { block: 'Stabilité + souplesse — 4 tours enchaînés', name: 'Bird-dog', weight: 'Poids du corps', reps: '5 reps (on change de côté à chaque tour)', detail: 'bassin immobile, aller moins loin plutôt que de creuser le bas du dos', sets: 4, video: '_b2IhAjUpFk' },
      { block: 'Stabilité + souplesse — 4 tours enchaînés', name: 'Planche latérale', weight: 'Poids du corps', reps: '20 sec (on change de côté à chaque tour)', detail: 'genou du dessous au sol si besoin ; épaules, bassin et tête alignés', sets: 4, seconds: 20, video: '0M-erHBl48U' },
      { block: 'Stabilité + souplesse — 4 tours enchaînés', name: 'Pavanamuktasana — un genou', weight: '', reps: '30 sec (on change de côté à chaque tour)', detail: 'allongé, tête posée ; rapprocher doucement le genou sans écraser la hanche', sets: 4, seconds: 30, video: 'ZzTrddYD1RU' },
    ],
  },
  F: {
    title: 'Jambes + stabilité',
    accent: '#fb7185',
    estimatedMinutes: 16,
    exercises: [
      { block: 'Force + souplesse — 4 tours enchaînés', name: 'Goblet squat', weight: '6–12 kg', reps: '4 × 6 reps', detail: 'charge près du buste, genoux dans l’axe — profondeur limitée à une zone confortable', sets: 4, video: 'FPYzK3LAKu8' },
      { block: 'Force + souplesse — 4 tours enchaînés', name: 'Cossack squat', weight: '0–6 kg', reps: '5 reps (on change de côté à chaque tour)', detail: 'contrepoids facultatif, descendre seulement dans une amplitude confortable', sets: 4, video: '41om-6NClHo' },
      { block: 'Force + souplesse — 4 tours enchaînés', name: 'Ardha Matsyendrasana', weight: '', reps: '30 sec (on change de côté à chaque tour)', detail: 'grandir la colonne puis tourner très doucement — ne jamais utiliser le bras comme levier', sets: 4, seconds: 30, video: 'yYy6w8_hLTE' },
      { block: 'Stabilité + mobilité — 4 tours enchaînés', name: 'Portage valise', weight: '6–12 kg', reps: '30 sec (on change de côté à chaque tour)', detail: 'marcher droit, sans inclinaison vers la charge, épaule basse', sets: 4, seconds: 30, video: 'UzjGxukrI5k' },
      { block: 'Stabilité + mobilité — 4 tours enchaînés', name: 'Bird-dog', weight: 'Poids du corps', reps: '5 reps (on change de côté à chaque tour)', detail: 'bassin immobile, aller moins loin plutôt que de creuser le bas du dos', sets: 4, video: '_b2IhAjUpFk' },
      { block: 'Stabilité + mobilité — 4 tours enchaînés', name: 'Dorsiflexion cheville genou au mur', weight: '', reps: '40 sec (on change de côté à chaque tour)', detail: 'talon collé, mouvement souple', sets: 4, seconds: 40, video: 'cPN3-FR-clk', start: 2, end: 68 },
    ],
  },
};
