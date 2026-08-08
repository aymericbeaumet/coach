'use strict';

/* ---------------------------------------------------------------------------
 * Coach — la séance du jour.
 *   • Kettlebell : rotation A / B / C   (2026-08-08 = Jour A)
 *   • Étirements : rotation J1 / J2 / J3 / J4   (2026-08-08 = J1)
 * Rotations déterministes, +1 cran par jour civil.
 * Aucun état conservé : rafraîchir redémarre la séance depuis le début.
 * ------------------------------------------------------------------------- */

const PROGRAM = {
  A: {
    title: 'Charnière + poussée', accent: '#f97316',
    exercises: [
      { name: 'Swings 2 mains', weight: '12 kg', reps: '10 × 10', detail: '1 série par minute', sets: 10,
        note: 'Conditionnement + travail de charnière, pas de la force pure.', video: 'nkWkssEvo3A' },
      { name: 'Rowing australien', weight: 'Poids du corps', reps: '3 × 10', detail: '', sets: 3,
        note: 'Pieds surélevés sur une chaise dès que possible.', video: 'nB2sOQ7613Q' },
      { name: 'Goblet squat', weight: '12 kg', reps: '3 × 10', detail: 'tempo 3-1-1', sets: 3,
        note: '3 s de descente, 1 s en bas, 1 s de montée.', video: '5z86H2vki_8' },
      { name: 'Pompes', weight: 'Poids du corps', reps: '3 séries', detail: '', sets: 3,
        note: "S'arrêter 2 reps avant l'échec — c'est ta poussée principale.", video: 'IODxDxX7oi4' },
      { name: 'Floor press', weight: '12 kg', reps: '2 × 12 / bras', detail: '', sets: 2,
        note: '', video: 'B340QckIfJM' },
      { name: 'Carry asymétrique', weight: '12 / 6 kg', reps: '2 × 30 s', detail: '', sets: 2,
        note: '12 kg d’un côté, 6 kg de l’autre.', video: 'iq5D5SU2Oq4' },
    ],
  },
  B: {
    title: 'Jambes + dos', accent: '#38bdf8',
    exercises: [
      { name: 'Turkish get-up', weight: '12 kg', reps: '5 × 1 / côté', detail: 'lent', sets: 5,
        note: 'Lent et contrôlé, une répétition à la fois.', video: 'JFrItinMcyQ' },
      { name: 'Split squat bulgare', weight: '12 kg', reps: '3 × 8 / côté', detail: '', sets: 3,
        note: 'Pied arrière sur une chaise. Bien plus dur que la fente arrière.', video: 'eCJxHKDXBqk' },
      { name: 'SDT roumain unilatéral', weight: '12 kg', reps: '3 × 10 / côté', detail: 'lent', sets: 3,
        note: 'Soulevé de terre roumain sur une jambe, lent et gainé.', video: 'S8wkyvxNvac' },
      { name: 'Rowing un bras', weight: '12 kg', reps: '3 × 15 / côté', detail: '', sets: 3,
        note: '1 s de contraction en haut.', video: 'l5qelXL5nfs' },
      { name: 'Pullover', weight: '6 kg', reps: '3 × 15', detail: '', sets: 3,
        note: '', video: 'tcHaHIQStsk' },
      { name: 'Gainage latéral', weight: 'Poids du corps', reps: '2 × 30 s / côté', detail: '', sets: 2,
        note: '', video: 'fIkpxa-kuIA' },
    ],
  },
  C: {
    title: 'Récup active · 15 min', accent: '#34d399',
    exercises: [
      { name: 'Get-up', weight: '6 kg', reps: 'léger', detail: '', sets: 1, note: 'Mobilité et contrôle.', video: 'JFrItinMcyQ' },
      { name: 'Pullover', weight: '6 kg', reps: 'léger', detail: '', sets: 1, note: '', video: 'tcHaHIQStsk' },
      { name: 'Halos', weight: '6 kg', reps: 'léger', detail: '', sets: 1, note: 'Autour de la tête, lent, dans les deux sens.', video: 'Sci3lijQBmk' },
      { name: 'Carries', weight: '6 kg', reps: 'marche', detail: '', sets: 1, note: 'Marche lestée, gainage.', video: 'CiN1iw856rQ' },
      { name: 'Mobilité hanches / épaules', weight: 'Poids du corps', reps: 'flow', detail: '', sets: 1, note: 'Ouverture hanches et épaules.', video: 'gDG9QoYpqtU' },
    ],
  },
};

/* Étirements — Base tous les jours + rotation J1 → J2 → J3 → J4. */
const STRETCH = {
  base: [
    { name: 'Chat-vache', weight: '', reps: '10 reps', detail: 'très lentes, vertèbre par vertèbre', sets: 1,
      note: 'Enroule et déroule la colonne segment par segment.', video: 'r43PNCct6Yw' },
    { name: 'Étirement fléchisseur de hanche', weight: '', reps: '60 s / côté', detail: 'bassin rentré, fessier serré', sets: 2,
      note: 'Rétroversion du bassin pour vraiment cibler le psoas.', video: 'WtTAT6lSm3E' },
    { name: 'Squat profond tenu', weight: '', reps: '60 s', detail: 'talons au sol', sets: 1,
      note: '', video: 'ss4R2g4mFVU' },
  ],
  days: {
    J1: { title: 'Chaîne postérieure', subtitle: '« je me baisse »', exercises: [
      { name: 'Jefferson curl', weight: '6 kg', reps: '5 reps', detail: '10 s pour dérouler, 10 s pour remonter', sets: 5,
        note: 'Déroule vertèbre par vertèbre, charge légère et contrôlée.', video: 'ZWaI1jrtzOk' },
      { name: 'Ischios jambe tendue sur chaise', weight: '', reps: '90 s / côté', detail: 'dos plat, bassin qui bascule', sets: 2,
        note: 'Charnière de hanche — surtout pas le dos rond.', video: 'KY_TGLbgYMs' },
      { name: 'Elephant walk', weight: '', reps: '60 s', detail: '', sets: 1, note: '', video: 'fnih_6w_JjA' },
    ]},
    J2: { title: 'Hanches', subtitle: '', exercises: [
      { name: '90/90 assis', weight: '', reps: '60 s / côté', detail: "bascule d'un côté à l'autre", sets: 2, note: '', video: 'axHM6figGWY' },
      { name: 'Pigeon', weight: '', reps: '60 s / côté', detail: '', sets: 2, note: '', video: 'YqNO0ImMtEY' },
      { name: 'Grenouille', weight: '', reps: '60 s', detail: '', sets: 1, note: '', video: 'cszFKUXArjs' },
    ]},
    J3: { title: 'Dos + thoracique', subtitle: '', exercises: [
      { name: 'Extension thoracique sur serviette', weight: '', reps: '90 s', detail: 'serviette roulée sous les omoplates', sets: 1, note: '', video: 'YoPs_HtL9tc' },
      { name: 'Livre ouvert', weight: '', reps: '8 reps / côté', detail: 'couché sur le côté, genoux pliés', sets: 2,
        note: 'On ouvre lentement le bras du dessus.', video: 'rDviWORCWEw' },
      { name: 'Étirement dorsaux à genoux', weight: '', reps: '60 s / côté', detail: "mains loin devant, décalées d'un côté", sets: 2, note: '', video: 'X8ijXOFfYMQ' },
      { name: 'Torsion lombaire allongée', weight: '', reps: '60 s / côté', detail: 'épaules au sol', sets: 2, note: '', video: 'cvCPeN6XjHs' },
    ]},
    J4: { title: 'Chevilles + épaules', subtitle: '', exercises: [
      { name: 'Dorsiflexion genou au mur', weight: '', reps: '90 s / côté', detail: 'talon collé', sets: 2, note: '', video: 'cPN3-FR-clk' },
      { name: 'Mollet tendu puis fléchi', weight: '', reps: '45 s + 45 s / côté', detail: 'tendu = jumeaux, fléchi = soléaire', sets: 2, note: '', video: 'RObBWavVFzI' },
      { name: 'Dislocations à la serviette', weight: '', reps: '10 reps', detail: 'lentes', sets: 1, note: 'Prise large, bras tendus, très lent.', video: 'vP8YmmRMz6I' },
      { name: 'Étirement pectoral au chambranle', weight: '', reps: '60 s / côté', detail: 'bras en L', sets: 2, note: '', video: 'Q6KfoKo0lSo' },
    ]},
  },
};

const LETTERS = ['A', 'B', 'C'];
const JDAYS = ['J1', 'J2', 'J3', 'J4'];
const REFERENCE = Date.UTC(2026, 7, 8); // 8 août 2026 → Jour A & J1
const mod = (n, m) => ((n % m) + m) % m;

const today = new Date();
const diff = Math.round((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - REFERENCE) / 86400000);
const letter = LETTERS[mod(diff, 3)];
const jletter = JDAYS[mod(diff, 4)];
const day = PROGRAM[letter];
const sday = STRETCH.days[jletter];
const nextLetter = LETTERS[mod(diff + 1, 3)];

/* Refresh → on repart du haut. */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

document.documentElement.style.setProperty('--accent', day.accent);

/* ---------- Intro : deux sections (Kettlebell + Étirements) ---------- */
document.getElementById('date').textContent =
  today.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

document.getElementById('kbBadge').textContent = letter;
document.getElementById('kbTitle').textContent = `Kettlebell — Jour ${letter}`;
document.getElementById('kbSub').textContent = day.title;
document.getElementById('stBadge').textContent = jletter;
document.getElementById('stTitle').textContent = `Étirements — ${jletter}`;
document.getElementById('stSub').textContent =
  sday.subtitle ? `Base + ${sday.title} ${sday.subtitle}` : `Base + ${sday.title}`;
document.getElementById('tomorrow').textContent = `Demain : Jour ${nextLetter}`;

function fillList(el, items) {
  items.forEach((ex) => {
    const li = document.createElement('li');
    const w = ex.weight ? ` · ${ex.weight}` : '';
    li.innerHTML = `<span>${ex.name}</span><span>${ex.reps}${w}</span>`;
    el.appendChild(li);
  });
}
fillList(document.getElementById('kbList'), day.exercises);
fillList(document.getElementById('stList'), [...STRETCH.base, ...sday.exercises]);

/* ---------- Construction du feed ---------- */
const feed = document.getElementById('feed');
const rail = document.getElementById('rail');
const PLAY_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';

const flow = [
  ...day.exercises.map((ex) => ({ ...ex, group: `Jour ${letter} · ${day.title}` })),
  ...STRETCH.base.map((ex) => ({ ...ex, group: 'Étirements · Base' })),
  ...sday.exercises.map((ex) => ({ ...ex, group: `Étirements · ${jletter}` })),
];
const N = flow.length;

const exScreens = [];
const rdots = [];
const resetters = [];
let congrats; // défini plus bas

function goNext(idx) {
  const target = idx + 1 < N ? exScreens[idx + 1] : congrats;
  target.scrollIntoView({ behavior: 'smooth' });
}

function makeExercise(ex, i) {
  const idx = i;               // position dans exScreens
  const num = i + 1;           // numéro affiché (1..N)
  const s = document.createElement('section');
  s.className = 'screen ex';

  const weight = ex.weight ? `<span class="weight">${ex.weight}</span>` : '';
  const detail = ex.detail ? `<small>${ex.detail}</small>` : '';
  const note = ex.note ? `<p class="note">${ex.note}</p>` : '';

  s.innerHTML = `
    <div class="player" data-video="${ex.video}">
      <button class="poster" style="background-image:url('https://i.ytimg.com/vi/${ex.video}/hqdefault.jpg')" aria-label="Lire ${ex.name}">
        <span class="play">${PLAY_ICON}</span>
      </button>
    </div>
    <div class="overlay-top">
      <span class="pill">${ex.group}</span>
      <span class="pill">${num} / ${N}</span>
    </div>
    <div class="overlay-bottom">
      <div class="ex-head"><h2 class="ex-name">${ex.name}</h2>${weight}</div>
      ${note}
      <button class="reps-badge" aria-label="Valider une série">
        <span class="rb-count">${ex.sets}</span>
        <span class="rb-scheme">${ex.reps}${detail}</span>
      </button>
    </div>
  `;

  // Lecture vidéo au tap (fiable partout : c'est un geste utilisateur).
  s.querySelector('.poster').addEventListener('click', () => loadVideo(s));

  // Compteur de séries : chaque tap décrémente ; 0 = terminé → exercice suivant.
  const badge = s.querySelector('.reps-badge');
  const countEl = s.querySelector('.rb-count');
  let left = ex.sets;
  const render = () => {
    countEl.textContent = left <= 0 ? '✓' : String(left);
    badge.classList.toggle('done', left <= 0);
  };
  badge.addEventListener('click', () => {
    if (left <= 0) return;
    left -= 1;
    render();
    if (left <= 0) setTimeout(() => goNext(idx), 650);
  });
  resetters.push(() => { left = ex.sets; render(); });

  const rdot = document.createElement('button');
  rdot.className = 'rdot';
  rdot.addEventListener('click', () => s.scrollIntoView({ behavior: 'smooth' }));
  rail.appendChild(rdot);

  exScreens.push(s);
  rdots.push(rdot);
  feed.appendChild(s);
}

function appendSection(html, cls) {
  const s = document.createElement('section');
  s.className = `screen ${cls}`;
  s.innerHTML = `<div class="section-inner">${html}</div>`;
  feed.appendChild(s);
  return s;
}

flow.forEach((ex, i) => makeExercise(ex, i));

congrats = appendSection(
  `<div class="emoji">💪</div>
   <h1>Séance terminée !</h1>
   <p>Bravo — Jour ${letter} + étirements ${jletter} bouclés.</p>
   <button class="start" id="restart">Recommencer</button>`,
  'congrats',
);

/* ---------- Vidéos : une seule chargée à la fois ---------- */
function embedURL(id) {
  const p = new URLSearchParams({
    autoplay: '1', loop: '1', playlist: id,
    controls: '1', rel: '0', playsinline: '1', modestbranding: '1', iv_load_policy: '3',
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${p}`;
}
function loadVideo(section) {
  const p = section.querySelector('.player');
  if (p.dataset.loaded) return;
  p.dataset.loaded = '1';
  const iframe = document.createElement('iframe');
  iframe.src = embedURL(p.dataset.video);
  iframe.title = section.querySelector('.ex-name').textContent;
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  iframe.allowFullscreen = true;
  // Requis depuis fin 2025 : YouTube exige un referrer valide, sinon "Error 153".
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  p.appendChild(iframe);
}
function unloadVideo(section) {
  const p = section.querySelector('.player');
  if (!p.dataset.loaded) return;
  delete p.dataset.loaded;
  const iframe = p.querySelector('iframe');
  if (iframe) iframe.remove();
}

let active = -1;
function setActive(idx) {
  if (idx === active) return;
  if (active >= 0) unloadVideo(exScreens[active]); // stoppe la vidéo qu'on quitte
  active = idx;
  rdots.forEach((d, i) => d.classList.toggle('active', i === idx));
  rail.classList.toggle('hidden', idx < 0);
}

const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting && e.intersectionRatio >= 0.6) {
      setActive(e.target.classList.contains('ex') ? exScreens.indexOf(e.target) : -1);
    }
  }
}, { root: feed, threshold: [0.6] });
[...feed.querySelectorAll('.screen')].forEach((s) => io.observe(s));

/* ---------- Navigation ---------- */
const intro = document.getElementById('intro');
document.getElementById('start').addEventListener('click', () => exScreens[0].scrollIntoView({ behavior: 'smooth' }));
document.getElementById('restart').addEventListener('click', () => {
  resetters.forEach((fn) => fn());
  intro.scrollIntoView({ behavior: 'smooth' });
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); (active + 1 < N ? exScreens[active + 1] : congrats).scrollIntoView({ behavior: 'smooth' }); }
  if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); (active <= 0 ? intro : exScreens[active - 1]).scrollIntoView({ behavior: 'smooth' }); }
});

/* On repart toujours du haut au chargement. */
feed.scrollTop = 0;
window.addEventListener('load', () => { feed.scrollTop = 0; });

/* ---------- Astuce d'installation (iOS, hors mode standalone) ---------- */
const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !standalone) document.getElementById('install').hidden = false;

/* ---------- Service worker ---------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
