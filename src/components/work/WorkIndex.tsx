"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, Flip, ScrollTrigger, useGSAP, MOTION, prefersReducedMotion } from "@/lib/gsap";
import { workSection } from "@/lib/content";
import { categories, categorySlug, isPortrait, projects } from "@/lib/projects";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { FrameCorners } from "@/components/ui/FrameCorners";

// A five-beat rhythm so the archive never settles into an even grid.
const SLOTS = [
  "md:col-span-7",
  "md:col-span-5 md:mt-[16vh]",
  "md:col-span-4 md:col-start-2",
  "md:col-span-6 md:col-start-7 md:mt-[10vh]",
  "md:col-span-10 md:col-start-2",
];

export function WorkIndex({ initialCategory }: { initialCategory: string }) {
  const root = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const valid = ["all", ...categories.map(categorySlug)];
  const [filter, setFilter] = useState(valid.includes(initialCategory) ? initialCategory : "all");

  const visible = projects.filter((p) => filter === "all" || categorySlug(p.category) === filter);

  const choose = (next: string) => {
    if (next === filter) return;
    if (!prefersReducedMotion()) flipState.current = Flip.getState("[data-work-item]");
    setFilter(next);
    const url = next === "all" ? "/work" : `/work?category=${next}`;
    window.history.replaceState(null, "", url);
  };

  // Animate from the old layout to the new one after React commits the filter.
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    Flip.from(state, {
      duration: 0.9,
      ease: "expo.inOut",
      absolute: true,
      nested: true,
      stagger: 0.02,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }),
      onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.35 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [filter]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        gsap.from("[data-work-title] > span > span", { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.08, delay: 0.25 });
        gsap.from("[data-work-item]:not(.hidden)", { y: 60, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.07, delay: 0.45 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const counts = Object.fromEntries(categories.map((c) => [categorySlug(c), projects.filter((p) => p.category === c).length]));

  return (
    <div ref={root} className="px-5 pb-28 pt-32 md:px-10 md:pb-40 md:pt-40">
      <div className="mx-auto max-w-[1680px]">
        <h1 data-work-title className="type-display text-[clamp(4.5rem,17vw,19rem)] text-fg">
          <span className="block overflow-clip pb-[0.04em]">
            <span className="block">{workSection.headline}</span>
          </span>
        </h1>
        <p className="mt-6 text-2xl font-semibold leading-tight text-fg md:text-3xl">
          {workSection.sub[0]} <span className="text-mute">{workSection.sub[1]}</span>
        </p>

        <div role="toolbar" aria-label="Filter work by category" className="mt-12 flex flex-wrap gap-2 md:mt-16">
          {["all", ...categories.map(categorySlug)].map((slug) => {
            const label = slug === "all" ? "All" : categories.find((c) => categorySlug(c) === slug);
            const active = filter === slug;
            return (
              <button
                key={slug}
                type="button"
                onClick={() => choose(slug)}
                aria-pressed={active}
                className={`flex h-11 items-center gap-2 border px-4 text-xs font-semibold uppercase tracking-[0.08em] transition-colors ${
                  active ? "border-fg bg-fg text-canvas" : "border-line-strong text-fg/80 hover:border-fg hover:text-fg"
                }`}
              >
                {label}
                <span className={`font-mono text-[0.65rem] ${active ? "text-canvas/60" : "text-mute"}`}>
                  {slug === "all" ? projects.length : counts[slug]}
                </span>
              </button>
            );
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {visible.length} projects
        </p>

        <ul className="mt-14 grid gap-x-6 gap-y-14 md:mt-20 md:grid-cols-12 md:gap-y-24">
          {projects.map((p) => {
            const index = visible.indexOf(p);
            const shown = index !== -1;
            const slot = SLOTS[(shown ? index : 0) % SLOTS.length];
            const wide = slot.includes("col-span-10");
            const ratio = wide ? "16 / 9" : isPortrait(p.cover) ? "4 / 5" : "3 / 2";
            return (
              <li key={p.slug} data-work-item data-flip-id={p.slug} className={`${slot} ${shown ? "" : "hidden"}`}>
                <TransitionLink href={`/work/${p.slug}`} className="group block">
                  <div className="relative overflow-hidden bg-surface" style={{ aspectRatio: ratio }}>
                    <Image
                      src={p.cover.src}
                      alt={p.cover.alt}
                      fill
                      sizes={wide ? "(min-width: 768px) 80vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
                      className="object-cover transition-transform duration-[900ms] ease-(--ease-expo) group-hover:scale-[1.04]"
                    />
                    <FrameCorners lock className="inset-3 text-paper" size={20} />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-6">
                    <h2 className="type-display text-[2rem] text-fg wdth-90 md:text-[2.6rem]">{p.title}</h2>
                    <span className="type-label shrink-0 text-mute transition-colors group-hover:text-rec-fg">
                      {p.category} <span className="text-dim">/</span> {p.year}
                    </span>
                  </div>
                  <p className="mt-1 max-w-[52ch] text-mute">{p.summary}</p>
                </TransitionLink>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
