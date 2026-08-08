'use strict';

/* ---------------------------------------------------------------------------
 * Programme kettlebell — rotation A / B / C, déterministe.
 * Référence : le 8 août 2026 = Jour A. Chaque jour civil avance d'un cran.
 * ------------------------------------------------------------------------- */

const PROGRAM = {
  A: {
    title: 'Charnière + poussée',
    subtitle: '',
    accent: '#f97316',
    exercises: [
      { name: 'Swings 2 mains', weight: '12 kg', reps: '10 × 10', detail: '1 série par minute', sets: 10,
        note: 'Conditionnement + travail de charnière, pas de la force pure.', video: 'nkWkssEvo3A', q: 'kettlebell swing 2 mains technique' },
      { name: 'Rowing australien', weight: '', reps: '3 × 10', detail: '', sets: 3,
        note: 'Pieds surélevés sur une chaise dès que possible.', video: 'nB2sOQ7613Q', q: 'traction australienne rowing technique' },
      { name: 'Goblet squat', weight: '12 kg', reps: '3 × 10', detail: 'tempo 3-1-1', sets: 3,
        note: '3 s de descente, 1 s en bas, 1 s de montée.', video: '5z86H2vki_8', q: 'goblet squat kettlebell technique' },
      { name: 'Pompes', weight: '', reps: '3 séries', detail: '', sets: 3,
        note: "S'arrêter 2 reps avant l'échec — c'est ta poussée principale.", video: 'IODxDxX7oi4', q: 'pompes technique parfaite' },
      { name: 'Floor press', weight: '12 kg', reps: '2 × 12 / bras', detail: '', sets: 2,
        note: '', video: 'B340QckIfJM', q: 'floor press kettlebell un bras' },
      { name: 'Carry asymétrique', weight: '12 / 6 kg', reps: '2 × 30 s', detail: '', sets: 2,
        note: '12 kg d’un côté, 6 kg de l’autre.', video: 'iq5D5SU2Oq4', q: 'suitcase carry kettlebell technique' },
    ],
  },
  B: {
    title: 'Jambes + dos',
    subtitle: '',
    accent: '#38bdf8',
    exercises: [
      { name: 'Turkish get-up', weight: '12 kg', reps: '5 × 1 / côté', detail: 'lent', sets: 5,
        note: 'Lent et contrôlé, une répétition à la fois.', video: 'JFrItinMcyQ', q: 'turkish get up technique' },
      { name: 'Split squat bulgare', weight: '12 kg', reps: '3 × 8 / côté', detail: '', sets: 3,
        note: 'Pied arrière sur une chaise. Bien plus dur que la fente arrière.', video: 'eCJxHKDXBqk', q: 'split squat bulgare technique' },
      { name: 'SDT roumain unilatéral', weight: '12 kg', reps: '3 × 10 / côté', detail: 'lent', sets: 3,
        note: 'Soulevé de terre roumain sur une jambe, lent et gainé.', video: 'S8wkyvxNvac', q: 'soulevé de terre roumain unilatéral' },
      { name: 'Rowing un bras', weight: '12 kg', reps: '3 × 15 / côté', detail: '', sets: 3,
        note: '1 s de contraction en haut.', video: 'l5qelXL5nfs', q: 'rowing un bras kettlebell technique' },
      { name: 'Pullover', weight: '6 kg', reps: '3 × 15', detail: '', sets: 3,
        note: '', video: 'tcHaHIQStsk', q: 'pullover haltère technique' },
      { name: 'Gainage latéral', weight: '', reps: '2 × 30 s / côté', detail: '', sets: 2,
        note: '', video: 'fIkpxa-kuIA', q: 'gainage latéral planche technique' },
    ],
  },
  C: {
    title: 'Récup active',
    subtitle: '15 min',
    accent: '#34d399',
    exercises: [
      { name: 'Get-up', weight: '6 kg', reps: 'léger', detail: '', sets: 1,
        note: 'Mobilité et contrôle.', video: 'JFrItinMcyQ', q: 'turkish get up léger' },
      { name: 'Pullover', weight: '6 kg', reps: 'léger', detail: '', sets: 1,
        note: '', video: 'tcHaHIQStsk', q: 'pullover haltère technique' },
      { name: 'Halos', weight: '6 kg', reps: 'léger', detail: '', sets: 1,
        note: 'Autour de la tête, lent, dans les deux sens.', video: 'Sci3lijQBmk', q: 'kettlebell halo technique' },
      { name: 'Carries', weight: '', reps: 'marche', detail: '', sets: 1,
        note: 'Marche lestée, gainage.', video: 'CiN1iw856rQ', q: 'farmer carry kettlebell' },
      { name: 'Mobilité hanches / épaules', weight: '', reps: 'flow', detail: '', sets: 1,
        note: 'Ouverture hanches et épaules.', video: 'gDG9QoYpqtU', q: 'mobilité hanches épaules routine' },
    ],
  },
};

const LETTERS = ['A', 'B', 'C'];
const REFERENCE = Date.UTC(2026, 7, 8); // 8 août 2026 → Jour A (index 0)

function dayLetter(date) {
  const local = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.round((local - REFERENCE) / 86400000);
  return LETTERS[((diff % 3) + 3) % 3];
}

const today = new Date();
const letter = dayLetter(today);
const day = PROGRAM[letter];
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const nextLetter = dayLetter(tomorrow);
const total = day.exercises.length;

/* ---------- Suivi des séries (localStorage, remis à zéro chaque jour) ---------- */
const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
const storeKey = `kb:${dateKey}:${letter}`;
let done = {};
try { done = JSON.parse(localStorage.getItem(storeKey)) || {}; } catch (_) { done = {}; }
const persist = () => { try { localStorage.setItem(storeKey, JSON.stringify(done)); } catch (_) {} };
const isDone = (ex, set) => !!(done[ex] && done[ex][set]);
const toggle = (ex, set) => { done[ex] = done[ex] || {}; done[ex][set] = !done[ex][set]; persist(); };

/* ---------- Intro ---------- */
document.documentElement.style.setProperty('--accent', day.accent);
document.getElementById('date').textContent =
  today.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
document.getElementById('badge').textContent = letter;
document.getElementById('title').textContent = `Jour ${letter}`;
document.getElementById('subtitle').textContent =
  day.subtitle ? `${day.title} · ${day.subtitle}` : day.title;
document.getElementById('tomorrow').textContent = `Demain : Jour ${nextLetter}`;

const preview = document.getElementById('preview');
day.exercises.forEach((ex) => {
  const li = document.createElement('li');
  const w = ex.weight ? ` · ${ex.weight}` : '';
  li.innerHTML = `<span>${ex.name}</span><span>${ex.reps}${w}</span>`;
  preview.appendChild(li);
});

/* ---------- Écrans d'exercices ---------- */
const feed = document.getElementById('feed');
const rail = document.getElementById('rail');
const PLAY_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';

day.exercises.forEach((ex, i) => {
  const s = document.createElement('section');
  s.className = 'screen ex';
  s.dataset.index = String(i);

  const weight = ex.weight ? `<span class="weight">${ex.weight}</span>` : '';
  const detail = ex.detail ? `<span class="detail">${ex.detail}</span>` : '';
  const note = ex.note ? `<p class="note">${ex.note}</p>` : '';
  const hint = i === 0 ? '<div class="swipe-hint">↑ glisse pour l\'exercice suivant</div>' : '';

  s.innerHTML = `
    <div class="player" data-video="${ex.video}">
      <button class="poster" style="background-image:url('https://i.ytimg.com/vi/${ex.video}/hqdefault.jpg')" aria-label="Lire ${ex.name}">
        <span class="play">${PLAY_ICON}</span>
      </button>
    </div>
    <div class="overlay-top">
      <span class="pill"><span class="dayletter">Jour ${letter}</span> · ${day.title}</span>
      <span class="pill">${i + 1} / ${total}</span>
    </div>
    ${hint}
    <div class="overlay-bottom">
      <div class="ex-head"><h2 class="ex-name">${ex.name}</h2>${weight}</div>
      <div class="scheme"><span class="reps">${ex.reps}</span>${detail}</div>
      ${note}
      <div class="sets"></div>
      <a class="yt-fallback" target="_blank" rel="noopener"
         href="https://www.youtube.com/results?search_query=${encodeURIComponent(ex.q)}">Voir d'autres vidéos ↗</a>
    </div>
  `;

  // suivi des séries
  const setsEl = s.querySelector('.sets');
  if (ex.sets > 1) {
    for (let k = 0; k < ex.sets; k++) {
      const b = document.createElement('button');
      b.className = 'set' + (isDone(i, k) ? ' done' : '');
      b.textContent = String(k + 1);
      b.addEventListener('click', () => { toggle(i, k); b.classList.toggle('done'); });
      setsEl.appendChild(b);
    }
  } else {
    const b = document.createElement('button');
    b.className = 'set wide' + (isDone(i, 0) ? ' done' : '');
    b.textContent = isDone(i, 0) ? 'Terminé ✓' : 'Marquer comme fait';
    b.addEventListener('click', () => {
      toggle(i, 0);
      const d = isDone(i, 0);
      b.classList.toggle('done', d);
      b.textContent = d ? 'Terminé ✓' : 'Marquer comme fait';
    });
    setsEl.appendChild(b);
  }

  // clic manuel sur la vidéo (secours si l'autoplay est bloqué)
  s.querySelector('.poster').addEventListener('click', () => loadVideo(s));

  feed.appendChild(s);

  const rdot = document.createElement('button');
  rdot.className = 'rdot';
  rdot.addEventListener('click', () => s.scrollIntoView({ behavior: 'smooth' }));
  rail.appendChild(rdot);
});

const screens = [...feed.querySelectorAll('.ex')];
const rdots = [...rail.children];

/* ---------- Chargement / déchargement des vidéos (une seule active) ---------- */
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
  if (active >= 0) unloadVideo(screens[active]);
  active = idx;
  rdots.forEach((d, i) => d.classList.toggle('active', i === idx));
  rail.classList.toggle('hidden', idx < 0);
  if (idx >= 0) loadVideo(screens[idx]);
}

const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting && e.intersectionRatio >= 0.6) {
      setActive(e.target.classList.contains('ex') ? screens.indexOf(e.target) : -1);
    }
  }
}, { root: feed, threshold: [0.6] });
io.observe(document.getElementById('intro'));
screens.forEach((s) => io.observe(s));

/* ---------- Navigation ---------- */
document.getElementById('start').addEventListener('click', () => {
  screens[0].scrollIntoView({ behavior: 'smooth' });
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); screens[Math.min(active + 1, total - 1)]?.scrollIntoView({ behavior: 'smooth' }); }
  if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); (active <= 0 ? document.getElementById('intro') : screens[active - 1]).scrollIntoView({ behavior: 'smooth' }); }
});

/* ---------- Astuce d'installation (iOS, hors mode standalone) ---------- */
const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !standalone) document.getElementById('install').hidden = false;

/* ---------- Service worker ---------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
