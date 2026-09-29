"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, MOTION } from "@/lib/gsap";
import { why } from "@/lib/content";
import { FrameCorners } from "@/components/ui/FrameCorners";
import { SplitHeading } from "@/components/ui/SplitHeading";

const GRADED = [
  { src: "/media/brand-mirror.jpg", alt: "Portrait in front of a round mirror" },
  { src: "/media/drone-dirt-road.jpg", alt: "Aerial dirt road" },
  { src: "/media/music-turntable.jpg", alt: "Record on a turntable" },
];

/** Four reasons, four different proofs: a crew, a shared grade, a feed-sized frame, an idea-to-upload line. */
export function WhyMova() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.from("[data-cell]", {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-bento]", start: "top 80%", once: true },
        });
        gsap.fromTo(
          "[data-upload-line]",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-upload-line]", start: "top 90%", end: "top 45%", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const [team, language, feed, upload] = why.items;

  return (
    <section ref={root} id="why" aria-labelledby="why-title" className="relative bg-canvas px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1680px]">
        <SplitHeading id="why-title" className="type-display text-[clamp(3.6rem,11vw,12rem)] text-fg">
          {why.headline}
        </SplitHeading>

        <div data-bento className="mt-12 grid gap-3 md:mt-16 md:grid-cols-3 md:grid-rows-[minmax(38vh,auto)_minmax(38vh,auto)]">
          {/* One creative team */}
          <article data-cell className="relative min-h-[52vh] overflow-hidden md:col-span-2 md:min-h-0">
            <Image src="/media/bts-crew-dark.jpg" alt="Two crew members setting up a shot together" fill sizes="(min-width: 768px) 66vw, 100vw" className="object-cover" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <h3 className="type-display text-[clamp(2.4rem,4.6vw,4.8rem)] text-paper">{team.title}</h3>
              <p className="mt-2 text-lg text-paper/85 md:text-xl">{team.line}</p>
            </div>
          </article>

          {/* One visual language: three different shots, one grade */}
          <article data-cell className="flex flex-col border border-line bg-surface p-6 md:row-span-2 md:p-8">
            <h3 className="type-display text-[clamp(2.2rem,3.6vw,3.8rem)] text-fg">{language.title}</h3>
            <p className="mt-2 text-lg text-mute">{language.line}</p>
            <div className="mt-8 grid flex-1 grid-cols-3 gap-2 md:grid-cols-1 md:grid-rows-3">
              {GRADED.map((g) => (
                <div key={g.src} className="relative min-h-28 overflow-hidden">
                  <Image src={g.src} alt={g.alt} fill sizes="(min-width: 768px) 30vw, 33vw" className="object-cover grayscale contrast-125" />
                  <div aria-hidden className="absolute inset-0 bg-rec mix-blend-multiply" />
                </div>
              ))}
            </div>
          </article>

          {/* Built for the feed */}
          <article data-cell className="grid grid-cols-[1fr_auto] gap-6 border border-line bg-surface p-6 md:p-8">
            <div className="flex flex-col">
              <h3 className="type-display text-[clamp(2.2rem,3.6vw,3.8rem)] text-fg">{feed.title}</h3>
              <p className="mt-2 max-w-[26ch] text-lg text-mute">{feed.line}</p>
            </div>
            <div className="relative aspect-[9/16] w-24 self-end overflow-hidden md:w-32">
              <Image src="/media/creator-red-top.jpg" alt="Vertical portrait framed for a reel" fill sizes="128px" className="object-cover" />
              <FrameCorners className="inset-1.5 text-paper" size={12} />
            </div>
          </article>

          {/* From idea to upload */}
          <article data-cell className="flex flex-col justify-between border border-line bg-surface p-6 md:p-8">
            <div>
              <h3 className="type-display text-[clamp(2.2rem,3.6vw,3.8rem)] text-fg">{upload.title}</h3>
              <p className="mt-2 text-lg text-mute">{upload.line}</p>
            </div>
            <div className="mt-10" aria-hidden>
              <div className="type-label flex justify-between text-mute">
                <span>Idea</span>
                <span>Shoot</span>
                <span>Edit</span>
                <span className="text-fg">Upload</span>
              </div>
              <div className="relative mt-3 h-4">
                <div data-upload-line className="absolute left-0 right-0 top-1/2 h-0.5 origin-left -translate-y-1/2 bg-rec" />
                <span className="absolute left-0 top-1/2 size-2.5 -translate-y-1/2 bg-rec" />
                <span className="absolute right-0 top-1/2 size-2.5 -translate-y-1/2 bg-rec" />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
