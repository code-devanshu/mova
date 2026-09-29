"use client";

import { useRef } from "react";
import Image from "next/image";
import { InstagramLogo, LinkedinLogo, YoutubeLogo } from "@phosphor-icons/react";
import { gsap, ScrollTrigger, useGSAP, MOTION } from "@/lib/gsap";
import { site, social } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/ui/SplitHeading";

const icons = { Instagram: InstagramLogo, YouTube: YoutubeLogo, LinkedIn: LinkedinLogo } as const;

/** Behind-the-scenes reel: the page's one marquee, and it answers to your scroll speed and direction. */
export function SocialFeed() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const t = track.current;
        if (!t) return;
        const loop = gsap.to(t, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
        // Start deep into the loop so it can also run backwards when you scroll up.
        loop.totalTime(38 * 500);
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate(self) {
            const dir = self.direction === -1 ? -1 : 1;
            const boost = gsap.utils.clamp(0, 4, Math.abs(self.getVelocity()) / 400);
            gsap.to(loop, {
              timeScale: dir * (1 + boost),
              duration: 0.25,
              overwrite: true,
              onComplete: () => {
                gsap.to(loop, { timeScale: dir, duration: 1.2, ease: "power2.out" });
              },
            });
          },
          onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        });
        return () => {
          st.kill();
          loop.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const tiles = [...social.tiles, ...social.tiles];

  return (
    <section ref={root} id="social" aria-labelledby="social-title" className="relative overflow-hidden bg-canvas py-24 md:py-36">
      <div className="mx-auto grid max-w-[1680px] gap-10 px-5 md:grid-cols-12 md:px-10">
        <div className="md:col-span-7">
          <SplitHeading id="social-title" className="type-display text-[clamp(3.2rem,9vw,9.5rem)] text-fg">
            {social.headline}
          </SplitHeading>
          <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-1 text-xl font-medium text-mute md:text-2xl">
            {social.lines.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-end gap-6 md:col-span-5 md:items-end">
          <p className="type-display break-all text-[clamp(2rem,3.6vw,3.6rem)] text-fg wdth-100 md:text-right">{site.handle}</p>
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <Button href={site.socials[0].href} icon="external">
              {social.cta}
            </Button>
            {site.socials.map((s) => {
              const Icon = icons[s.label];
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-14 items-center gap-2 border border-line-strong px-4 text-xs font-semibold uppercase tracking-[0.08em] text-fg/85 transition-colors hover:border-fg hover:text-fg"
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sr-only sm:hidden">{s.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-16 overflow-hidden md:mt-24" aria-label="Behind the scenes">
        <div ref={track} className="marquee-track flex w-max gap-3 motion-reduce:overflow-x-auto">
          {tiles.map((t, i) => (
            <figure
              key={i}
              aria-hidden={i >= social.tiles.length}
              className={`group relative shrink-0 overflow-hidden bg-surface ${i % 3 === 1 ? "aspect-[9/16] w-[46vw] md:w-[16vw]" : "aspect-[4/5] w-[56vw] md:w-[21vw]"}`}
            >
              <Image
                src={t.src}
                alt={i >= social.tiles.length ? "" : t.alt}
                fill
                sizes="(min-width: 768px) 22vw, 56vw"
                className="object-cover transition-transform duration-700 ease-(--ease-expo) group-hover:scale-105"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
