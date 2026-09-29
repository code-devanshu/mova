/**
 * Site sound, synthesised with Web Audio (no files to load, nothing to license):
 * - an ambient score: a slow, warm pad (Dmaj9 → Bm9 → Gmaj9 → A7sus) with soft bells over it, in a long hall;
 * - a camera shutter on every click.
 * One switch in the nav rules both. Browsers only allow audio after the visitor interacts, so sound
 * starts on their first click or key press (unless they muted it on an earlier visit) and fades in.
 * It pauses while the tab is hidden.
 */

export const SOUND_KEY = "mova-sound";

// Levels, 0–1. MUSIC sits the score under the shutter; raise or lower it to taste.
const MASTER = 0.9;
const MUSIC = 0.85;
const SHUTTER = 0.45;

// The score: open voicings (MIDI note numbers) that drift without ever resolving hard.
const CHORDS = [
  [50, 57, 61, 64, 66], // Dmaj9:  D A C# E F#
  [47, 54, 57, 61, 62], // Bm9:    B F# A C# D
  [43, 50, 54, 57, 59], // Gmaj9:  G D F# A B
  [45, 52, 55, 59, 62], // A7sus:  A E G B D
];
const BELLS = [74, 76, 78, 81, 83, 86]; // D major pentatonic, up high: fits every chord above
const CHORD_LEN = 10; // seconds each chord holds
const ATTACK = 4;
const RELEASE = 6; // each chord fades under the next

type Graph = {
  ctx: AudioContext;
  master: GainNode;
  music: GainNode;
  pad: BiquadFilterNode;
  bells: GainNode;
  sfx: GainNode;
  noise: AudioBuffer;
};

let graph: Graph | null = null;
let on = false;
let armed = false; // waiting for the first gesture to start the sound
let timer = 0;
let suspendTimer = 0;
let step = 0;
let nextChord = 0;
let nextBell = 0;
const listeners = new Set<() => void>();

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);
const pick = <T>(list: T[]) => list[Math.floor(Math.random() * list.length)];

function build(): Graph | null {
  if (typeof AudioContext === "undefined") return null;
  const ctx = new AudioContext();

  const master = ctx.createGain();
  master.gain.value = 0;
  // A hard safety limiter: it leaves the mix alone and only catches stray peaks.
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -6;
  limiter.knee.value = 0;
  limiter.ratio.value = 20;
  limiter.attack.value = 0.003;
  limiter.release.value = 0.25;
  master.connect(limiter).connect(ctx.destination);

  // Fades in once, the first time sound starts.
  const music = ctx.createGain();
  music.gain.setValueAtTime(0, ctx.currentTime);
  music.gain.linearRampToValueAtTime(MUSIC, ctx.currentTime + 6);
  music.connect(master);

  const reverb = ctx.createConvolver();
  reverb.buffer = hall(ctx, 5, 2.6);
  reverb.connect(music);

  // Pad: a lowpass that opens and closes over ~20s, so the chords breathe.
  const pad = ctx.createBiquadFilter();
  pad.type = "lowpass";
  pad.frequency.value = 950;
  pad.Q.value = 0.5;
  const lfo = ctx.createOscillator();
  const depth = ctx.createGain();
  lfo.frequency.value = 0.05;
  depth.gain.value = 320;
  lfo.connect(depth).connect(pad.frequency);
  lfo.start();
  pad.connect(send(ctx, 0.55)).connect(music);
  pad.connect(send(ctx, 0.7)).connect(reverb);

  // Bells: dry, a soft echo, and plenty of hall.
  const bells = ctx.createGain();
  const echo = ctx.createDelay(2);
  const feedback = send(ctx, 0.38);
  const darken = ctx.createBiquadFilter();
  echo.delayTime.value = 0.48;
  darken.type = "lowpass";
  darken.frequency.value = 2200;
  bells.connect(send(ctx, 0.5)).connect(music);
  bells.connect(send(ctx, 0.9)).connect(reverb);
  bells.connect(echo).connect(darken).connect(feedback).connect(echo);
  darken.connect(send(ctx, 0.35)).connect(music);

  const sfx = ctx.createGain();
  sfx.gain.value = SHUTTER;
  sfx.connect(master);

  const noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  return { ctx, master, music, pad, bells, sfx, noise };
}

function send(ctx: BaseAudioContext, level: number) {
  const gain = ctx.createGain();
  gain.gain.value = level;
  return gain;
}

/** A long, dark room: decaying stereo noise as the reverb's impulse response. */
function hall(ctx: BaseAudioContext, seconds: number, decay: number) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** decay;
  }
  return buffer;
}

function ramp(param: AudioParam, value: number, seconds: number, t: number) {
  param.cancelScheduledValues(t);
  param.setValueAtTime(param.value, t);
  param.linearRampToValueAtTime(value, t + seconds);
}

/** One chord: a pair of slightly detuned saws per note, spread left and right, plus a sine an octave under. */
function chord({ ctx, pad }: Graph, notes: number[], t: number) {
  const end = t + CHORD_LEN + RELEASE;
  const voices = [
    ...notes.map((n) => ({ n, type: "sawtooth" as const, level: 0.055, spread: [-8, 8] })),
    { n: notes[0] - 12, type: "sine" as const, level: 0.08, spread: [0] },
  ];
  for (const v of voices) {
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(v.level, t + ATTACK);
    env.gain.setValueAtTime(v.level, t + CHORD_LEN);
    env.gain.linearRampToValueAtTime(0, end);
    env.connect(pad);
    v.spread.forEach((cents, i) => {
      const osc = ctx.createOscillator();
      const pan = ctx.createStereoPanner();
      osc.type = v.type;
      osc.frequency.value = hz(v.n);
      osc.detune.value = cents;
      pan.pan.value = cents / 20;
      osc.connect(pan).connect(env);
      osc.start(t);
      osc.stop(end);
      osc.onended = () => {
        pan.disconnect();
        if (i === 0) env.disconnect();
      };
    });
  }
}

/** A soft glass bell: a sine with two quieter, quicker-fading overtones. */
function bell({ ctx, bells }: Graph, t: number) {
  const f = hz(pick(BELLS));
  const pan = ctx.createStereoPanner();
  pan.pan.value = Math.random() * 1.2 - 0.6;
  pan.connect(bells);
  const partials = [
    [1, 0.11, 4.5],
    [2, 0.026, 2],
    [4, 0.009, 0.7],
  ];
  for (const [ratio, level, decay] of partials) {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.frequency.value = f * ratio;
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(level, t + 0.015);
    env.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    osc.connect(env).connect(pan);
    osc.start(t);
    osc.stop(t + decay + 0.05);
    osc.onended = () => {
      env.disconnect();
      if (ratio === 1) pan.disconnect();
    };
  }
}

/** Keeps about a second of score scheduled ahead of the clock. */
function tick() {
  if (!graph) return;
  const now = graph.ctx.currentTime;
  const horizon = now + 1;
  if (nextChord < now) nextChord = now + 0.05;
  if (nextBell < now) nextBell = now + 3;
  while (nextChord < horizon) {
    chord(graph, CHORDS[step++ % CHORDS.length], nextChord);
    nextChord += CHORD_LEN;
  }
  while (nextBell < horizon) {
    if (Math.random() < 0.75) bell(graph, nextBell);
    nextBell += 1.6 + Math.random() * 3;
  }
}

/** One noise click: bandpassed white noise with a very short tail. */
function burst({ ctx, sfx, noise }: Graph, t: number, tone: number, level: number, decay: number) {
  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const env = ctx.createGain();
  src.buffer = noise;
  filter.type = "bandpass";
  filter.frequency.value = tone;
  filter.Q.value = 1.4;
  env.gain.setValueAtTime(level, t);
  env.gain.exponentialRampToValueAtTime(0.001, t + decay);
  src.connect(filter).connect(env).connect(sfx);
  src.start(t, Math.random() * 0.5, decay + 0.02);
  src.onended = () => env.disconnect();
}

/** The body of the mirror slap: a short sine that drops in pitch. */
function thump({ ctx, sfx }: Graph, t: number, level: number) {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.frequency.setValueAtTime(190, t);
  osc.frequency.exponentialRampToValueAtTime(60, t + 0.05);
  env.gain.setValueAtTime(level, t);
  env.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
  osc.connect(env).connect(sfx);
  osc.start(t);
  osc.stop(t + 0.07);
  osc.onended = () => env.disconnect();
}

/** "Ka-chk": mirror up, then the curtain ~70ms later. A little variation so repeats don't sound stamped. */
export function shutter() {
  if (!on || !graph) return;
  const { ctx } = graph;
  if (ctx.state === "suspended" && !document.hidden) void ctx.resume();
  const t = ctx.currentTime + 0.005;
  const gap = 0.06 + Math.random() * 0.025;
  const tune = 0.92 + Math.random() * 0.16;
  burst(graph, t, 3600 * tune, 1, 0.03);
  burst(graph, t, 1200 * tune, 0.6, 0.05);
  thump(graph, t, 0.4);
  burst(graph, t + gap, 2700 * tune, 0.7, 0.025);
  burst(graph, t + gap, 850 * tune, 0.35, 0.06);
}

/** Brings the audio in line with the switch and the tab: fade up and play, or fade down and pause. */
function sync() {
  const audible = on && !document.hidden;
  if (audible) {
    graph ??= build();
    if (!graph) return;
    const { ctx, master } = graph;
    clearTimeout(suspendTimer);
    void ctx.resume();
    ramp(master.gain, MASTER, 1.5, ctx.currentTime);
    if (!timer) {
      tick();
      timer = window.setInterval(tick, 250);
    }
  } else if (graph) {
    const { ctx, master } = graph;
    ramp(master.gain, 0, 0.6, ctx.currentTime);
    clearInterval(timer);
    timer = 0;
    clearTimeout(suspendTimer);
    suspendTimer = window.setTimeout(() => void ctx.suspend(), 700);
  }
}

function savedSound() {
  try {
    return localStorage.getItem(SOUND_KEY);
  } catch {
    return null;
  }
}

export function getSound() {
  return on;
}

export function subscribeSound(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/** The visitor's own choice, remembered for their next visit. */
export function setSound(value: boolean) {
  armed = false;
  on = value;
  try {
    localStorage.setItem(SOUND_KEY, value ? "on" : "off");
  } catch {}
  listeners.forEach((fn) => fn());
  sync();
}

/**
 * Starts sound on the first click or key press, fires the shutter on every click, and pauses with the tab.
 * The click listener sits on window so it runs after React's handlers: a click that turns sound on
 * gets its shutter, one that mutes stays silent.
 */
export function bindSound() {
  armed = !on && savedSound() !== "off";
  const onClick = () => {
    if (armed) setSound(true);
    shutter();
  };
  const onKey = (e: KeyboardEvent) => {
    if (armed && e.key !== "Escape" && !e.metaKey && !e.ctrlKey && !e.altKey) setSound(true);
  };
  window.addEventListener("click", onClick);
  window.addEventListener("keydown", onKey);
  document.addEventListener("visibilitychange", sync);
  return () => {
    window.removeEventListener("click", onClick);
    window.removeEventListener("keydown", onKey);
    document.removeEventListener("visibilitychange", sync);
  };
}
