"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";
import { gsap, ScrollTrigger, useGSAP, MOTION } from "@/lib/gsap";
import { workSection } from "@/lib/content";
import { categories, categorySlug, featuredProjects, isPortrait } from "@/lib/projects";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { FrameCorners } from "@/components/ui/FrameCorners";
import { SplitHeading } from "@/components/ui/SplitHeading";

/** "Just the frames": a film strip that pans sideways as you scroll down. */
export function SelectedWork() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION} and (min-width: 768px)`, () => {
        const t = track.current;
        if (!t || !pin.current) return;
        const distance = () => Math.max(0, t.scrollWidth - window.innerWidth);

        const pan = gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        // Frames lean into the direction of travel, like a strip running through a gate.
        const skewTo = gsap.quickTo("[data-work-frame]", "skewX", { duration: 0.6, ease: "power3.out" });
        const st = ScrollTrigger.create({
          trigger: pin.current,
          start: "top top",
          end: () => `+=${distance()}`,
          onUpdate: (self) => skewTo(gsap.utils.clamp(-5, 5, self.getVelocity() / -350)),
        });
        const settle = () => skewTo(0);
        ScrollTrigger.addEventListener("scrollEnd", settle);

        gsap.utils.toArray<HTMLElement>("[data-work-img]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: img.parentElement,
                containerAnimation: pan,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });

        return () => {
          st.kill();
          ScrollTrigger.removeEventListener("scrollEnd", settle);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" aria-labelledby="work-title" className="relative bg-canvas pt-24 md:pt-36">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <SplitHeading id="work-title" className="type-display text-[clamp(4rem,14vw,15rem)] text-fg">
          {workSection.headline}
        </SplitHeading>
        <div className="mt-6 flex flex-col gap-8 md:mt-8 md:flex-row md:items-end md:justify-between">
          <p className="text-2xl font-semibold leading-tight text-fg md:text-3xl">
            {workSection.sub[0]}
            <br />
            <span className="text-mute">{workSection.sub[1]}</span>
          </p>
          <ul className="flex flex-wrap gap-2" aria-label="Browse work by category">
            {categories.map((c) => (
              <li key={c}>
                <TransitionLink
                  href={`/work?category=${categorySlug(c)}`}
                  className="block border border-line-strong px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-fg/80 transition-colors hover:border-rec hover:text-fg"
                >
                  {c}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div ref={pin} className="relative mt-12 flex flex-col justify-center md:mt-0 md:h-[100dvh] md:overflow-hidden">
        {/* The strip is film, so it stays dark in both themes: on the light theme it lies across the page like film on a light table. */}
        <div className="bg-ink py-3 text-paper md:py-4">
          <div aria-hidden className="sprockets mb-4 md:mb-5" />
          <div
            ref={track}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:snap-none md:gap-6 md:overflow-visible md:px-10 md:pb-0"
          >
            {featuredProjects.map((p) => {
              const portrait = isPortrait(p.cover);
              return (
                <TransitionLink
                  key={p.slug}
                  href={`/work/${p.slug}`}
                  data-work-frame
                  className="group block shrink-0 snap-start"
                >
                  <div
                    className={`relative overflow-hidden bg-paper/5 md:h-[58vh] md:w-auto ${portrait ? "w-[70vw]" : "w-[84vw]"}`}
                    style={{ aspectRatio: portrait ? "4 / 5" : "3 / 2" }}
                  >
                    <div data-work-img className="absolute -inset-x-[8%] inset-y-0">
                      <Image
                        src={p.cover.src}
                        alt={p.cover.alt}
                        fill
                        sizes="(min-width: 768px) 45vw, 85vw"
                        className="object-cover transition-transform duration-700 ease-(--ease-expo) group-hover:scale-[1.04]"
                      />
                    </div>
                    <FrameCorners lock className="inset-3 text-paper" size={20} />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-6">
                    <h3 className="type-display text-[1.9rem] text-paper wdth-90 md:text-[2.4rem]">{p.title}</h3>
                    <span className="type-label text-paper/55 transition-colors group-hover:text-rec">{p.category}</span>
                  </div>
                </TransitionLink>
              );
            })}

            <TransitionLink
              href={workSection.cta.href}
              className="group relative flex w-[70vw] shrink-0 snap-start flex-col justify-between border border-paper/15 p-6 md:h-[58vh] md:w-[34vw] md:p-8"
              style={{ aspectRatio: "4 / 5" }}
            >
              <span className="type-label text-paper/55">Full archive</span>
              <span className="type-display text-[clamp(3rem,5.5vw,6rem)] text-paper">
                {workSection.cta.label}
                <ArrowRight
                  aria-hidden
                  weight="bold"
                  className="ml-3 inline size-[0.6em] align-baseline text-rec transition-transform duration-500 group-hover:translate-x-2"
                />
              </span>
              <FrameCorners lock className="-inset-2 text-paper" />
            </TransitionLink>
          </div>
          <div aria-hidden className="sprockets mt-4 md:mt-5" />
        </div>
      </div>
    </section>
  );
}
