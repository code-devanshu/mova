"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "@/lib/gsap";

const LETTERS = ["M", "O", "V", "A"];

/**
 * Full-bleed wordmark. Letters condense as the footer arrives, and each letter
 * stretches wide under the cursor, the brand's "make ideas move" idea in type.
 */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe) return;
      const letters = gsap.utils.toArray<HTMLElement>("[data-letter]", el);
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.fromTo(
          letters,
          { "--wdth": 125, yPercent: 40 },
          {
            "--wdth": 88,
            yPercent: 0,
            ease: "none",
            stagger: 0.05,
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: 0.6 },
          },
        );
      });
      mm.add(`${MOTION} and (hover: hover)`, () => {
        const enter = contextSafe((e: Event) =>
          gsap.to(e.currentTarget as HTMLElement, { "--wdth": 125, duration: 0.8, ease: "expo.out", overwrite: "auto" }),
        );
        const leave = contextSafe((e: Event) =>
          gsap.to(e.currentTarget as HTMLElement, { "--wdth": 88, duration: 1, ease: "expo.out", overwrite: "auto" }),
        );
        letters.forEach((l) => {
          l.addEventListener("pointerenter", enter);
          l.addEventListener("pointerleave", leave);
        });
        return () =>
          letters.forEach((l) => {
            l.removeEventListener("pointerenter", enter);
            l.removeEventListener("pointerleave", leave);
          });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="mt-16 flex select-none justify-between overflow-hidden px-3 md:mt-24 md:px-6" aria-hidden>
      {LETTERS.map((l, i) => (
        <span
          key={i}
          data-letter
          className="type-display block text-[25vw] leading-[0.78] text-fg"
          style={{ "--wdth": 88 } as React.CSSProperties}
        >
          {l}
        </span>
      ))}
    </div>
  );
}
