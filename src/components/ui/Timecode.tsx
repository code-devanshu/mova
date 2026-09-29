"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

const FPS = 24;
const pad = (n: number) => String(n).padStart(2, "0");

function format(frames: number) {
  const f = frames % FPS;
  const s = Math.floor(frames / FPS);
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f)}`;
}

/** A running SMPTE-style timecode at 24fps. Writes to the DOM directly, never to React state. */
export function Timecode({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    let last = -1;
    let visible = true;
    const start = performance.now();
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);
    const tick = (now: number) => {
      const frames = Math.floor(((now - start) / 1000) * FPS);
      if (visible && frames !== last) {
        last = frames;
        el.textContent = format(frames);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      00:00:00:00
    </span>
  );
}
