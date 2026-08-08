'use strict';

/* ---------------------------------------------------------------------------
 * Coach — la séance du jour.
 *   • Kettlebell : rotation interne A / B / C   (référence 2026-08-08)
 *   • Étirements : rotation interne J1 / J2 / J3 / J4
 * Rotations déterministes (+1 cran / jour civil). Détail interne, jamais montré.
 * Aucun état conservé : rafraîchir redémarre la séance depuis le début.
 * ------------------------------------------------------------------------- */

const PROGRAM = {
  A: {
    title: 'Charnière + poussée', accent: '#f97316',
    exercises: [
      { name: 'Swings 2 mains', weight: '12 kg', reps: '10 × 10 reps', detail: '1 série par minute', sets: 10, video: 'nkWkssEvo3A' },
      { name: 'Rowing australien', weight: 'Poids du corps', reps: '3 × 10 reps', detail: 'pieds surélevés sur une chaise', sets: 3, video: 'nB2sOQ7613Q' },
      { name: 'Goblet squat', weight: '12 kg', reps: '3 × 10 reps', detail: 'tempo 3-1-1', sets: 3, video: '5z86H2vki_8' },
      { name: 'Pompes', weight: 'Poids du corps', reps: '3 séries', detail: '2 reps avant l’échec', sets: 3, video: 'IODxDxX7oi4' },
      { name: 'Floor press', weight: '12 kg', reps: '2 × 12 reps / bras', detail: '', sets: 2, video: 'B340QckIfJM' },
      { name: 'Carry asymétrique', weight: '12 / 6 kg', reps: '2 × 30 sec', detail: '', sets: 2, seconds: 30, video: 'iq5D5SU2Oq4' },
    ],
  },
  B: {
    title: 'Jambes + dos', accent: '#38bdf8',
    exercises: [
      { name: 'Turkish get-up', weight: '12 kg', reps: '5 × 1 rep / côté', detail: 'lent', sets: 5, video: 'JFrItinMcyQ' },
      { name: 'Split squat bulgare', weight: '12 kg', reps: '3 × 8 reps / côté', detail: 'pied arrière sur une chaise', sets: 3, video: 'eCJxHKDXBqk' },
      { name: 'Soulevé de terre roumain unilatéral', weight: '12 kg', reps: '3 × 10 reps / côté', detail: 'lent', sets: 3, video: 'S8wkyvxNvac' },
      { name: 'Rowing un bras', weight: '12 kg', reps: '3 × 15 reps / côté', detail: '1 s de contraction en haut', sets: 3, video: 'l5qelXL5nfs' },
      { name: 'Pullover', weight: '6 kg', reps: '3 × 15 reps', detail: '', sets: 3, video: 'tcHaHIQStsk' },
      { name: 'Gainage latéral', weight: 'Poids du corps', reps: '2 × 30 sec / côté', detail: '', sets: 2, seconds: 30, video: 'fIkpxa-kuIA' },
    ],
  },
  C: {
    title: 'Récup active', accent: '#34d399',
    exercises: [
      { name: 'Get-up', weight: '6 kg', reps: '3 reps / côté', detail: 'léger', sets: 1, video: 'JFrItinMcyQ' },
      { name: 'Pullover', weight: '6 kg', reps: '15 reps', detail: 'léger', sets: 1, video: 'tcHaHIQStsk' },
      { name: 'Halos', weight: '6 kg', reps: '5 tours / sens', detail: 'lent', sets: 1, video: 'Sci3lijQBmk' },
      { name: 'Carries', weight: '6 kg', reps: '40 sec', detail: 'marche lestée', sets: 1, seconds: 40, video: 'CiN1iw856rQ' },
      { name: 'Mobilité hanches / épaules', weight: 'Poids du corps', reps: '60 sec', detail: '', sets: 1, seconds: 60, video: 'gDG9QoYpqtU' },
    ],
  },
};

/* Étirements — Base tous les jours + rotation J1 → J2 → J3 → J4. */
const STRETCH = {
  base: [
    { name: 'Chat-vache', weight: '', reps: '10 reps', detail: 'vertèbre par vertèbre', sets: 1, video: 'r43PNCct6Yw' },
    { name: 'Étirement fléchisseur de hanche', weight: '', reps: '60 sec / côté', detail: 'bassin rentré', sets: 2, seconds: 60, video: 'WtTAT6lSm3E' },
    { name: 'Squat profond tenu', weight: '', reps: '60 sec', detail: 'talons au sol', sets: 1, seconds: 60, video: 'ss4R2g4mFVU' },
  ],
  days: {
    J1: { title: 'Chaîne postérieure', exercises: [
      { name: 'Jefferson curl', weight: '6 kg', reps: '5 reps', detail: '10 s pour dérouler, 10 s pour remonter', sets: 5, video: 'ZWaI1jrtzOk' },
      { name: 'Ischios jambe tendue sur chaise', weight: '', reps: '90 sec / côté', detail: 'dos plat', sets: 2, seconds: 90, video: 'KY_TGLbgYMs' },
      { name: 'Elephant walk', weight: '', reps: '60 sec', detail: '', sets: 1, seconds: 60, video: 'fnih_6w_JjA' },
    ]},
    J2: { title: 'Hanches', exercises: [
      { name: '90/90 assis', weight: '', reps: '60 sec / côté', detail: '', sets: 2, seconds: 60, video: 'axHM6figGWY' },
      { name: 'Pigeon', weight: '', reps: '60 sec / côté', detail: '', sets: 2, seconds: 60, video: 'YqNO0ImMtEY' },
      { name: 'Grenouille', weight: '', reps: '60 sec', detail: '', sets: 1, seconds: 60, video: 'cszFKUXArjs' },
    ]},
    J3: { title: 'Dos + thoracique', exercises: [
      { name: 'Extension thoracique sur serviette', weight: '', reps: '90 sec', detail: 'serviette sous les omoplates', sets: 1, seconds: 90, video: 'YoPs_HtL9tc' },
      { name: 'Livre ouvert', weight: '', reps: '8 reps / côté', detail: 'couché sur le côté', sets: 2, video: 'rDviWORCWEw' },
      { name: 'Étirement dorsaux à genoux', weight: '', reps: '60 sec / côté', detail: 'mains loin devant', sets: 2, seconds: 60, video: 'X8ijXOFfYMQ' },
      { name: 'Torsion lombaire allongée', weight: '', reps: '60 sec / côté', detail: 'épaules au sol', sets: 2, seconds: 60, video: 'cvCPeN6XjHs' },
    ]},
    J4: { title: 'Chevilles + épaules', exercises: [
      { name: 'Dorsiflexion genou au mur', weight: '', reps: '90 sec / côté', detail: 'talon collé', sets: 2, seconds: 90, video: 'cPN3-FR-clk' },
      { name: 'Mollet tendu puis fléchi', weight: '', reps: '45 sec + 45 sec / côté', detail: 'tendu puis genou fléchi', sets: 2, seconds: 90, video: 'RObBWavVFzI' },
      { name: 'Dislocations à la serviette', weight: '', reps: '10 reps', detail: 'lentes, prise large', sets: 1, video: 'vP8YmmRMz6I' },
      { name: 'Étirement pectoral au chambranle', weight: '', reps: '60 sec / côté', detail: 'bras en L', sets: 2, seconds: 60, video: 'Q6KfoKo0lSo' },
    ]},
  },
};

const LETTERS = ['A', 'B', 'C'];
const JDAYS = ['J1', 'J2', 'J3', 'J4'];
const REFERENCE = Date.UTC(2026, 7, 8);
const mod = (n, m) => ((n % m) + m) % m;
const fmt = (s) => { const m = Math.floor(s / 60), sec = s % 60; return m > 0 ? `${m}:${String(sec).padStart(2, '0')}` : `${sec}s`; };

const today = new Date();
const diff = Math.round((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - REFERENCE) / 86400000);
const day = PROGRAM[LETTERS[mod(diff, 3)]];
const sday = STRETCH.days[JDAYS[mod(diff, 4)]];

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
document.documentElement.style.setProperty('--accent', day.accent);

/* ---------- Intro : deux sections (Kettlebell + Étirements) ---------- */
document.getElementById('date').textContent =
  today.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
document.getElementById('kbSub').textContent = day.title;
document.getElementById('stSub').textContent = `Base + ${sday.title}`;

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

const flow = [...day.exercises, ...STRETCH.base, ...sday.exercises];
const N = flow.length;

const exScreens = [];
const rdots = [];
const resetters = [];
const chronoStoppers = [];
let congrats;

function goNext(idx) {
  (idx + 1 < N ? exScreens[idx + 1] : congrats).scrollIntoView({ behavior: 'smooth' });
}

function makeExercise(ex, i) {
  const idx = i, num = i + 1;
  const s = document.createElement('section');
  s.className = 'screen ex';
  const weight = ex.weight ? `<span class="weight">${ex.weight}</span>` : '';
  const detail = ex.detail ? `<small>${ex.detail}</small>` : '';

  s.innerHTML = `
    <div class="player" data-video="${ex.video}">
      <button class="poster" style="background-image:url('https://i.ytimg.com/vi/${ex.video}/hqdefault.jpg')" aria-label="Lire ${ex.name}">
        <span class="play">${PLAY_ICON}</span>
      </button>
    </div>
    <div class="overlay-top">
      <span class="pill progress">${num} / ${N}</span>
    </div>
    <div class="overlay-bottom">
      <div class="ex-head"><h2 class="ex-name">${ex.name}</h2>${weight}</div>
      <button class="reps-badge" aria-label="Valider une série">
        <span class="rb-count">${ex.sets}</span>
        <span class="rb-scheme">${ex.reps}${detail}</span>
      </button>
    </div>
  `;

  s.querySelector('.poster').addEventListener('click', () => loadVideo(s));

  // Compteur de séries : tap → décompte ; 0 = terminé → exercice suivant.
  const badge = s.querySelector('.reps-badge');
  const countEl = s.querySelector('.rb-count');
  let left = ex.sets;
  const renderCount = () => { countEl.textContent = left <= 0 ? '✓' : String(left); badge.classList.toggle('done', left <= 0); };
  const decrement = () => {
    if (left <= 0) return;
    left -= 1;
    renderCount();
    if (left <= 0) setTimeout(() => goNext(idx), 650);
  };
  badge.addEventListener('click', decrement);

  // Chrono (exercices en secondes) : à 0 il décrémente le compteur. Optionnel.
  let stopChrono = null;
  if (ex.seconds) {
    const chrono = document.createElement('button');
    chrono.className = 'pill chrono';
    let remaining = ex.seconds, timer = null;
    const paint = () => { chrono.innerHTML = `<span class="tdot"></span>${fmt(remaining)}`; chrono.classList.toggle('running', !!timer); };
    const halt = () => { if (timer) { clearInterval(timer); timer = null; } paint(); };
    const tick = () => {
      remaining -= 1;
      if (remaining <= 0) { halt(); remaining = ex.seconds; decrement(); }
      paint();
    };
    chrono.addEventListener('click', () => { if (timer) halt(); else { timer = setInterval(tick, 1000); paint(); } });
    paint();
    s.querySelector('.overlay-top').appendChild(chrono);
    stopChrono = () => { if (timer) { clearInterval(timer); timer = null; paint(); } };
    resetters.push(() => { left = ex.sets; renderCount(); if (timer) { clearInterval(timer); timer = null; } remaining = ex.seconds; paint(); });
  } else {
    resetters.push(() => { left = ex.sets; renderCount(); });
  }
  chronoStoppers.push(stopChrono);

  const rdot = document.createElement('button');
  rdot.className = 'rdot';
  rdot.addEventListener('click', () => s.scrollIntoView({ behavior: 'smooth' }));
  rail.appendChild(rdot);

  exScreens.push(s);
  rdots.push(rdot);
  feed.appendChild(s);
}

flow.forEach((ex, i) => makeExercise(ex, i));

congrats = document.createElement('section');
congrats.className = 'screen congrats';
congrats.innerHTML = `
  <div class="section-inner">
    <div class="emoji">💪</div>
    <h1>Séance terminée !</h1>
    <p>Bravo — kettlebell + étirements bouclés.</p>
    <button class="start" id="restart">Recommencer</button>
  </div>`;
feed.appendChild(congrats);

/* ---------- Vidéos : une seule active (autoplay muet + boucle) ---------- */
function embedURL(id) {
  const p = new URLSearchParams({
    autoplay: '1', mute: '1', loop: '1', playlist: id,
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
  if (active >= 0) { unloadVideo(exScreens[active]); if (chronoStoppers[active]) chronoStoppers[active](); }
  active = idx;
  rdots.forEach((d, i) => d.classList.toggle('active', i === idx));
  rail.classList.toggle('hidden', idx < 0);
  if (idx >= 0) loadVideo(exScreens[idx]);
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

feed.scrollTop = 0;
window.addEventListener('load', () => { feed.scrollTop = 0; });

/* ---------- Astuce d'installation (iOS, hors mode standalone) ---------- */
const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !standalone) document.getElementById('install').hidden = false;

/* ---------- Service worker ---------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
