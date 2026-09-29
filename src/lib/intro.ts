/**
 * The hero waits for the preloader before playing its entrance.
 * The preloader calls markIntroDone(); anything can subscribe with onIntroDone().
 */
let done = false;
const listeners = new Set<() => void>();

export function markIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}

export function onIntroDone(fn: () => void) {
  if (done) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export const INTRO_KEY = "mova-intro";

/**
 * The preloader holds at the end of its count until the hero's WebGL frames are
 * uploaded, so the viewfinder opens onto a finished scene instead of a stutter.
 */
let sceneExpected = false;
let sceneReady = false;
const sceneListeners = new Set<() => void>();

export function expectScene() {
  sceneExpected = true;
}

export function markSceneReady() {
  sceneReady = true;
  sceneListeners.forEach((fn) => fn());
  sceneListeners.clear();
}

export function whenSceneReady(fn: () => void, timeout = 2500) {
  if (!sceneExpected || sceneReady) {
    fn();
    return () => {};
  }
  let called = false;
  const run = () => {
    if (called) return;
    called = true;
    clearTimeout(timer);
    sceneListeners.delete(run);
    fn();
  };
  const timer = setTimeout(run, timeout);
  sceneListeners.add(run);
  return () => {
    called = true;
    clearTimeout(timer);
    sceneListeners.delete(run);
  };
}
