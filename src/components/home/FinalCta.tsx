"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION } from "@/lib/gsap";
import { finalCta, whatsappHref } from "@/lib/content";
import { Button } from "@/components/ui/Button";

/** The REC light grows until it fills the frame: the page's one full colour moment. */
export function FinalCta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.fromTo(
          "[data-rec-fill]",
          { clipPath: "circle(0% at 50% 55%)" },
          {
            clipPath: "circle(75% at 50% 55%)",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 15%", scrub: 0.6 },
          },
        );
        gsap.from("[data-cta-line]", {
          yPercent: 110,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 40%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="start" aria-labelledby="start-title" className="relative overflow-hidden bg-canvas">
      <div data-rec-fill aria-hidden className="absolute inset-0 bg-rec" />
      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1680px] flex-col justify-center px-5 py-28 text-ink md:px-10">
        <h2 id="start-title" className="type-display text-[clamp(3.4rem,10.5vw,11.5rem)]">
          {finalCta.headline.map((l) => (
            <span key={l} className="block overflow-clip pb-[0.04em]">
              <span data-cta-line className="block">
                {l}
              </span>
            </span>
          ))}
        </h2>
        <div className="mt-10 flex flex-col gap-10 md:mt-14 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[30ch] text-2xl font-semibold leading-tight md:text-3xl">
            {finalCta.body[0]}
            <br />
            {finalCta.body[1]}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button href={finalCta.primary.href} variant="ink" size="lg">
              {finalCta.primary.label}
            </Button>
            <span className="type-label">or</span>
            <Button href={whatsappHref()} variant="ink-outline" size="lg" icon="whatsapp">
              {finalCta.secondary}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
