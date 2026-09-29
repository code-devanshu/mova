"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "@phosphor-icons/react";
import { followSystemTheme, getTheme, setTheme, subscribeTheme, syncThemeColor } from "@/lib/theme";

const serverTheme = () => null;

/**
 * Dark / light switch: the viewfinder corners slide onto the active mode.
 * Its look is keyed off html[data-theme] in CSS (light: variant), so it is right before hydration.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, serverTheme);
  const pathname = usePathname();
  const light = theme === "light";

  useEffect(() => followSystemTheme(), []);
  // Head tags can re-render on navigation; keep the browser UI colour in step with the page.
  useEffect(() => syncThemeColor(), [pathname]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={light}
      aria-label="Light theme"
      title={light ? "Switch to dark" : "Switch to light"}
      onClick={(e) => setTheme(light ? "dark" : "light", e.currentTarget)}
      className={`theme-toggle relative flex h-10 shrink-0 items-center border border-line-strong px-1 transition-colors duration-300 hover:border-fg ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 w-8 transition-transform duration-500 ease-(--ease-expo) light:translate-x-8"
      >
        <span className="corners absolute inset-0 text-fg" style={{ "--c": "7px" } as React.CSSProperties}>
          <i />
          <i />
          <i />
          <i />
        </span>
      </span>
      <span aria-hidden className="relative grid size-8 place-items-center text-fg transition-colors duration-500 light:text-mute">
        <Moon size={16} weight="bold" />
      </span>
      <span aria-hidden className="relative grid size-8 place-items-center text-mute transition-colors duration-500 light:text-fg">
        <Sun size={16} weight="bold" />
      </span>
    </button>
  );
}
