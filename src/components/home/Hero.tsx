"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger, SplitText, useGSAP, MOTION, prefersReducedMotion } from "@/lib/gsap";
import { expectScene, markSceneReady, onIntroDone } from "@/lib/intro";
import { hero, site } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { Timecode } from "@/components/ui/Timecode";
import { heroState } from "./heroState";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [reduced] = useState(prefersReducedMotion);
  const ready = useRef({ scene: false, intro: false });

  const showCanvas = useCallback(() => {
    if (!ready.current.scene || !ready.current.intro) return;
    gsap.to(canvas.current, { autoAlpha: 1, duration: 1.8, ease: "power2.out" });
  }, []);

  const onSceneReady = useCallback(() => {
    ready.current.scene = true;
    markSceneReady();
    showCanvas();
  }, [showCanvas]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      expectScene();

      // Scroll progress, velocity and visibility feed the WebGL scene.
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top",
        onUpdate(self) {
          heroState.progress = self.progress;
          heroState.velocity = self.getVelocity();
        },
        onToggle(self) {
          setActive(self.isActive || self.progress === 0);
        },
      });

      const onPointer = (e: PointerEvent) => {
        heroState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
        heroState.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      const mm = gsap.matchMedia();

      mm.add(MOTION, () => {
        const lines = gsap.utils.toArray<HTMLElement>("[data-hl]", el);
        const split = SplitText.create(lines, { type: "words,chars", charsClass: "inline-block" });
        const intro = gsap.timeline({
          paused: true,
          onComplete: () => split.revert(),
        });
        intro
          .set("[data-hero-in]", { visibility: "visible" })
          .from(split.chars, { yPercent: 115, rotate: 4, duration: 1.4, ease: "expo.out", stagger: 0.04 })
          .from("[data-hero-fade]", { y: 26, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.09 }, 0.35)
          .from("[data-hud]", { opacity: 0, duration: 0.8, stagger: 0.08 }, 0.2);

        const off = onIntroDone(() => {
          intro.play();
          ready.current.intro = true;
          showCanvas();
        });

        // Headline drifts up and dims as the hero scrolls away.
        gsap.to(content.current, {
          yPercent: -18,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });

        return () => {
          off();
          split.revert();
        };
      });

      mm.add(`(prefers-reduced-motion: reduce)`, () => {
        const off = onIntroDone(() => {
          ready.current.intro = true;
          showCanvas();
        });
        return off;
      });

      return () => {
        st.kill();
        mm.revert();
        window.removeEventListener("pointermove", onPointer);
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" aria-label="Intro" className="relative min-h-[100dvh] overflow-hidden bg-canvas">
      <div ref={canvas} className="invisible absolute inset-0 opacity-0">
        <HeroScene active={active} reduced={reduced} onReady={onSceneReady} />
      </div>

      {/* Legibility scrim for the headline, bottom-left. */}
      <div
        aria-hidden
        className="hero-scrim pointer-events-none absolute inset-0"
      />

      {/* Viewfinder */}
      <div aria-hidden className="pointer-events-none absolute inset-3 text-fg/60 md:inset-4">
        <span data-hud className="corners absolute inset-0" style={{ "--c": "28px" } as React.CSSProperties}>
          <i />
          <i />
          <i />
          <i />
        </span>
        <div data-hud className="type-label absolute bottom-4 right-4 flex items-center gap-2 text-fg/80 md:bottom-6 md:right-7">
          <span className="rec-dot" />
          <span>Rec</span>
          <Timecode className="text-fg/60" />
        </div>
      </div>

      <div
        ref={content}
        className="relative mx-auto flex min-h-[100dvh] max-w-[1680px] flex-col justify-end px-5 pb-24 pt-28 md:px-10 md:pb-28"
      >
        <h1 data-hero-in className="type-display text-[clamp(4.6rem,15.5vw,17rem)] leading-[0.8] text-fg">
          {hero.headline.map((line) => (
            <span key={line} className="block overflow-clip pb-[0.05em]">
              <span data-hl className="block">
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6 lg:col-span-5">
            <p data-hero-in data-hero-fade className="text-[clamp(1.3rem,2.1vw,1.9rem)] font-medium italic leading-tight">
              <span className="text-mute">From “{site.identity.from}”</span>{" "}
              <span className="text-fg">to “{site.identity.to}”</span>
            </p>
            <p data-hero-in data-hero-fade className="mt-3 max-w-[40ch] text-base leading-relaxed text-mute md:text-lg">
              {hero.sub}
            </p>
          </div>
          <div data-hero-in data-hero-fade className="flex flex-wrap gap-3 md:col-span-6 md:justify-end lg:col-span-7">
            <Button href={hero.primary.href} className="max-md:h-12 max-md:px-4 max-md:text-[0.72rem]">
              {hero.primary.label}
            </Button>
            <Button href={hero.secondary.href} variant="ghost" className="max-md:h-12 max-md:px-4 max-md:text-[0.72rem]">
              {hero.secondary.label}
            </Button>
          </div>
        </div>

        <p
          data-hero-in
          data-hero-fade
          className="type-label mt-10 text-fg/60 md:absolute md:bottom-6 md:left-7 md:mt-0"
        >
          {hero.location}
        </p>
      </div>
    </section>
  );
}
