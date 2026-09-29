"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, MOTION } from "@/lib/gsap";
import { about } from "@/lib/content";
import { FrameCorners } from "@/components/ui/FrameCorners";
import { SplitHeading } from "@/components/ui/SplitHeading";

/** Who MOVA is, a rolling list of what they do, and the manifesto with its words struck through. */
export function About() {
  const root = useRef<HTMLElement>(null);
  const verbs = [...about.verbs, about.verbs[0]];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        // Rolling verb: step through each one, hold, loop seamlessly on the duplicated first word.
        const list = root.current?.querySelector("[data-roll]");
        if (!list) return;
        const n = about.verbs.length;
        const roll = gsap.timeline({ repeat: -1, paused: true });
        for (let i = 1; i <= n; i++) {
          roll.to(list, { yPercent: (-100 / (n + 1)) * i, duration: 0.7, ease: "expo.inOut" }, `+=1.1`);
        }
        roll.set(list, { yPercent: 0 });
        const st = ScrollTrigger.create({
          trigger: "[data-roller]",
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? roll.play() : roll.pause()),
        });

        gsap.fromTo(
          "[data-strike]",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "expo.inOut",
            stagger: 0.35,
            scrollTrigger: { trigger: "[data-manifesto]", start: "top 70%", once: true },
          },
        );

        gsap.fromTo(
          "[data-about-img]",
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: "[data-about-frame]", start: "top bottom", end: "bottom top", scrub: true },
          },
        );

        return () => {
          roll.kill();
          st.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" aria-labelledby="about-title" className="relative bg-canvas px-5 py-24 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1680px]">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <SplitHeading id="about-title" className="type-display text-[clamp(4rem,12vw,13rem)] text-fg">
              {about.headline}
            </SplitHeading>
            <p className="mt-8 max-w-[30ch] text-2xl font-medium leading-snug text-fg/90 md:text-[2rem]">{about.body}</p>

            <p className="sr-only">We {about.verbs.join(" We ")}</p>
            <div
              data-roller
              aria-hidden
              className="type-display mt-14 flex items-start gap-[0.25em] text-[clamp(2rem,6vw,6.4rem)] leading-none text-fg"
            >
              <span className="block h-[1em]">We</span>
              <span className="relative block h-[1em] overflow-hidden leading-none">
                <span data-roll className="flex flex-col text-rec">
                  {verbs.map((v, i) => (
                    <span key={i} className="block h-[1em] whitespace-nowrap leading-none">
                      {v}
                    </span>
                  ))}
                </span>
              </span>
            </div>
          </div>

          <div data-about-frame className="relative aspect-[3/4] overflow-hidden md:col-span-4 md:col-start-9 md:mt-24">
            <div data-about-img className="absolute -inset-y-[10%] inset-x-0">
              <Image
                src="/media/bts-hands-camera.jpg"
                alt="Hands gripping a camera with a large lens"
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
            <FrameCorners className="inset-3 text-paper" size={22} />
          </div>
        </div>

        <div data-manifesto className="mt-28 md:mt-44">
          <p className="type-display text-[clamp(2.9rem,8.4vw,9rem)] text-fg">
            {about.manifesto.map((line) => (
              <span key={line.struck} className="block">
                {line.lead}{" "}
                <span className="relative inline-block">
                  {line.struck}
                  <span
                    data-strike
                    aria-hidden
                    className="absolute inset-x-[-0.04em] top-[46%] h-[0.09em] origin-left bg-rec motion-reduce:scale-x-100"
                  />
                </span>{" "}
                {line.tail}
              </span>
            ))}
          </p>
          <p className="mt-8 text-2xl font-semibold text-mute md:ml-[24%] md:text-3xl">{about.close}</p>
        </div>
      </div>
    </section>
  );
}
