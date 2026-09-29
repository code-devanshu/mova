"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { INTRO_KEY, markIntroDone, whenSceneReady } from "@/lib/intro";
import { Logo } from "@/components/ui/Logo";

/**
 * First-visit intro: a focus box locks on while the counter runs, then opens
 * out to the edges of the screen and becomes the hero's viewfinder.
 * Skipped on repeat visits in the same session and under reduced motion.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      document.documentElement.setAttribute("data-js-ready", "");

      let seen = false;
      try {
        seen = sessionStorage.getItem(INTRO_KEY) === "1";
      } catch {}

      if (seen || prefersReducedMotion() || getComputedStyle(el).display === "none") {
        el.style.display = "none";
        markIntroDone();
        return;
      }

      const box = el.querySelector<HTMLElement>("[data-box]");
      const count = el.querySelector<HTMLElement>("[data-count]");
      const bg = el.querySelector<HTMLElement>("[data-bg]");
      const meta = el.querySelectorAll<HTMLElement>("[data-meta]");
      const inset = window.innerWidth < 768 ? 12 : 16;
      const counter = { v: 0 };

      const render = () => {
        if (count) count.textContent = String(Math.round(counter.v)).padStart(3, "0");
      };

      // Count to 84, hold until the hero's frames are ready, then finish and open the frame.
      const open = gsap.timeline({
        paused: true,
        onComplete: () => {
          try {
            sessionStorage.setItem(INTRO_KEY, "1");
          } catch {}
          el.style.display = "none";
        },
      });
      let stopWaiting = () => {};
      const load = gsap.timeline({
        onComplete: () => {
          stopWaiting = whenSceneReady(() => open.play());
        },
      });

      load
        .from(box, { scale: 1.6, autoAlpha: 0, duration: 0.7, ease: "expo.out" })
        .from(meta, { autoAlpha: 0, y: 8, duration: 0.5, stagger: 0.08 }, "<0.1")
        .to(counter, { v: 84, duration: 1.3, ease: "power2.inOut", onUpdate: render }, "<");

      open
        .to(counter, { v: 100, duration: 0.35, ease: "power1.out", onUpdate: render })
        .to(box, { scale: 0.9, duration: 0.18, ease: "power2.in" })
        .to(box, { scale: 1, duration: 0.18, ease: "power2.out" })
        .to(meta, { autoAlpha: 0, duration: 0.25 }, "<")
        .to(box, {
          width: window.innerWidth - inset * 2,
          height: window.innerHeight - inset * 2,
          duration: 1.05,
          ease: "expo.inOut",
        })
        .to(bg, { autoAlpha: 0, duration: 0.7, ease: "power2.out" }, "-=0.55")
        .add(markIntroDone, "-=0.7")
        .to(box, { autoAlpha: 0, duration: 0.3 }, "-=0.1");

      return () => stopWaiting();
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      data-preloader
      aria-hidden
      className="pointer-events-none fixed inset-0 z-preloader items-center justify-center"
    >
      <div data-bg className="absolute inset-0 bg-canvas" />
      <div data-box className="relative h-[120px] w-[200px] text-fg">
        <span className="corners absolute inset-0" style={{ "--c": "22px", "--t": "2px" } as React.CSSProperties}>
          <i />
          <i />
          <i />
          <i />
        </span>
      </div>
      <div data-meta className="absolute left-5 top-5 md:left-10 md:top-7">
        <Logo className="text-2xl" />
      </div>
      <div data-meta className="type-label absolute bottom-6 left-5 flex items-center gap-2 text-mute md:bottom-8 md:left-10">
        <span className="rec-dot" /> Loading frames
      </div>
      <div
        data-meta
        className="absolute bottom-4 right-5 font-mono text-[clamp(3rem,9vw,7rem)] leading-none tabular-nums text-fg md:bottom-6 md:right-10"
      >
        <span data-count>000</span>
      </div>
    </div>
  );
}
