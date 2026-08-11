import { PROGRAM, ROTATION, WARMUP } from './program.js';

/* ---------------------------------------------------------------------------
 * Coach — la séance du jour.
 *   • Échauffement commun, puis rotation interne définie dans program.js
 * Rotations déterministes (+1 cran / jour civil). Détail interne, jamais montré.
 * Aucun état conservé : rafraîchir redémarre la séance depuis le début.
 * ------------------------------------------------------------------------- */

const mod = (n, m) => ((n % m) + m) % m;
const fmt = (s) => { const m = Math.floor(s / 60), sec = s % 60; return m > 0 ? `${m}:${String(sec).padStart(2, '0')}` : `${sec}s`; };

const today = new Date();
const [referenceYear, referenceMonth, referenceDay] = ROTATION.reference.split('-').map(Number);
const REFERENCE = Date.UTC(referenceYear, referenceMonth - 1, referenceDay);
const diff = Math.round((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - REFERENCE) / 86400000);
const day = PROGRAM[ROTATION.kettlebell[mod(diff, ROTATION.kettlebell.length)]];
const themeColor = document.querySelector('meta[name="theme-color"]');

function syncViewportHeight() {
  document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
}
syncViewportHeight();
window.addEventListener('resize', syncViewportHeight);
window.addEventListener('orientationchange', () => requestAnimationFrame(syncViewportHeight));
window.addEventListener('pageshow', syncViewportHeight);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) requestAnimationFrame(syncViewportHeight);
});

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
/* ---------- Intro : échauffement commun + séance du jour ---------- */
document.getElementById('date').textContent =
  today.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
document.getElementById('warmupTitle').textContent = WARMUP.title;

function fillList(el, items, showBlocks = false) {
  let previousBlock;
  items.forEach((ex) => {
    if (showBlocks && ex.block && ex.block !== previousBlock) {
      const label = document.createElement('li');
      label.className = 'preview-block';
      label.textContent = ex.block;
      el.appendChild(label);
      previousBlock = ex.block;
    }
    const li = document.createElement('li');
    const w = ex.weight ? ` · ${ex.weight}` : '';
    li.innerHTML = `<span>${ex.name}</span><span>${ex.reps}${w}</span>`;
    el.appendChild(li);
  });
}
fillList(document.getElementById('warmupList'), WARMUP.exercises);
fillList(document.getElementById('programList'), day.exercises, true);

const estimatedMinutes = WARMUP.estimatedMinutes + day.estimatedMinutes;
const finishFormatter = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' });
document.getElementById('durationEstimate').textContent = `${estimatedMinutes} min`;
function updateFinishEstimate() {
  document.getElementById('finishEstimate').textContent = finishFormatter.format(Date.now() + estimatedMinutes * 60000);
}
updateFinishEstimate();
setInterval(updateFinishEstimate, 60000);

/* ---------- Construction du feed ---------- */
const feed = document.getElementById('feed');
const rail = document.getElementById('rail');
const PLAY_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';

const flow = [...WARMUP.exercises, ...day.exercises];
const N = flow.length;

const exScreens = [];
const rdots = [];
const resetters = [];
const chronoStoppers = [];
let congrats;

function goNext(idx) {
  scrollToScreen(idx + 1);
}

function makeExercise(ex, i) {
  const idx = i, num = i + 1;
  const s = document.createElement('section');
  s.className = 'screen ex';
  const weight = ex.weight ? `<span class="weight">${ex.weight}</span>` : '';
  const detail = ex.detail ? `<small>${ex.detail}</small>` : '';
  const block = ex.block || (i < WARMUP.exercises.length ? WARMUP.title : '');
  const blockPill = block ? `<span class="pill ex-block">${block}</span>` : '';

  s.innerHTML = `
    <div class="player" data-video="${ex.video}" data-start="${ex.start ?? ''}" data-end="${ex.end ?? ''}">
      <button class="poster" style="background-image:url('https://i.ytimg.com/vi/${ex.video}/hqdefault.jpg')" aria-label="Lire ${ex.name}">
        <span class="play">${PLAY_ICON}</span>
      </button>
    </div>
    <div class="overlay-top">
      <div class="overlay-meta">
        <span class="pill progress">${num} / ${N}</span>
        ${blockPill}
      </div>
    </div>
    <div class="overlay-bottom">
      <div class="ex-head"><h2 class="ex-name">${ex.name}</h2>${weight}</div>
      <button class="reps-badge" aria-label="Valider une série">
        <span class="rb-count">${ex.sets}</span>
        <span class="rb-scheme">${ex.reps}${detail}</span>
      </button>
    </div>
  `;

  s.querySelector('.poster').addEventListener('click', () => {
    sessionStarted = true;
    if (s.querySelector('.player').dataset.loaded) requestAudiblePlayback(s);
    else loadVideo(s);
  });

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
  rdot.addEventListener('click', () => scrollToScreen(idx));
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
    <p>Bravo — échauffement et séance du jour bouclés.</p>
    <button class="start" id="restart">Recommencer</button>
  </div>`;
feed.appendChild(congrats);

/* ---------- Vidéos : une seule active (autoplay avec son + boucle) ---------- */
const activeVideo = document.getElementById('activeVideo');
let activeVideoSection = null;
let youtubePlayer = null;
let youtubePlayerReady = false;
let youtubePlayerAttaching = false;
let youtubeAPIReady;

function loadYouTubeAPI() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeAPIReady) return youtubeAPIReady;

  youtubeAPIReady = new Promise((resolve, reject) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (previousReady) previousReady();
      resolve(window.YT);
    };

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.addEventListener('error', () => reject(new Error('YouTube API unavailable')), { once: true });
    document.head.appendChild(script);
  });

  return youtubeAPIReady;
}

function embedURL(id, start, end) {
  const p = new URLSearchParams({
    autoplay: '1', mute: '0',
    controls: '0', disablekb: '1', fs: '0', rel: '0', playsinline: '1',
    cc_load_policy: '0', iv_load_policy: '3', enablejsapi: '1',
  });
  if (location.protocol === 'http:' || location.protocol === 'https:') p.set('origin', location.origin);
  if (start) p.set('start', start);
  if (end) p.set('end', end);
  return `https://www.youtube-nocookie.com/embed/${id}?${p}`;
}

function requestAudiblePlayback(section, player = youtubePlayer) {
  if (!player) return;
  const container = section.querySelector('.player');
  container.dataset.audio = 'requested';
  try {
    player.unMute();
    player.setVolume(100);
    player.playVideo();
  } catch {
    // Le lecteur n'est pas encore prêt : onReady renouvellera la demande.
  }
  setTimeout(() => {
    if (activeVideoSection !== section || container.dataset.audio !== 'requested') return;
    container.dataset.audio = 'blocked';
    activeVideo.classList.add('autoplay-blocked');
    player.getIframe().tabIndex = 0;
  }, 3500);
}

function videoRequest(section) {
  const container = section.querySelector('.player');
  const request = { videoId: container.dataset.video };
  if (container.dataset.start) request.startSeconds = Number(container.dataset.start);
  if (container.dataset.end) request.endSeconds = Number(container.dataset.end);
  return request;
}

function playerContext(player) {
  if (!activeVideoSection) return null;
  const container = activeVideoSection.querySelector('.player');
  const currentVideo = player.getVideoData?.().video_id;
  if (currentVideo && currentVideo !== container.dataset.video) return null;
  return { section: activeVideoSection, container };
}

function playSectionVideo(section) {
  if (!youtubePlayerReady || section !== activeVideoSection) return;
  youtubePlayer.loadVideoById(videoRequest(section));
  requestAudiblePlayback(section);
}

function attachYouTubePlayer(iframe) {
  if (youtubePlayer || youtubePlayerAttaching) return;
  youtubePlayerAttaching = true;
  loadYouTubeAPI().then((YT) => {
    if (!iframe.isConnected) {
      youtubePlayerAttaching = false;
      return;
    }

    youtubePlayer = new YT.Player(iframe.id, {
      events: {
        onReady: (event) => {
          if (youtubePlayer !== event.target) return;
          youtubePlayerReady = true;
          if (!activeVideoSection) {
            event.target.pauseVideo();
            return;
          }
          const expectedVideo = activeVideoSection.querySelector('.player').dataset.video;
          if (event.target.getVideoData().video_id === expectedVideo) requestAudiblePlayback(activeVideoSection, event.target);
          else playSectionVideo(activeVideoSection);
        },
        onStateChange: (event) => {
          const context = playerContext(event.target);
          if (!context) return;
          const { section, container } = context;
          container.dataset.playerState = String(event.data);
          if (event.data === YT.PlayerState.PLAYING) {
            event.target.unMute();
            event.target.setVolume(100);
            container.dataset.audio = event.target.isMuted() ? 'muted' : 'on';
            activeVideo.classList.remove('autoplay-blocked');
            event.target.getIframe().tabIndex = -1;
          }
          if (event.data === YT.PlayerState.ENDED) playSectionVideo(section);
        },
        onAutoplayBlocked: (event) => {
          const context = playerContext(event.target);
          if (!context) return;
          context.container.dataset.audio = 'blocked';
          activeVideo.classList.add('autoplay-blocked');
          event.target.getIframe().tabIndex = 0;
        },
        onError: (event) => {
          const context = playerContext(event.target);
          if (context) context.container.dataset.playerError = String(event.data);
        },
      },
    });
    youtubePlayerAttaching = false;
  }).catch(() => {
    // Les paramètres de l'iframe restent le repli si l'API ne charge pas.
    youtubePlayerAttaching = false;
  });
}

function loadVideo(section) {
  const container = section.querySelector('.player');
  if (container.dataset.loaded) {
    requestAudiblePlayback(section);
    return;
  }
  container.dataset.loaded = '1';
  activeVideoSection = section;
  activeVideo.hidden = false;
  activeVideo.classList.remove('autoplay-blocked');

  const title = section.querySelector('.ex-name').textContent;
  const existingIframe = activeVideo.querySelector('iframe');
  if (youtubePlayerReady) {
    youtubePlayer.getIframe().title = title;
    playSectionVideo(section);
    return;
  }
  if (existingIframe) {
    existingIframe.title = title;
    if (!youtubePlayer) existingIframe.src = embedURL(container.dataset.video, container.dataset.start, container.dataset.end);
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'youtube-player';
  iframe.src = embedURL(container.dataset.video, container.dataset.start, container.dataset.end);
  iframe.title = title;
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
  iframe.tabIndex = -1;
  // Requis depuis fin 2025 : YouTube exige un referrer valide, sinon "Error 153".
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  activeVideo.appendChild(iframe);
  attachYouTubePlayer(iframe);
}
function unloadVideo(section) {
  const container = section.querySelector('.player');
  if (!container.dataset.loaded) return;
  delete container.dataset.loaded;
  delete container.dataset.audio;
  delete container.dataset.playerState;
  delete container.dataset.playerError;
  if (activeVideoSection !== section) return;
  activeVideoSection = null;
  activeVideo.hidden = true;
  activeVideo.classList.remove('autoplay-blocked');
  if (youtubePlayerReady) youtubePlayer.pauseVideo();
}

// Précharge l'API : elle est normalement prête quand l'utilisateur touche « Commencer ».
loadYouTubeAPI().catch(() => {});

let active = -1;
let sessionStarted = false;
function setActive(idx) {
  if (idx === active) return;
  if (active >= 0 && active < N) {
    unloadVideo(exScreens[active]);
    if (chronoStoppers[active]) chronoStoppers[active]();
  }
  active = idx;
  const inSession = idx >= 0 && idx < N;
  document.documentElement.classList.toggle('in-session', inSession);
  themeColor.content = inSession ? '#000000' : '#20242c';
  rdots.forEach((d, i) => d.classList.toggle('active', i === idx));
  rail.classList.toggle('hidden', idx < 0 || idx >= N);
  if (idx >= 0 && idx < N && sessionStarted) loadVideo(exScreens[idx]);
}

const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting && e.intersectionRatio >= 0.6) {
      if (e.target === congrats) setActive(N);
      else setActive(e.target.classList.contains('ex') ? exScreens.indexOf(e.target) : -1);
    }
  }
}, { root: null, threshold: [0.6] });
[...feed.querySelectorAll('.screen')].forEach((s) => io.observe(s));

/* ---------- Navigation ---------- */
const intro = document.getElementById('intro');
function screenAt(idx) {
  if (idx < 0) return intro;
  if (idx >= N) return congrats;
  return exScreens[idx];
}
function scrollToScreen(idx) {
  screenAt(idx).scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function moveBy(direction) {
  if (active < 0) {
    if (direction > 0) scrollToScreen(0);
    return;
  }
  scrollToScreen(Math.max(-1, Math.min(N, active + direction)));
}
document.getElementById('start').addEventListener('click', () => {
  sessionStarted = true;
  loadVideo(exScreens[0]);
  scrollToScreen(0);
});
document.getElementById('restart').addEventListener('click', () => {
  resetters.forEach((fn) => fn());
  scrollToScreen(-1);
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); moveBy(1); }
  if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); moveBy(-1); }
});

let wheelDelta = 0;
let wheelRelease;
window.addEventListener('wheel', (e) => {
  // L'accueil peut dépasser la hauteur de l'écran : il garde son scroll naturel.
  if (active < 0 || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
  e.preventDefault();
  if (wheelRelease) {
    clearTimeout(wheelRelease);
    wheelRelease = setTimeout(() => { wheelRelease = null; }, 500);
    return;
  }
  wheelDelta += e.deltaY;
  if (Math.abs(wheelDelta) < 24) return;
  const direction = Math.sign(wheelDelta);
  wheelDelta = 0;
  moveBy(direction);
  wheelRelease = setTimeout(() => { wheelRelease = null; }, 500);
}, { passive: false });

window.scrollTo(0, 0);
window.addEventListener('load', () => { window.scrollTo(0, 0); });

/* ---------- Astuce d'installation (iOS, hors mode standalone) ---------- */
const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !standalone) document.getElementById('install').hidden = false;

/* ---------- Service worker ---------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
