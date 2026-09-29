"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, MOTION } from "@/lib/gsap";
import { services } from "@/lib/content";
import { FrameCorners } from "@/components/ui/FrameCorners";
import { SplitHeading } from "@/components/ui/SplitHeading";

/** Four disciplines as a sticky stack: each new card slides over the last, which sinks back. */
export function Services() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root.current);
        cards.forEach((card, i) => {
          const img = card.querySelector("[data-card-img]");
          gsap.fromTo(
            img,
            { yPercent: -6, scale: 1.12 },
            {
              yPercent: 6,
              scale: 1.12,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
            },
          );

          const next = cards[i + 1];
          if (!next) return;
          const trigger = { trigger: next, start: "top bottom", end: "top 20%", scrub: true };
          gsap.to(card.querySelector("[data-card-inner]"), { scale: 0.93, ease: "none", scrollTrigger: trigger });
          gsap.to(card.querySelector("[data-card-shade]"), { opacity: 0.65, ease: "none", scrollTrigger: trigger });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="services" aria-labelledby="services-title" className="relative bg-canvas px-5 pb-24 md:px-10 md:pb-40">
      <div className="mx-auto max-w-[1680px]">
        <header className="max-w-4xl pb-14 md:pb-20">
          <SplitHeading id="services-title" className="type-display text-[clamp(3.2rem,9vw,9.5rem)] text-fg">
            {services.headline}
          </SplitHeading>
          <p className="mt-6 max-w-[34ch] text-xl leading-snug text-mute md:text-2xl">{services.sub}</p>
        </header>

        <div className="relative">
          {services.items.map((s, i) => (
            <article
              key={s.id}
              data-card
              aria-labelledby={`service-${s.id}`}
              className="sticky pb-[4vh]"
              style={{ top: `calc(var(--nav-h) + ${i * 1.1}rem)` }}
            >
              <div
                data-card-inner
                className="relative grid min-h-[76vh] origin-top gap-6 overflow-hidden border border-line bg-surface p-5 md:grid-cols-12 md:gap-10 md:p-8 lg:min-h-[78vh]"
              >
                <div className="flex flex-col md:col-span-5">
                  <span className="type-label text-rec-fg">{String(i + 1).padStart(2, "0")}</span>
                  <h3 id={`service-${s.id}`} className="type-display mt-3 text-[clamp(3.2rem,7.5vw,8rem)] text-fg">
                    {s.title}
                  </h3>
                  <p className="mt-5 max-w-[20ch] text-2xl font-semibold leading-tight tracking-[-0.01em] text-fg md:text-[2rem]">
                    {s.line}
                  </p>
                  {"detail" in s && s.detail ? <p className="mt-3 max-w-[36ch] text-mute">{s.detail}</p> : null}
                  <ul className="mt-8 flex flex-wrap gap-2 md:mt-auto md:pt-10">
                    {s.offer.map((o) => (
                      <li key={o} className="border border-line-strong px-3 py-1.5 text-sm text-fg/85">
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative min-h-[34vh] overflow-hidden md:col-span-7 md:min-h-0">
                  <div data-card-img className="absolute inset-0">
                    <Image src={s.image} alt={s.alt} fill sizes="(min-width: 768px) 55vw, 100vw" className="object-cover" />
                  </div>
                  <FrameCorners className="inset-3 text-paper/80" size={22} />
                </div>
                <div data-card-shade aria-hidden className="pointer-events-none absolute inset-0 bg-canvas opacity-0" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
