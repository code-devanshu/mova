"use client";

import { ArrowUp } from "@phosphor-icons/react";
import { scrollToTarget } from "@/lib/scroll";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => scrollToTarget(0)}
      className="group inline-flex items-center gap-2 uppercase tracking-[0.08em] text-mute transition-colors hover:text-fg"
    >
      Back to top
      <ArrowUp weight="bold" className="transition-transform duration-500 group-hover:-translate-y-0.5" />
    </button>
  );
}
