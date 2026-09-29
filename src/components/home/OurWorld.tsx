"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, MOTION, prefersReducedMotion } from "@/lib/gsap";
import { world } from "@/lib/content";
import { SplitHeading } from "@/components/ui/SplitHeading";

/**
 * Six worlds, one frame. The frame reshapes to the native aspect ratio of each
 * world (a 9:16 reel for creators, a square cover for artists, widescreen for events).
 */
export function OurWorld() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Fit the active aspect ratio inside the stage and animate the frame to it.
  useGSAP(
    () => {
      const box = stage.current;
      const f = frame.current;
      if (!box || !f) return;
      const [rw, rh] = world.items[active].ratio;
      const fit = () => {
        const sw = box.clientWidth;
        const sh = box.clientHeight;
        const scale = Math.min(sw / rw, sh / rh);
        return { width: rw * scale, height: rh * scale };
      };
      gsap.to(f, {
        ...fit(),
        duration: prefersReducedMotion() ? 0 : 1.1,
        ease: "expo.inOut",
        overwrite: true,
      });
      const onResize = () => gsap.set(f, fit());
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    { dependencies: [active], scope: root },
  );

  // Desktop: the item crossing the middle of the viewport becomes active.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-world-item]", root.current);
        items.forEach((item, i) => {
          ScrollTrigger.create({
            trigger: item,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => self.isActive && setActive(i),
          });
        });
      });
      mm.add(`${MOTION} and (min-width: 768px)`, () => {
        gsap.from("[data-world-item]", {
          opacity: 0,
          x: -30,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-world-list]", start: "top 80%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const current = world.items[active];

  return (
    <section ref={root} id="world" aria-labelledby="world-title" className="relative bg-canvas px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1680px]">
        <SplitHeading id="world-title" className="type-display max-w-[12ch] text-[clamp(3.2rem,9vw,9.5rem)] text-fg">
          {world.headline}
        </SplitHeading>

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:gap-8">
          <ol data-world-list className="flex flex-col md:col-span-6">
            {world.items.map((item, i) => (
              <li key={item.id} data-world-item className="border-t border-line py-7 md:py-[9vh]">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  className="group block w-full text-left"
                >
                  <span className="flex items-baseline justify-between gap-4">
                    <span
                      className={`type-display block text-[clamp(3rem,7vw,7.5rem)] transition-colors duration-500 ${
                        active === i ? "text-fg" : "text-fg/50 md:group-hover:text-fg/75"
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className={`type-label transition-colors ${active === i ? "text-rec-fg" : "text-mute"}`}>
                      {item.format}
                    </span>
                  </span>
                  <span
                    className={`mt-2 block text-xl font-medium transition-colors duration-500 md:text-2xl ${
                      active === i ? "text-fg" : "text-mute"
                    }`}
                  >
                    {item.line}
                  </span>
                </button>

                {/* Mobile: each world shows its own frame inline, in its native ratio. */}
                <div
                  className="relative mt-6 w-full overflow-hidden md:hidden"
                  style={{ aspectRatio: `${item.ratio[0]} / ${item.ratio[1]}`, maxHeight: "70vh" }}
                >
                  <Image src={item.image} alt={item.alt} fill sizes="100vw" className="object-cover" />
                </div>
              </li>
            ))}
          </ol>

          <div className="hidden md:col-span-6 md:block">
            <div className="sticky top-[calc(var(--nav-h)+2rem)] flex h-[calc(100dvh-var(--nav-h)-4rem)] flex-col">
              <div ref={stage} className="relative flex flex-1 items-center justify-center">
                <div ref={frame} className="relative h-3/4 w-1/2 overflow-hidden bg-surface">
                  {world.items.map((item, i) => (
                    <Image
                      key={item.id}
                      src={item.image}
                      alt={active === i ? item.alt : ""}
                      aria-hidden={active !== i}
                      fill
                      sizes="50vw"
                      className={`object-cover transition-[opacity,scale] duration-[900ms] ease-(--ease-expo) ${
                        active === i ? "scale-100 opacity-100" : "scale-110 opacity-0"
                      }`}
                    />
                  ))}
                  <span className="corners absolute inset-2 text-paper" style={{ "--c": "20px" } as React.CSSProperties}>
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="type-label text-mute">{current.title}</span>
                <span className="type-label text-fg">{current.format}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
