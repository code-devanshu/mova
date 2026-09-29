"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, MOTION } from "@/lib/gsap";
import { intro } from "@/lib/content";

/**
 * "We make ideas move." The word MOVE physically stretches on its width axis as you scroll,
 * then the lead line lights up word by word at reading pace.
 */
export function Intro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.fromTo(
          "[data-stretch]",
          { "--wdth": 62, letterSpacing: "-0.02em" },
          {
            "--wdth": 125,
            letterSpacing: "0.02em",
            ease: "none",
            scrollTrigger: { trigger: "[data-stretch]", start: "top 85%", end: "top 25%", scrub: 0.8 },
          },
        );

        const lead = SplitText.create("[data-lead]", { type: "words", wordsClass: "inline-block" });
        gsap.fromTo(
          lead.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: "[data-lead]", start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );

        gsap.from("[data-mantra] > *", {
          yPercent: 100,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-mantra]", start: "top 85%", once: true },
        });

        return () => lead.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="intro" aria-labelledby="intro-title" className="relative bg-canvas px-5 py-28 md:px-10 md:py-44">
      <div className="mx-auto max-w-[1680px]">
        <h2 id="intro-title" className="type-display text-[clamp(3.4rem,11vw,12rem)] text-fg">
          <span className="block">{intro.headline[0]}</span>
          <span data-stretch className="block text-rec" style={{ "--wdth": 90 } as React.CSSProperties}>
            {intro.headline[1]}
          </span>
        </h2>

        <div className="mt-16 md:mt-24 md:pl-[24%]">
          <p data-lead className="max-w-[22ch] text-[clamp(1.9rem,4.2vw,4.1rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-fg">
            {intro.lead}
          </p>
          <p className="mt-8 max-w-[46ch] text-lg leading-relaxed text-mute md:text-xl">{intro.body}</p>
        </div>

        <p data-mantra className="mt-24 grid gap-2 md:mt-36 md:grid-cols-3 md:gap-6">
          {intro.mantra.map((m) => (
            <span key={m} className="type-display block text-[clamp(2.8rem,6.5vw,7rem)] text-fg">
              {m} <span className="text-mute">it.</span>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
