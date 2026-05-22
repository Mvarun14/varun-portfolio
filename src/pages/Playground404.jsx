import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

const LEADERBOARD_KEY = 'portfolio-play-leaderboard';
const PLAYER_NAME_KEY = 'portfolio-play-name';
const LEADERBOARD_CAP = 10;

const PLAYER_RADIUS = 9;
const ENEMY_RADIUS = 11;
const INITIAL_ENEMIES = 4;
const MAX_ENEMIES = 14;
const WAVE_SECONDS = 8;
const BASE_SPEED = 110;
const SPEED_GROWTH = 6;
const GRACE_SECONDS = 0.6;
const TRAIL_LENGTH = 6;
const PARTICLE_POOL = 48;
const WARNING_DURATION = 1.0;
const DANGER_DISTANCE = 70;

function loadLeaderboard() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((e) => e && typeof e.name === 'string' && typeof e.score === 'number')
      .sort((a, b) => b.score - a.score)
      .slice(0, LEADERBOARD_CAP);
  } catch {
    return [];
  }
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function pickEdgePosition(width, height) {
  const side = Math.floor(Math.random() * 4);
  const margin = 36;
  if (side === 0) return { x: margin, y: rand(margin, height - margin) };
  if (side === 1) return { x: width - margin, y: rand(margin, height - margin) };
  if (side === 2) return { x: rand(margin, width - margin), y: margin };
  return { x: rand(margin, width - margin), y: height - margin };
}

function createEnemy(width, height) {
  const angle = Math.random() * Math.PI * 2;
  const start = pickEdgePosition(width, height);
  return {
    x: start.x,
    y: start.y,
    vx: Math.cos(angle) * BASE_SPEED,
    vy: Math.sin(angle) * BASE_SPEED,
    pulse: Math.random() * Math.PI * 2,
  };
}

function formatTime(s) {
  return `${s.toFixed(1)}s`;
}

function navigate(path) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export default function Playground404() {
  const [screen, setScreen] = useState('intro');
  const [playerName, setPlayerName] = useState(() => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem(PLAYER_NAME_KEY) || '';
  });
  const [leaderboard, setLeaderboard] = useState(loadLeaderboard);

  return (
    <main className="playground-page">
      <div className="playground-grid" aria-hidden="true" />

      <AnimatePresence mode="wait">
        {screen === 'intro' && (
          <IntroScreen
            key="intro"
            onBack={() => navigate('/')}
            onPlay={() => setScreen(playerName ? 'game' : 'name')}
            leaderboardCount={leaderboard.length}
          />
        )}

        {screen === 'name' && (
          <NameScreen
            key="name"
            initialName={playerName}
            onBack={() => setScreen('intro')}
            onConfirm={(name) => {
              window.localStorage.setItem(PLAYER_NAME_KEY, name);
              setPlayerName(name);
              setScreen('game');
            }}
          />
        )}

        {screen === 'game' && (
          <GameScreen
            key="game"
            playerName={playerName}
            leaderboard={leaderboard}
            onLeaderboardChange={setLeaderboard}
            onChangeName={() => setScreen('name')}
            onExit={() => navigate('/')}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function IntroScreen({ onBack, onPlay, leaderboardCount }) {
  return (
    <motion.section
      className="playground-panel playground-panel--intro"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.99 }}
      transition={{ duration: 0.36, ease: 'easeOut' }}
    >
      <div className="not-found-kicker">Hidden / playground</div>
      <h1>You found a secret playground.</h1>
      <p>
        Tucked behind the portfolio is a small arcade game called <strong>Dot Dodger</strong>. Move your cursor to dodge drifting signals — they speed up and multiply the longer you survive. Your time lands on the leaderboard.
      </p>
      <ul className="intro-meta">
        <li><span>Game</span><strong>Dot Dodger</strong></li>
        <li><span>Controls</span><strong>Mouse</strong></li>
        <li><span>Players</span><strong>{leaderboardCount}</strong></li>
      </ul>
      <div className="not-found-actions">
        <button type="button" className="not-found-button not-found-button--ghost premium-action" onClick={onBack}>
          Back to portfolio
        </button>
        <button type="button" className="not-found-button premium-action" onClick={onPlay}>
          Play game
        </button>
      </div>
    </motion.section>
  );
}

function NameScreen({ initialName, onBack, onConfirm }) {
  const [name, setName] = useState(initialName);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = name.trim().slice(0, 18);
    if (!trimmed) return;
    onConfirm(trimmed);
  };

  return (
    <motion.section
      className="playground-panel playground-panel--name"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.99 }}
      transition={{ duration: 0.36, ease: 'easeOut' }}
    >
      <div className="not-found-kicker">Player tag</div>
      <h1>What should we call you?</h1>
      <p>Your tag shows up on the leaderboard.</p>
      <form className="name-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="name-input"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={18}
          placeholder="e.g. quickfox"
          aria-label="Your player tag"
        />
        <div className="not-found-actions">
          <button type="button" className="not-found-button not-found-button--ghost premium-action" onClick={onBack}>
            Back
          </button>
          <button type="submit" className="not-found-button premium-action" disabled={!name.trim()}>
            Start
          </button>
        </div>
      </form>
    </motion.section>
  );
}

function GameScreen({ playerName, leaderboard, onLeaderboardChange, onChangeName, onExit }) {
  const arenaRef = useRef(null);
  const playerRef = useRef(null);
  const dangerRingRef = useRef(null);
  const enemyRefs = useRef([]);
  const trailRefs = useRef([]);
  const particleRefs = useRef([]);
  const warningRefs = useRef([]);

  const enemiesRef = useRef([]);
  const trailPositionsRef = useRef([]);
  const particlesRef = useRef([]);
  const warningsRef = useRef([]);
  const waveRef = useRef(0);

  const playerPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const lastFrameRef = useRef(0);
  const elapsedRef = useRef(0);
  const displayElapsedRef = useRef(0);
  const statusRef = useRef('ready');
  const milestoneRef = useRef(0);

  const [status, setStatus] = useState('ready');
  const [elapsed, setElapsed] = useState(0);
  const [enemyCount, setEnemyCount] = useState(INITIAL_ENEMIES);
  const [milestone, setMilestone] = useState(null);
  const [lastEntryAt, setLastEntryAt] = useState(0);
  const [previousBest, setPreviousBest] = useState(0);
  const arenaControls = useAnimationControls();

  const personalBest = leaderboard
    .filter((entry) => entry.name === playerName)
    .reduce((best, entry) => Math.max(best, entry.score), 0);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    document.body.classList.add('is-playground');
    return () => document.body.classList.remove('is-playground');
  }, []);

  useEffect(() => {
    const handlePointer = (event) => {
      const arena = arenaRef.current;
      if (!arena) return;
      const rect = arena.getBoundingClientRect();
      playerPosRef.current.x = Math.max(PLAYER_RADIUS, Math.min(rect.width - PLAYER_RADIUS, event.clientX - rect.left));
      playerPosRef.current.y = Math.max(PLAYER_RADIUS, Math.min(rect.height - PLAYER_RADIUS, event.clientY - rect.top));
    };
    window.addEventListener('pointermove', handlePointer, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointer);
  }, []);

  useEffect(() => {
    if (!milestone) return undefined;
    const timer = window.setTimeout(() => {
      setMilestone((current) => (current && current.id === milestone.id ? null : current));
    }, 1100);
    return () => window.clearTimeout(timer);
  }, [milestone]);

  const spawnParticles = useCallback((x, y, count, color, speed = 220, life = 0.6) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const s = speed * (0.5 + Math.random() * 0.7);
      let slot = -1;
      for (let j = 0; j < particlesRef.current.length; j++) {
        if (particlesRef.current[j].life <= 0) { slot = j; break; }
      }
      if (slot === -1 && particlesRef.current.length < PARTICLE_POOL) {
        particlesRef.current.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 0, color: '#fff' });
        slot = particlesRef.current.length - 1;
      }
      if (slot === -1) continue;
      const p = particlesRef.current[slot];
      p.x = x;
      p.y = y;
      p.vx = Math.cos(angle) * s;
      p.vy = Math.sin(angle) * s;
      p.life = life;
      p.max = life;
      p.color = color;
    }
  }, []);

  const scheduleSpawn = useCallback(() => {
    const arena = arenaRef.current;
    if (!arena) return;
    if (enemiesRef.current.length + warningsRef.current.length >= MAX_ENEMIES) return;
    const { width, height } = arena.getBoundingClientRect();
    const pos = pickEdgePosition(width, height);
    warningsRef.current.push({ x: pos.x, y: pos.y, age: 0, duration: WARNING_DURATION });
  }, []);

  const startGame = useCallback(() => {
    const arena = arenaRef.current;
    if (!arena) return;
    const { width, height } = arena.getBoundingClientRect();

    enemiesRef.current = Array.from({ length: INITIAL_ENEMIES }, () => createEnemy(width, height));
    warningsRef.current = [];
    particlesRef.current = [];
    trailPositionsRef.current = [];
    waveRef.current = 0;
    milestoneRef.current = 0;

    playerPosRef.current.x = width / 2;
    playerPosRef.current.y = height / 2;

    elapsedRef.current = 0;
    displayElapsedRef.current = 0;
    setElapsed(0);
    setEnemyCount(INITIAL_ENEMIES);
    setMilestone(null);
    setPreviousBest(personalBest);
    lastFrameRef.current = 0;
    setStatus('playing');
  }, [personalBest]);

  const endGame = useCallback(() => {
    const pos = playerPosRef.current;
    spawnParticles(pos.x, pos.y, 24, '#ff5fa6', 320, 0.75);
    arenaControls.start({
      x: [0, -12, 10, -8, 5, -3, 0],
      y: [0, 6, -5, 4, -2, 1, 0],
      transition: { duration: 0.5 },
    });
    const final = elapsedRef.current;
    const rounded = Math.round(final * 10) / 10;
    setElapsed(rounded);

    const entry = { name: playerName, score: rounded, at: Date.now() };
    const nextBoard = [...leaderboard, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, LEADERBOARD_CAP);
    window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(nextBoard));
    onLeaderboardChange(nextBoard);
    setLastEntryAt(entry.at);
    setStatus('over');
  }, [arenaControls, leaderboard, onLeaderboardChange, playerName, spawnParticles]);

  useEffect(() => {
    const tick = (time) => {
      if (!lastFrameRef.current) lastFrameRef.current = time;
      const dt = Math.min(0.05, (time - lastFrameRef.current) / 1000);
      lastFrameRef.current = time;

      const arena = arenaRef.current;
      if (arena) {
        const { width, height } = arena.getBoundingClientRect();
        const playing = statusRef.current === 'playing';

        if (playing) {
          elapsedRef.current += dt;
          const rounded = Math.floor(elapsedRef.current * 10) / 10;
          if (rounded !== displayElapsedRef.current) {
            displayElapsedRef.current = rounded;
            setElapsed(rounded);
          }

          const expectedWave = Math.floor(elapsedRef.current / WAVE_SECONDS);
          while (waveRef.current < expectedWave) {
            waveRef.current += 1;
            scheduleSpawn();
          }

          const ms = Math.floor(elapsedRef.current / 5);
          if (ms > milestoneRef.current) {
            milestoneRef.current = ms;
            setMilestone({ value: ms * 5, id: time });
          }
        }

        const speedFactor = 1 + (elapsedRef.current * SPEED_GROWTH) / BASE_SPEED;

        if (playing) {
          for (let i = warningsRef.current.length - 1; i >= 0; i--) {
            const w = warningsRef.current[i];
            w.age += dt;
            if (w.age >= w.duration) {
              const angle = Math.random() * Math.PI * 2;
              enemiesRef.current.push({
                x: w.x,
                y: w.y,
                vx: Math.cos(angle) * BASE_SPEED,
                vy: Math.sin(angle) * BASE_SPEED,
                pulse: Math.random() * Math.PI * 2,
              });
              spawnParticles(w.x, w.y, 8, '#5cebd3', 200, 0.45);
              warningsRef.current.splice(i, 1);
              setEnemyCount(enemiesRef.current.length);
            }
          }

          for (let i = 0; i < enemiesRef.current.length; i++) {
            const e = enemiesRef.current[i];
            e.x += e.vx * speedFactor * dt;
            e.y += e.vy * speedFactor * dt;
            e.pulse += dt * 3;

            let bounced = false;
            if (e.x < ENEMY_RADIUS) { e.x = ENEMY_RADIUS; e.vx = Math.abs(e.vx); bounced = true; }
            if (e.x > width - ENEMY_RADIUS) { e.x = width - ENEMY_RADIUS; e.vx = -Math.abs(e.vx); bounced = true; }
            if (e.y < ENEMY_RADIUS) { e.y = ENEMY_RADIUS; e.vy = Math.abs(e.vy); bounced = true; }
            if (e.y > height - ENEMY_RADIUS) { e.y = height - ENEMY_RADIUS; e.vy = -Math.abs(e.vy); bounced = true; }
            if (bounced) spawnParticles(e.x, e.y, 3, '#5cebd3', 140, 0.32);
          }

          trailPositionsRef.current.unshift({ x: playerPosRef.current.x, y: playerPosRef.current.y });
          if (trailPositionsRef.current.length > TRAIL_LENGTH) {
            trailPositionsRef.current.length = TRAIL_LENGTH;
          }
        }

        for (let i = 0; i < particlesRef.current.length; i++) {
          const p = particlesRef.current[i];
          if (p.life <= 0) continue;
          p.life -= dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vx *= 0.94;
          p.vy *= 0.94;
        }

        for (let i = 0; i < enemyRefs.current.length; i++) {
          const node = enemyRefs.current[i];
          if (!node) continue;
          const e = enemiesRef.current[i];
          if (!e) { node.style.opacity = '0'; continue; }
          const pulse = 0.85 + 0.15 * Math.sin(e.pulse);
          node.style.opacity = '1';
          node.style.transform = `translate3d(${e.x}px, ${e.y}px, 0) translate(-50%, -50%) scale(${pulse})`;
        }

        for (let i = 0; i < warningRefs.current.length; i++) {
          const node = warningRefs.current[i];
          if (!node) continue;
          const w = warningsRef.current[i];
          if (!w) { node.style.opacity = '0'; continue; }
          const t = w.age / w.duration;
          const scale = 0.6 + t * 1.6;
          node.style.opacity = String(1 - t * 0.5);
          node.style.transform = `translate3d(${w.x}px, ${w.y}px, 0) translate(-50%, -50%) scale(${scale})`;
        }

        for (let i = 0; i < particleRefs.current.length; i++) {
          const node = particleRefs.current[i];
          if (!node) continue;
          const p = particlesRef.current[i];
          if (!p || p.life <= 0) { node.style.opacity = '0'; continue; }
          const t = p.life / p.max;
          node.style.opacity = String(t);
          node.style.background = p.color;
          node.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${0.5 + t * 0.6})`;
        }

        for (let i = 0; i < trailRefs.current.length; i++) {
          const node = trailRefs.current[i];
          if (!node) continue;
          const t = trailPositionsRef.current[i];
          if (!t) { node.style.opacity = '0'; continue; }
          const alpha = (1 - i / TRAIL_LENGTH) * 0.45;
          node.style.opacity = String(alpha);
          node.style.transform = `translate3d(${t.x}px, ${t.y}px, 0) translate(-50%, -50%) scale(${1 - i * 0.09})`;
        }

        const pos = playerPosRef.current;
        if (playerRef.current) {
          playerRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
        }
        if (dangerRingRef.current) {
          let nearest = Infinity;
          for (const e of enemiesRef.current) {
            const dx = e.x - pos.x;
            const dy = e.y - pos.y;
            const d = Math.sqrt(dx * dx + dy * dy) - ENEMY_RADIUS;
            if (d < nearest) nearest = d;
          }
          const ratio = Math.max(0, Math.min(1, 1 - nearest / DANGER_DISTANCE));
          dangerRingRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${1 + ratio * 0.9})`;
          dangerRingRef.current.style.opacity = String(playing ? ratio * 0.9 : 0);
        }

        if (playing && elapsedRef.current > GRACE_SECONDS) {
          const hitRadius = ENEMY_RADIUS + PLAYER_RADIUS;
          for (const e of enemiesRef.current) {
            const dx = e.x - pos.x;
            const dy = e.y - pos.y;
            if (dx * dx + dy * dy <= hitRadius * hitRadius) {
              endGame();
              break;
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [endGame, scheduleSpawn, spawnParticles]);

  const isNewBest = status === 'over' && elapsed > previousBest;
  const myRank = (() => {
    if (status !== 'over') return null;
    const idx = leaderboard.findIndex((entry) => entry.at === lastEntryAt);
    return idx >= 0 ? idx + 1 : null;
  })();

  return (
    <motion.section
      className="playground-panel playground-panel--game"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.99 }}
      transition={{ duration: 0.36, ease: 'easeOut' }}
    >
      <div className="game-topbar">
        <div className="game-topbar__player">
          <span className="not-found-kicker">Playing as</span>
          <button type="button" className="game-name-pill" onClick={onChangeName} aria-label="Change player tag">
            {playerName}
            <span aria-hidden="true">↻</span>
          </button>
        </div>
        <div className="game-hud">
          <div className="game-hud__stat">
            <span className="game-hud__label">Time</span>
            <span className="game-hud__value">{formatTime(elapsed)}</span>
          </div>
          <div className="game-hud__stat">
            <span className="game-hud__label">Best</span>
            <span className="game-hud__value">{formatTime(personalBest)}</span>
          </div>
          <div className="game-hud__stat">
            <span className="game-hud__label">Enemies</span>
            <span className="game-hud__value">{enemyCount}</span>
          </div>
        </div>
      </div>

      <div className="game-layout">
        <motion.div ref={arenaRef} className="game-arena" animate={arenaControls} aria-label="Dot dodger arena">
          {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
            <div key={`t${i}`} ref={(node) => { trailRefs.current[i] = node; }} className="game-trail" style={{ opacity: 0 }} aria-hidden="true" />
          ))}
          {Array.from({ length: MAX_ENEMIES }).map((_, i) => (
            <div key={`e${i}`} ref={(node) => { enemyRefs.current[i] = node; }} className="game-enemy" style={{ opacity: 0 }} aria-hidden="true" />
          ))}
          {Array.from({ length: MAX_ENEMIES }).map((_, i) => (
            <div key={`w${i}`} ref={(node) => { warningRefs.current[i] = node; }} className="game-warning" style={{ opacity: 0 }} aria-hidden="true" />
          ))}
          {Array.from({ length: PARTICLE_POOL }).map((_, i) => (
            <div key={`p${i}`} ref={(node) => { particleRefs.current[i] = node; }} className="game-particle" style={{ opacity: 0 }} aria-hidden="true" />
          ))}

          <div ref={dangerRingRef} className="game-danger" style={{ opacity: 0 }} aria-hidden="true" />
          <div ref={playerRef} className="game-player" aria-hidden="true" />

          <AnimatePresence>
            {milestone && (
              <motion.div
                key={milestone.id}
                className="game-milestone"
                initial={{ opacity: 0, y: 30, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.85 }}
                transition={{ duration: 0.5 }}
              >
                {milestone.value}s
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {status !== 'playing' && (
              <motion.div
                key={status}
                className="game-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28 }}
              >
                {status === 'ready' ? (
                  <ReadyContents onStart={startGame} />
                ) : (
                  <OverContents
                    elapsed={elapsed}
                    isNewBest={isNewBest}
                    rank={myRank}
                    onPlayAgain={startGame}
                    onExit={onExit}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <Leaderboard
          entries={leaderboard}
          playerName={playerName}
          highlightAt={status === 'over' ? lastEntryAt : 0}
        />
      </div>
    </motion.section>
  );
}

function ReadyContents({ onStart }) {
  return (
    <motion.div
      className="game-overlay__inner"
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.36 }}
    >
      <span className="game-overlay__title">Ready?</span>
      <span className="game-overlay__hint">Move the dot. Don't touch the signals. Survive.</span>
      <motion.button
        type="button"
        className="not-found-button premium-action game-overlay__start"
        onClick={onStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Start
      </motion.button>
    </motion.div>
  );
}

function OverContents({ elapsed, isNewBest, rank, onPlayAgain, onExit }) {
  return (
    <motion.div
      className="game-overlay__inner"
      initial={{ y: 18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.42 }}
    >
      <motion.span
        className={`game-overlay__title ${isNewBest ? 'is-best' : ''}`}
        initial={{ scale: 0.55 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 16 }}
      >
        {isNewBest ? 'New personal best!' : 'Caught.'}
      </motion.span>
      <span className="game-overlay__stats">
        <span>Score <strong>{formatTime(elapsed)}</strong></span>
        {rank && <span>Rank <strong>#{rank}</strong></span>}
      </span>
      <div className="game-overlay__actions">
        <motion.button
          type="button"
          className="not-found-button not-found-button--ghost premium-action"
          onClick={onExit}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          Back to portfolio
        </motion.button>
        <motion.button
          type="button"
          className="not-found-button premium-action"
          onClick={onPlayAgain}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          Play again
        </motion.button>
      </div>
    </motion.div>
  );
}

function Leaderboard({ entries, playerName, highlightAt }) {
  return (
    <aside className="game-leaderboard" aria-label="Leaderboard">
      <header>
        <span className="not-found-kicker">Leaderboard</span>
        <span className="game-leaderboard__count">{entries.length}</span>
      </header>
      {entries.length === 0 ? (
        <p className="game-leaderboard__empty">No scores yet. Be the first.</p>
      ) : (
        <ol className="game-leaderboard__list">
          <AnimatePresence initial={false}>
            {entries.map((entry, idx) => {
              const isYou = entry.name === playerName;
              const isNew = entry.at === highlightAt;
              return (
                <motion.li
                  key={`${entry.at}-${entry.name}`}
                  className={`game-leaderboard__row${isYou ? ' is-you' : ''}${isNew ? ' is-new' : ''}`}
                  initial={isNew ? { opacity: 0, x: 18 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.32 }}
                >
                  <span className="game-leaderboard__rank">{idx + 1}</span>
                  <span className="game-leaderboard__name">{entry.name}</span>
                  <span className="game-leaderboard__score">{formatTime(entry.score)}</span>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>
      )}
    </aside>
  );
}
