import { PROGRAM, ROTATION, WARMUP } from './program.js';

/* ---------------------------------------------------------------------------
 * Coach+ — la séance du jour.
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

const ALTERNATION_NOTE = /\s*\(on change de côté à chaque tour\)/i;
const PER_SIDE = /\s*\/\s*côté/i;

function stripAlternationNote(reps) {
  return reps.replace(ALTERNATION_NOTE, '').trim();
}

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
    li.innerHTML = `<span>${ex.name}</span><span>${stripAlternationNote(ex.reps)}${w}</span>`;
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
const sessionProgress = document.getElementById('sessionProgress');
const sessionProgressFill = sessionProgress.querySelector('span');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const PLAY_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
const CHECK_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m5 12 4 4L19 6"/></svg>';
const TIMER_PLAY_ICON = '<svg class="timer-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
const TIMER_PAUSE_ICON = '<svg class="timer-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zm6 0h4v14h-4z"/></svg>';

function shortBlockName(block) {
  return block?.split(' — ')[0] || '';
}

function perPassReps(ex, { perRound = false, singleSide = false } = {}) {
  let reps = stripAlternationNote(ex.reps);
  if (perRound) {
    reps = reps.replace(new RegExp(`^${ex.sets}\\s*[×x]\\s*`, 'i'), '');
    reps = reps.replace(/\s+par tour$/i, '');
  }
  if (singleSide) reps = reps.replace(PER_SIDE, '').trim();
  return reps;
}

function makeStep(ex, context = {}) {
  return {
    ...ex,
    displayReps: context.displayReps || ex.reps,
    blockLabel: context.blockLabel || '',
    round: context.round || 0,
    rounds: context.rounds || 0,
    series: context.series || 0,
    seriesTotal: context.seriesTotal || 0,
    side: context.side || '',
  };
}

function expandStandalone(ex, blockLabel) {
  if (ex.sets === 2 && PER_SIDE.test(ex.reps)) {
    return ['Côté droit', 'Côté gauche'].map((side) => makeStep(ex, {
      blockLabel,
      side,
      displayReps: perPassReps(ex, { singleSide: true }),
    }));
  }

  if (ex.sets > 1) {
    return Array.from({ length: ex.sets }, (_, index) => makeStep(ex, {
      blockLabel,
      series: index + 1,
      seriesTotal: ex.sets,
      displayReps: perPassReps(ex, { perRound: true }),
    }));
  }

  return [makeStep(ex, { blockLabel, displayReps: stripAlternationNote(ex.reps) })];
}

function expandProgram(items) {
  const groups = [];
  for (const ex of items) {
    const previous = groups[groups.length - 1];
    if (previous?.block === ex.block) previous.exercises.push(ex);
    else groups.push({ block: ex.block, exercises: [ex] });
  }

  return groups.flatMap(({ block, exercises }) => {
    const rounds = Number(block?.match(/(\d+)\s+tours?\b/i)?.[1] || 1);
    const blockLabel = shortBlockName(block);
    if (rounds <= 1) return exercises.flatMap((ex) => expandStandalone(ex, blockLabel));

    const steps = [];
    for (let round = 1; round <= rounds; round += 1) {
      for (const ex of exercises) {
        const alternates = ALTERNATION_NOTE.test(ex.reps);
        const bothSides = !alternates && PER_SIDE.test(ex.reps);
        const sides = alternates
          ? [round % 2 === 1 ? 'Côté droit' : 'Côté gauche']
          : (bothSides ? ['Côté droit', 'Côté gauche'] : ['']);
        for (const side of sides) {
          steps.push(makeStep(ex, {
            blockLabel,
            round,
            rounds,
            side,
            displayReps: perPassReps(ex, { perRound: true, singleSide: Boolean(side) }),
          }));
        }
      }
    }
    return steps;
  });
}

const flow = [
  ...WARMUP.exercises.flatMap((ex) => expandStandalone(ex, WARMUP.title)),
  ...expandProgram(day.exercises),
];
const N = flow.length;
rail.classList.toggle('dense', N > 20);

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
  const blockPill = ex.blockLabel ? `<span class="pill ex-block">${ex.blockLabel}</span>` : '';
  const roundPill = ex.rounds ? `<span class="pill round-pill">Tour ${ex.round} / ${ex.rounds}</span>` : '';
  const seriesPill = ex.seriesTotal ? `<span class="pill round-pill">Série ${ex.series} / ${ex.seriesTotal}</span>` : '';
  const sideInfo = ex.side ? `<div class="side-info"><span></span>${ex.side}</div>` : '';

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
        ${roundPill}
        ${seriesPill}
      </div>
    </div>
    <div class="overlay-bottom">
      ${sideInfo}
      <div class="ex-head"><h2 class="ex-name">${ex.name}</h2>${weight}</div>
      <div class="reps-info"><strong class="reps-value">${ex.displayReps}</strong>${detail}</div>
      <div class="exercise-actions">
        <button class="complete-action" aria-label="Terminer et passer à l'exercice suivant">
          ${CHECK_ICON}
          <span class="complete-label">Terminé</span>
        </button>
      </div>
    </div>
  `;

  s.querySelector('.poster').addEventListener('click', () => {
    sessionStarted = true;
    if (s.querySelector('.player').dataset.loaded) requestAudiblePlayback(s);
    else loadVideo(s);
  });

  // Chaque écran est une seule action : la validation passe au prochain mouvement du tour.
  const badge = s.querySelector('.complete-action');
  const completeLabel = s.querySelector('.complete-label');
  let done = false;
  const renderCount = () => { completeLabel.textContent = done ? 'Validé' : 'Terminé'; badge.classList.toggle('done', done); };
  const complete = () => {
    if (done) return;
    done = true;
    renderCount();
    setTimeout(() => goNext(idx), 650);
  };
  badge.addEventListener('click', complete);

  // Chrono (exercices en secondes) : à 0 il valide le passage. Optionnel.
  let stopChrono = null;
  if (ex.seconds) {
    const chrono = document.createElement('button');
    chrono.className = 'pill chrono';
    let remaining = ex.seconds, timer = null;
    const paint = () => {
      chrono.innerHTML = `${timer ? TIMER_PAUSE_ICON : TIMER_PLAY_ICON}<span>${fmt(remaining)}</span>`;
      chrono.classList.toggle('running', !!timer);
      chrono.setAttribute('aria-label', `${timer ? 'Mettre en pause' : 'Démarrer'} le chronomètre, ${fmt(remaining)}`);
    };
    const halt = () => { if (timer) { clearInterval(timer); timer = null; } paint(); };
    const tick = () => {
      remaining -= 1;
      if (remaining <= 0) { halt(); remaining = ex.seconds; complete(); }
      paint();
    };
    chrono.addEventListener('click', () => { if (timer) halt(); else { timer = setInterval(tick, 1000); paint(); } });
    paint();
    const actions = s.querySelector('.exercise-actions');
    actions.classList.add('has-chrono');
    actions.appendChild(chrono);
    stopChrono = () => { if (timer) { clearInterval(timer); timer = null; paint(); } };
    resetters.push(() => { done = false; renderCount(); if (timer) { clearInterval(timer); timer = null; } remaining = ex.seconds; paint(); });
  } else {
    resetters.push(() => { done = false; renderCount(); });
  }
  chronoStoppers.push(stopChrono);

  const rdot = document.createElement('button');
  rdot.className = 'rdot';
  rdot.setAttribute('aria-label', `Aller à ${ex.name}${ex.rounds ? `, tour ${ex.round} sur ${ex.rounds}` : ''}${ex.side ? `, ${ex.side.toLowerCase()}` : ''}`);
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
const soundUnlock = document.getElementById('soundUnlock');
let activeVideoSection = null;
let youtubePlayer = null;
let youtubePlayerReady = false;
let youtubePlayerAttaching = false;
let youtubeAPIReady;
let videoLoopGuard = null;

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
    loop: '1', playlist: id,
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
    activeVideo.classList.remove('video-playing');
    activeVideo.classList.add('autoplay-blocked');
    soundUnlock.hidden = false;
  }, 3500);
}

function disableYouTubeCaptions(player = youtubePlayer) {
  if (!player) return;
  try {
    if (!player.getOptions().includes('captions')) return;
    // La préférence YouTube du compte peut outrepasser cc_load_policy=0.
    // Vider la piste puis décharger le module garde les sous-titres coupés.
    player.setOption('captions', 'track', {});
    player.unloadModule('captions');
  } catch {
    // Ces méthodes ne sont disponibles qu'une fois le module lecteur prêt.
  }
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

function syncVideoTitle(section, player = youtubePlayer) {
  if (!section || !player) return;
  player.getIframe().title = section.querySelector('.ex-name').textContent;
}

function videoMatchesSection(section, player = youtubePlayer) {
  if (!section || !player) return false;
  return player.getVideoData?.().video_id === section.querySelector('.player').dataset.video;
}

function playSectionVideo(section) {
  if (!youtubePlayerReady || section !== activeVideoSection) return;
  stopVideoLoopGuard();
  syncVideoTitle(section);
  youtubePlayer.loadVideoById(videoRequest(section));
  requestAudiblePlayback(section);
}

function stopVideoLoopGuard() {
  if (!videoLoopGuard) return;
  clearInterval(videoLoopGuard);
  videoLoopGuard = null;
}

function restartSectionVideo(section, player = youtubePlayer) {
  if (!player || section !== activeVideoSection) return;
  const { startSeconds = 0 } = videoRequest(section);
  try {
    player.seekTo(startSeconds, true);
    player.unMute();
    player.setVolume(100);
    player.playVideo();
  } catch {
    // Le prochain événement du lecteur relancera la boucle.
  }
}

// Reboucle juste avant l'état ENDED afin que l'écran de recommandations
// YouTube n'ait jamais le temps de remplacer la démonstration.
function startVideoLoopGuard(section, player = youtubePlayer) {
  stopVideoLoopGuard();
  videoLoopGuard = setInterval(() => {
    if (section !== activeVideoSection || player.getPlayerState() !== window.YT?.PlayerState.PLAYING) return;
    const request = videoRequest(section);
    const loopEnd = request.endSeconds || player.getDuration();
    const loopStart = request.startSeconds || 0;
    if (loopEnd > loopStart + 0.75 && player.getCurrentTime() >= loopEnd - 0.35) {
      restartSectionVideo(section, player);
    }
  }, 200);
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
          disableYouTubeCaptions(event.target);
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
          syncVideoTitle(section, event.target);
          container.dataset.playerState = String(event.data);
          if (event.data === YT.PlayerState.PLAYING) {
            disableYouTubeCaptions(event.target);
            event.target.unMute();
            event.target.setVolume(100);
            container.dataset.audio = event.target.isMuted() ? 'muted' : 'on';
            activeVideo.classList.remove('autoplay-blocked');
            activeVideo.classList.add('video-playing');
            soundUnlock.hidden = true;
            event.target.getIframe().tabIndex = -1;
            startVideoLoopGuard(section, event.target);
          }
          if (event.data === YT.PlayerState.PAUSED) {
            // YouTube injecte « More videos » dans l'iframe en pause. Le lecteur
            // reste masqué tant qu'il n'émet pas de nouveau PLAYING.
            activeVideo.classList.remove('video-playing');
            if (!document.hidden) requestAudiblePlayback(section, event.target);
          }
          if (event.data === YT.PlayerState.BUFFERING || event.data === YT.PlayerState.CUED) {
            activeVideo.classList.remove('video-playing');
          }
          if (event.data === YT.PlayerState.ENDED) {
            activeVideo.classList.remove('video-playing');
            restartSectionVideo(section, event.target);
          }
        },
        onApiChange: (event) => disableYouTubeCaptions(event.target),
        onAutoplayBlocked: (event) => {
          const context = playerContext(event.target);
          if (!context) return;
          context.container.dataset.audio = 'blocked';
          activeVideo.classList.remove('video-playing');
          activeVideo.classList.add('autoplay-blocked');
          soundUnlock.hidden = false;
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
  activeVideo.classList.remove('autoplay-blocked', 'video-playing');
  soundUnlock.hidden = true;

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
  stopVideoLoopGuard();
  activeVideo.hidden = true;
  activeVideo.classList.remove('autoplay-blocked', 'video-playing');
  soundUnlock.hidden = true;
  if (youtubePlayerReady) youtubePlayer.pauseVideo();
}

soundUnlock.addEventListener('click', () => {
  if (activeVideoSection) requestAudiblePlayback(activeVideoSection);
});

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
  const progress = idx < 0 ? 0 : (idx >= N ? 1 : (idx + 1) / N);
  sessionProgressFill.style.transform = `scaleX(${progress})`;
  sessionProgress.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
  rdots.forEach((d, i) => d.classList.toggle('active', i === idx));
  rail.classList.toggle('hidden', idx < 0 || idx >= N);
  if (idx >= 0 && idx < N && sessionStarted) loadVideo(exScreens[idx]);
}

const io = new IntersectionObserver((entries) => {
  if (navigationTarget !== null) return;
  for (const e of entries) {
    if (e.isIntersecting && e.intersectionRatio >= 0.6) {
      if (!sessionStarted && e.target !== intro) {
        window.scrollTo({ top: 0, behavior: 'instant' });
        setActive(-1);
        return;
      }
      if (e.target === congrats) setActive(N);
      else setActive(e.target.classList.contains('ex') ? exScreens.indexOf(e.target) : -1);
    }
  }
}, { root: null, threshold: [0.6] });
[...feed.querySelectorAll('.screen')].forEach((s) => io.observe(s));

/* ---------- Navigation ---------- */
const intro = document.getElementById('intro');
let navigationTarget = null;
let navigationFallback = null;
function screenAt(idx) {
  if (idx < 0) return intro;
  if (idx >= N) return congrats;
  return exScreens[idx];
}
function finishNavigation() {
  if (navigationTarget === null) return;
  const target = navigationTarget;
  navigationTarget = null;
  if (navigationFallback) clearTimeout(navigationFallback);
  navigationFallback = null;
  document.documentElement.classList.remove('is-navigating');
  setActive(target);
  if (target >= 0 && target < N && sessionStarted && !videoMatchesSection(exScreens[target])) {
    loadVideo(exScreens[target]);
  }
}
function scrollToScreen(idx, behavior = 'smooth') {
  const target = Math.max(-1, Math.min(N, idx));
  const scrollBehavior = reducedMotion.matches ? 'instant' : behavior;
  navigationTarget = target;
  document.documentElement.classList.add('is-navigating');
  setActive(target);
  screenAt(target).scrollIntoView({ behavior: scrollBehavior, block: 'start' });
  if (navigationFallback) clearTimeout(navigationFallback);
  navigationFallback = setTimeout(finishNavigation, scrollBehavior === 'smooth' ? 900 : 0);
}
function moveBy(direction) {
  const current = navigationTarget ?? active;
  if (current < 0) {
    if (direction > 0) scrollToScreen(0);
    return;
  }
  scrollToScreen(current + direction);
}
window.addEventListener('scrollend', finishNavigation);
document.getElementById('start').addEventListener('click', () => {
  sessionStarted = true;
  document.documentElement.classList.add('session-started');
  loadVideo(exScreens[0]);
  scrollToScreen(0);
});
document.getElementById('restart').addEventListener('click', () => {
  resetters.forEach((fn) => fn());
  sessionStarted = false;
  document.documentElement.classList.remove('session-started');
  scrollToScreen(-1);
});
window.addEventListener('keydown', (e) => {
  if (!sessionStarted) {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(e.key)) e.preventDefault();
    return;
  }
  if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); moveBy(1); }
  if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); moveBy(-1); }
});

let wheelDelta = 0;
let wheelRelease;
function releaseWheel() {
  wheelRelease = null;
  wheelDelta = 0;
}
window.addEventListener('wheel', (e) => {
  if (!sessionStarted) {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) e.preventDefault();
    return;
  }
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
  e.preventDefault();
  if (wheelRelease) {
    clearTimeout(wheelRelease);
    wheelRelease = setTimeout(releaseWheel, 500);
    return;
  }
  wheelDelta += e.deltaY;
  if (Math.abs(wheelDelta) < 24) return;
  const direction = Math.sign(wheelDelta);
  wheelDelta = 0;
  moveBy(direction);
  wheelRelease = setTimeout(releaseWheel, 500);
}, { passive: false });

let touchStartX = null;
let touchStartY = null;
let touchDeltaY = 0;
function resetTouch() {
  touchStartX = null;
  touchStartY = null;
  touchDeltaY = 0;
}
window.addEventListener('touchstart', (e) => {
  if (!sessionStarted || e.touches.length !== 1) return;
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  touchDeltaY = 0;
}, { passive: true });
window.addEventListener('touchmove', (e) => {
  if (!sessionStarted || touchStartY === null || e.touches.length !== 1) return;
  const deltaX = e.touches[0].clientX - touchStartX;
  touchDeltaY = touchStartY - e.touches[0].clientY;
  if (Math.abs(touchDeltaY) <= Math.abs(deltaX) || Math.abs(touchDeltaY) < 6) return;
  // La page ne se déplace jamais librement : le geste sera résolu vers un écran.
  e.preventDefault();
}, { passive: false });
window.addEventListener('touchend', () => {
  if (!sessionStarted || touchStartY === null) return;
  if (Math.abs(touchDeltaY) >= 36) moveBy(Math.sign(touchDeltaY));
  resetTouch();
});
window.addEventListener('touchcancel', resetTouch);

window.scrollTo(0, 0);
window.addEventListener('load', () => { window.scrollTo(0, 0); });

/* ---------- Astuce d'installation (iOS, hors mode standalone) ---------- */
const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !standalone) document.getElementById('install').hidden = false;

/* ---------- Service worker ---------- */
if ('serviceWorker' in navigator) {
  if (import.meta.env?.DEV) {
    // Un ancien SW de production peut mettre en cache les modules et casser le HMR.
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  } else {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
}
