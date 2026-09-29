"use client";

import { useEffect, useRef } from "react";
import type { COBEOptions, Globe } from "cobe";
import { ArrowRight } from "@phosphor-icons/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { locations } from "@/lib/content";
import { getTheme, subscribeTheme, type Theme } from "@/lib/theme";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { SplitHeading } from "@/components/ui/SplitHeading";

// cobe's rotation for a longitude: phi = PI - (lon - PI/2)
const lonToPhi = (lon: number) => Math.PI - ((lon * Math.PI) / 180 - Math.PI / 2);
const BASE_PHI = lonToPhi(77);
const THETA = 0.38;
const REC: [number, number, number] = [0.91, 0.27, 0.17];

// Dark theme: land dots glow on a black sphere. Light theme: they print dark on a paper globe.
type Look = Pick<COBEOptions, "dark" | "diffuse" | "mapBrightness" | "mapBaseBrightness" | "baseColor" | "glowColor">;
const LOOK: Record<Theme, Look> = {
  dark: {
    dark: 1,
    diffuse: 1.3,
    mapBrightness: 4.2,
    mapBaseBrightness: 0.03,
    baseColor: [0.2, 0.2, 0.21],
    glowColor: [0.1, 0.1, 0.11],
  },
  light: {
    dark: 0,
    diffuse: 1.2,
    mapBrightness: 1,
    mapBaseBrightness: 0,
    baseColor: [0.95, 0.94, 0.92],
    glowColor: [0.93, 0.92, 0.9],
  },
};

/** A slow-turning dotted globe with Delhi NCR and Chandigarh marked and connected. */
export function Locations() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = wrap.current;
    const cvs = canvas.current;
    if (!box || !cvs) return;

    let globe: Globe | null = null;
    let visible = false;
    let disposed = false;
    let t = 0;
    let drag = 0;
    let dragVel = 0;
    let pointerX: number | null = null;
    const reduced = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const size = () => box.clientWidth;

    const create = async () => {
      const { default: createGlobe } = await import("cobe");
      if (disposed || globe) return;
      const s = size();
      globe = createGlobe(cvs, {
        devicePixelRatio: dpr,
        width: s * dpr,
        height: s * dpr,
        phi: BASE_PHI,
        theta: THETA,
        ...LOOK[getTheme()],
        scale: 1.02,
        mapSamples: 22000,
        markerColor: REC,
        markers: locations.markers.map((m, i) => ({ location: m.location, size: i === 0 ? 0.035 : 0.028, id: m.id })),
        arcs: [{ from: locations.markers[0].location, to: locations.markers[1].location, id: "route" }],
        arcColor: REC,
        arcWidth: 0.8,
        arcHeight: 0.25,
        markerElevation: 0.015,
      });
      gsap.to(cvs, { opacity: 1, duration: 1.4, ease: "power2.out" });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !globe) create();
      },
      { rootMargin: "200px" },
    );
    io.observe(box);

    const tick = (_: number, deltaMs: number) => {
      if (!visible || !globe) return;
      const dt = Math.min(deltaMs, 50) / 1000;
      if (!reduced) t += dt * 0.35;
      if (pointerX === null) {
        drag += dragVel;
        dragVel *= 0.92;
        drag *= 0.985; // ease back toward India
      }
      globe.update({ phi: BASE_PHI + Math.sin(t) * 0.45 + drag, theta: THETA });
    };
    gsap.ticker.add(tick);

    const offTheme = subscribeTheme(() => globe?.update(LOOK[getTheme()]));

    const ro = new ResizeObserver(() => {
      const s = size();
      globe?.update({ width: s * dpr, height: s * dpr });
    });
    ro.observe(box);

    const down = (e: PointerEvent) => {
      pointerX = e.clientX;
      cvs.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (pointerX === null) return;
      const dx = e.clientX - pointerX;
      pointerX = e.clientX;
      dragVel = dx / 200;
      drag += dragVel;
    };
    const up = () => {
      pointerX = null;
    };
    cvs.addEventListener("pointerdown", down);
    cvs.addEventListener("pointermove", move);
    cvs.addEventListener("pointerup", up);
    cvs.addEventListener("pointercancel", up);

    return () => {
      disposed = true;
      io.disconnect();
      ro.disconnect();
      offTheme();
      gsap.ticker.remove(tick);
      cvs.removeEventListener("pointerdown", down);
      cvs.removeEventListener("pointermove", move);
      cvs.removeEventListener("pointerup", up);
      cvs.removeEventListener("pointercancel", up);
      globe?.destroy();
    };
  }, []);

  return (
    <section id="locations" aria-labelledby="locations-title" className="relative overflow-hidden bg-canvas px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1680px] items-center gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-6 md:col-start-7 md:row-start-1">
          <SplitHeading id="locations-title" className="type-display text-[clamp(3rem,7.4vw,8rem)] text-fg">
            <span className="block">{locations.headline[0]}</span>
            <span className="block text-mute">{locations.headline[1]}</span>
          </SplitHeading>

          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            {locations.regions.map((r) => (
              <div key={r.name}>
                <h3 className="type-display text-4xl text-fg wdth-100">{r.name}</h3>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-lg text-mute">
                  {r.cities.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="sm:col-span-2">
              <h3 className="type-display text-4xl text-fg wdth-100">{locations.elsewhere.title}</h3>
              <TransitionLink
                href={locations.elsewhere.href}
                className="group mt-3 inline-flex items-center gap-2 text-lg font-semibold text-fg underline decoration-rec decoration-2 underline-offset-8"
              >
                {locations.elsewhere.cta}
                <ArrowRight weight="bold" className="transition-transform duration-500 group-hover:translate-x-1.5" />
              </TransitionLink>
            </div>
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-1 md:row-start-1">
          <div ref={wrap} className="globe relative mx-auto aspect-square w-full max-w-[680px]">
            <canvas
              ref={canvas}
              aria-label="Globe marking Delhi NCR and Chandigarh"
              role="img"
              className="size-full cursor-grab opacity-0 active:cursor-grabbing"
            />
            {locations.markers.map((m) => (
              <span key={m.id} aria-hidden className={`globe-label globe-label-${m.id} type-label text-fg`}>
                {m.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
