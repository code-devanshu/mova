"use client";

import { useRef } from "react";
import Image from "next/image";
import { Check } from "@phosphor-icons/react";
import { gsap, Flip, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { socialMedia } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/ui/SplitHeading";

const ROLL = [
  { src: "/media/drone-roundabout.jpg", alt: "Aerial roundabout" },
  { src: "/media/music-studio.jpg", alt: "Recording studio in red light" },
  { src: "/media/creator-hoodie.jpg", alt: "Creator laughing in a blue hoodie", pick: 1 },
  { src: "/media/events-confetti.jpg", alt: "Confetti over a concert crowd" },
  { src: "/media/product-car-cover.jpg", alt: "Car under an orange cover" },
  { src: "/media/artist-portrait-blue.jpg", alt: "Artist portrait in blue light", pick: 2 },
  { src: "/media/creator-mountain.jpg", alt: "Photographer above the clouds" },
  { src: "/media/events-holi.jpg", alt: "Holi crowd in coloured powder" },
  { src: "/media/drone-snow-forest.jpg", alt: "Snowy forest from above" },
  { src: "/media/brand-yellow.jpg", alt: "Model in yellow trousers", pick: 3 },
  { src: "/media/artist-smoke.jpg", alt: "Singer in stage smoke" },
  { src: "/media/product-headphones.jpg", alt: "Headphones on yellow" },
];

/** The story of the section in one move: a messy camera roll becomes a curated feed. */
export function SocialMedia() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const box = stage.current;
      if (!box) return;
      const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]", box);
      const checks = gsap.utils.toArray<HTMLElement>("[data-check]", box);

      if (prefersReducedMotion()) {
        box.dataset.state = "feed";
        return;
      }

      gsap.set(checks, { scale: 0 });
      let tl: gsap.core.Timeline | null = null;

      const flipTo = (state: "roll" | "feed") => {
        tl?.kill();
        tl = gsap.timeline();
        if (state === "feed") {
          tl.to(checks, { scale: 1, duration: 0.35, ease: "back.out(2)", stagger: 0.14 }).add(() => {
            const snapshot = Flip.getState(tiles);
            box.dataset.state = "feed";
            Flip.from(snapshot, {
              duration: 1.15,
              ease: "expo.inOut",
              absolute: true,
              stagger: 0.015,
              onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.5 }),
            });
            gsap.to(checks, { scale: 0, duration: 0.3, delay: 0.2 });
          }, "+=0.15");
        } else {
          const snapshot = Flip.getState(tiles);
          box.dataset.state = "roll";
          Flip.from(snapshot, {
            duration: 0.9,
            ease: "expo.inOut",
            absolute: true,
            onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6 }),
          });
        }
      };

      const st = ScrollTrigger.create({
        trigger: box,
        start: "top 55%",
        onEnter: () => flipTo("feed"),
        onLeaveBack: () => flipTo("roll"),
      });

      return () => {
        st.kill();
        tl?.kill();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="social-media" aria-labelledby="social-media-title" className="relative bg-canvas px-5 py-24 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1680px] gap-14 md:grid-cols-12 md:items-center md:gap-10">
        <div className="md:col-span-5">
          <SplitHeading id="social-media-title" className="type-display text-[clamp(2.8rem,5.6vw,6rem)] text-fg">
            {socialMedia.headline}
          </SplitHeading>
          <p className="mt-8 text-2xl font-semibold leading-tight text-fg">{socialMedia.lead}</p>
          <p className="mt-3 max-w-[42ch] text-lg leading-relaxed text-mute">{socialMedia.body}</p>

          <ol className="mt-10 border-t border-line">
            {socialMedia.pillars.map((p) => (
              <li key={p.title} className="flex items-baseline justify-between gap-6 border-b border-line py-5">
                <span className="type-display text-[1.7rem] text-fg wdth-100 md:text-3xl">{p.title}</span>
                <span className="text-right text-mute">{p.line}</span>
              </li>
            ))}
          </ol>

          <div className="mt-10">
            <Button href={socialMedia.cta.href}>{socialMedia.cta.label}</Button>
          </div>
        </div>

        <div className="md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7">
          <div ref={stage} data-state="roll" className="cam-roll">
            {ROLL.map((t) => (
              <div key={t.src} data-tile data-pick={t.pick} className="relative overflow-hidden bg-surface">
                <Image src={t.src} alt={t.alt} fill sizes="(min-width: 768px) 25vw, 40vw" className="object-cover" />
                {t.pick ? (
                  <span
                    data-check
                    aria-hidden
                    className="absolute right-2 top-2 flex size-6 items-center justify-center bg-rec text-ink"
                  >
                    <Check size={14} weight="bold" />
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
