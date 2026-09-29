"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { gsap, SplitText, useGSAP, MOTION } from "@/lib/gsap";
import { caseStudy } from "@/lib/content";
import { isPortrait, type Project } from "@/lib/projects";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { FrameCorners } from "@/components/ui/FrameCorners";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Button } from "@/components/ui/Button";

export function CaseStudy({ project, next }: { project: Project; next: Project }) {
  const root = useRef<HTMLElement>(null);
  const portrait = isPortrait(project.cover);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const title = SplitText.create("[data-cs-title]", { type: "words,chars", charsClass: "inline-block", mask: "lines" });
        gsap.from(title.chars, { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.025, delay: 0.3 });
        gsap.from("[data-cs-fade]", { y: 24, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08, delay: 0.5 });
        gsap.fromTo(
          "[data-cs-cover]",
          { clipPath: "inset(12% 12% 12% 12%)", scale: 1.15 },
          { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.6, ease: "expo.inOut", delay: 0.35 },
        );
        gsap.to("[data-cs-cover-img]", {
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: "[data-cs-cover]", start: "top top", end: "bottom top", scrub: true },
        });

        // "A thought. A mood. A 'what if?'" lights up line by line as you read.
        gsap.fromTo(
          "[data-idea-line]",
          { opacity: 0.12 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.5,
            scrollTrigger: { trigger: "[data-idea]", start: "top 75%", end: "bottom 50%", scrub: true },
          },
        );

        gsap.utils.toArray<HTMLElement>("[data-gallery-item]").forEach((item) => {
          gsap.from(item, {
            clipPath: "inset(18% 0% 0% 0%)",
            y: 60,
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: { trigger: item, start: "top 85%", once: true },
          });
        });

        return () => title.revert();
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [project.slug], revertOnUpdate: true },
  );

  const [lead, ...rest] = project.gallery;

  return (
    <article ref={root} className="pb-10 pt-28 md:pt-36">
      {/* Opening */}
      <header className="mx-auto max-w-[1680px] px-5 md:px-10">
        <div data-cs-fade className="flex items-center justify-between gap-6">
          <TransitionLink href="/work" className="group type-label inline-flex items-center gap-2 text-mute transition-colors hover:text-fg">
            <ArrowLeft weight="bold" className="transition-transform duration-500 group-hover:-translate-x-1" />
            All work
          </TransitionLink>
          <span className="type-label text-mute">
            {project.category} <span className="text-dim">/</span> {project.year}
          </span>
        </div>
        <h1 data-cs-title className="type-display mt-8 text-[clamp(3.8rem,13vw,14rem)] text-fg">
          {project.title}
        </h1>
        <p data-cs-fade className="mt-6 max-w-[40ch] text-2xl font-medium leading-snug text-fg/85 md:text-3xl">
          {project.summary}
        </p>
      </header>

      <div className="mx-auto mt-12 max-w-[1680px] px-5 md:mt-16 md:px-10">
        <div
          data-cs-cover
          className={`relative mx-auto overflow-hidden bg-surface ${portrait ? "max-w-[760px]" : ""}`}
          style={{ aspectRatio: portrait ? "4 / 5" : "16 / 9" }}
        >
          <div data-cs-cover-img className="absolute -inset-y-[6%] inset-x-0">
            <Image src={project.cover.src} alt={project.cover.alt} fill priority sizes="(min-width: 768px) 90vw, 100vw" className="object-cover" />
          </div>
          <FrameCorners className="inset-4 text-paper" size={26} />
        </div>
      </div>

      {/* The idea */}
      <section data-idea aria-labelledby="idea-title" className="mx-auto mt-28 grid max-w-[1680px] gap-8 px-5 md:mt-44 md:grid-cols-12 md:px-10">
        <SplitHeading id="idea-title" className="type-display text-[clamp(2.6rem,5vw,5.2rem)] text-fg md:col-span-4">
          {caseStudy.ideaHeading}
        </SplitHeading>
        <div className="md:col-span-7 md:col-start-6">
          {caseStudy.idea.map((line) => (
            <p key={line} data-idea-line className="text-[clamp(2rem,4.2vw,4.4rem)] font-semibold leading-[1.06] tracking-[-0.02em] text-fg">
              {line}
            </p>
          ))}
          <p className="mt-10 max-w-[40ch] text-xl leading-relaxed text-mute">{caseStudy.ideaClose}</p>
        </div>
      </section>

      {/* What we brought */}
      <section aria-labelledby="brought-title" className="mx-auto mt-28 max-w-[1680px] px-5 md:mt-40 md:px-10">
        <div className="grid gap-8 border-t border-line pt-10 md:grid-cols-12">
          <h2 id="brought-title" className="type-display text-[clamp(2rem,3.4vw,3.4rem)] text-fg md:col-span-4">
            {caseStudy.broughtHeading}
          </h2>
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 md:col-span-7 md:col-start-6">
            {project.brought.map((c, i) => (
              <li key={c} className="flex items-baseline gap-4">
                <span className="type-label text-rec-fg">{String(i + 1).padStart(2, "0")}</span>
                <span className="type-display text-[clamp(2rem,3.4vw,3.4rem)] text-fg wdth-90">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Frames */}
      <section aria-label="Frames" className="mx-auto mt-28 grid max-w-[1680px] gap-4 px-5 md:mt-40 md:grid-cols-12 md:gap-6 md:px-10">
        {lead && (
          <figure data-gallery-item className="relative overflow-hidden md:col-span-12" style={{ aspectRatio: isPortrait(lead) ? "4 / 5" : "21 / 9" }}>
            <Image src={lead.src} alt={lead.alt} fill sizes="100vw" className="object-cover" />
          </figure>
        )}
        {rest.map((m, i) => (
          <figure
            key={m.src}
            data-gallery-item
            className={`relative overflow-hidden ${i % 2 === 0 ? "md:col-span-7" : "md:col-span-5 md:mt-[14vh]"}`}
            style={{ aspectRatio: isPortrait(m) ? "4 / 5" : "3 / 2" }}
          >
            <Image src={m.src} alt={m.alt} fill sizes="(min-width: 768px) 55vw, 100vw" className="object-cover" />
          </figure>
        ))}
      </section>

      <div className="mx-auto mt-20 flex max-w-[1680px] flex-wrap items-center justify-between gap-6 px-5 md:mt-28 md:px-10">
        <p className="text-2xl font-semibold text-fg md:text-3xl">Got something like this in mind?</p>
        <Button href="/contact">Start a project</Button>
      </div>

      {/* Next project: a dark "trailer" band in both themes. */}
      <TransitionLink
        href={`/work/${next.slug}`}
        className="group relative mt-28 block overflow-hidden border-y border-line bg-ink md:mt-40"
      >
        <div className="absolute inset-0 opacity-30 transition-opacity duration-700 group-hover:opacity-60">
          <Image src={next.cover.src} alt="" fill sizes="100vw" className="object-cover transition-transform duration-[1.2s] ease-(--ease-expo) group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
        </div>
        <div className="relative mx-auto flex max-w-[1680px] flex-col gap-4 px-5 py-20 md:px-10 md:py-32">
          <span className="type-label text-paper/60">Next project</span>
          <span className="type-display flex items-center gap-4 text-[clamp(3.2rem,10vw,11rem)] text-paper">
            {next.title}
            <ArrowRight aria-hidden weight="bold" className="size-[0.5em] text-rec transition-transform duration-500 group-hover:translate-x-3" />
          </span>
        </div>
      </TransitionLink>
    </article>
  );
}
