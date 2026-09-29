"use client";

import { useEffect, useSyncExternalStore } from "react";
import { bindSound, getSound, setSound, subscribeSound } from "@/lib/sound";

const serverSound = () => false;

/**
 * Sound on / off: a level meter that dances while the score plays and lies flat when muted.
 * Mounted once in the nav, it also arms the site sound (first-gesture start, click shutter).
 */
export function SoundToggle({ className = "" }: { className?: string }) {
  const on = useSyncExternalStore(subscribeSound, getSound, serverSound);

  useEffect(() => bindSound(), []);

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label="Sound"
      title={on ? "Mute sound" : "Play sound"}
      onClick={() => setSound(!on)}
      className={`flex size-10 shrink-0 items-center justify-center border border-line-strong text-mute transition-colors duration-300 hover:border-fg hover:text-fg aria-pressed:text-fg ${className}`}
    >
      <span aria-hidden className="eq">
        <i />
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}
