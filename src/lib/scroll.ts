import type Lenis from "lenis";

/**
 * One Lenis instance for the whole app. Stored outside React so scroll position
 * never causes a re-render; components call these helpers from event handlers.
 */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

export function scrollToTarget(target: string | number | HTMLElement, immediate = false) {
  if (instance) {
    instance.scrollTo(target, { immediate, force: true, offset: 0 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: immediate ? "instant" : "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: immediate ? "instant" : "smooth" });
}

export function lockScroll(locked: boolean) {
  if (instance) {
    if (locked) instance.stop();
    else instance.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
