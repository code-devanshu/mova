/**
 * The theme lives on <html data-theme="dark|light">. The boot script in layout.tsx sets it before
 * first paint (the saved choice, else the system setting) and CSS does the rest. These helpers are
 * for the toggle and for the WebGL pieces (hero drum, globe) that need colours as numbers.
 */

export type Theme = "dark" | "light";

/**
 * What a first-time visitor sees: "system" follows their device setting.
 * Set to "dark" (or "light") to open every visitor on one theme; the toggle still works.
 */
export const DEFAULT_THEME: Theme | "system" = "system";

export const THEME_KEY = "mova-theme";

const html = () => document.documentElement;

export function getTheme(): Theme {
  return html().dataset.theme === "light" ? "light" : "dark";
}

export function subscribeTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(html(), { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

/** A theme colour as authored in globals.css, e.g. cssColor("--color-canvas"). */
export function cssColor(name: string) {
  return getComputedStyle(html()).getPropertyValue(name).trim();
}

/** Point the browser UI (mobile address bar) at the current page colour. */
export function syncThemeColor() {
  const color = cssColor("--color-canvas");
  if (!color) return;
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", color));
}

function apply(theme: Theme) {
  html().dataset.theme = theme;
  html().style.colorScheme = theme;
  syncThemeColor();
}

function savedTheme(): Theme | null {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "light" || t === "dark" ? t : null;
  } catch {
    return null;
  }
}

/**
 * The visitor's own choice: remembered, and revealed as a frame opening out from `origin`
 * (the toggle), the same move as the intro. Instant under reduced motion or without View Transitions.
 */
export function setTheme(theme: Theme, origin?: Element | null) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}

  const root = html();
  root.classList.add("theme-switching");
  const settle = () => requestAnimationFrame(() => root.classList.remove("theme-switching"));

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof document.startViewTransition !== "function") {
    apply(theme);
    settle();
    return;
  }

  const transition = document.startViewTransition(() => apply(theme));
  transition.ready
    .then(() => {
      const r = origin?.getBoundingClientRect();
      const from = r
        ? `inset(${r.top}px ${window.innerWidth - r.right}px ${window.innerHeight - r.bottom}px ${r.left}px)`
        : "inset(50% 50% 50% 50%)";
      root.animate(
        { clipPath: [from, "inset(0px 0px 0px 0px)"] },
        { duration: 1000, easing: "cubic-bezier(0.83, 0, 0.17, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    })
    .catch(() => {});
  transition.finished.finally(settle);
}

/** Follow the system setting live, until the visitor picks a theme themselves. */
export function followSystemTheme() {
  if (DEFAULT_THEME !== "system") return () => {};
  const query = window.matchMedia("(prefers-color-scheme: light)");
  const onChange = () => {
    if (!savedTheme()) apply(query.matches ? "light" : "dark");
  };
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
