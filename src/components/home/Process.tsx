"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, MOTION } from "@/lib/gsap";
import { process } from "@/lib/content";
import { SplitHeading } from "@/components/ui/SplitHeading";

const FPS = 24;
const TOTAL_SECONDS = 60;
const pad = (n: number) => String(n).padStart(2, "0");
const tc = (frames: number) => {
  const s = Math.floor(frames / FPS);
  return `00:${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(Math.floor(frames % FPS))}`;
};

/**
 * The process as an edit: scrolling scrubs a playhead across six clips on a timeline,
 * and the "program monitor" above shows the step under the playhead.
 */
export function Process() {
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const steps = process.steps;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const head = el.querySelector<HTMLElement>("[data-playhead]");
        const track = el.querySelector<HTMLElement>("[data-track]");
        const code = el.querySelector<HTMLElement>("[data-tc]");
        if (!head || !track || !code) return;
        let current = 0;
        const st = ScrollTrigger.create({
          trigger: el.querySelector("[data-process-pin]"),
          start: "top top",
          end: () => `+=${window.innerHeight * 3}`,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const p = self.progress;
            head.style.transform = `translate3d(${p * track.clientWidth}px,0,0)`;
            code.textContent = tc(p * TOTAL_SECONDS * FPS);
            const i = Math.min(steps.length - 1, Math.floor(p * steps.length));
            if (i !== current) {
              current = i;
              setStep(i);
            }
          },
        });
        return () => st.kill();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="process" aria-label={process.headline} className="relative bg-canvas">
      {/* Motion version: pinned edit timeline */}
      <div
        data-process-pin
        className="flex h-[100dvh] flex-col px-5 pb-6 pt-[calc(var(--nav-h)+1.25rem)] motion-reduce:hidden md:px-10 md:pb-10"
      >
        <div className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col">
          <SplitHeading id="process-title" className="type-display text-[clamp(2.6rem,6.5vw,7rem)] text-fg">
            {process.headline}
          </SplitHeading>

          <div className="relative grid flex-1 grid-rows-[1fr_auto] gap-5 py-5 md:grid-cols-12 md:grid-rows-1 md:items-end md:gap-10 md:py-8">
            <div className="relative h-[30vh] md:col-span-7 md:h-full">
              {steps.map((s, i) => (
                <div
                  key={s.word}
                  aria-hidden={i !== step}
                  className={`absolute inset-x-0 bottom-0 transition-[opacity,translate] duration-700 ease-(--ease-expo) ${
                    i === step ? "translate-y-0 opacity-100" : i < step ? "-translate-y-6 opacity-0" : "translate-y-6 opacity-0"
                  }`}
                >
                  <span className="type-label text-rec-fg">{pad(i + 1)}</span>
                  <p className="type-display mt-2 text-[clamp(4.5rem,13vw,14rem)] text-fg">{s.word}</p>
                  <p className="mt-3 text-xl font-medium text-fg/85 md:text-3xl">{s.line}</p>
                </div>
              ))}
            </div>
            <div className="relative order-first min-h-[22vh] overflow-hidden bg-surface md:order-none md:col-span-5 md:h-full md:min-h-0">
              {steps.map((s, i) => (
                <Image
                  key={s.word}
                  src={s.image}
                  alt={i === step ? s.alt : ""}
                  aria-hidden={i !== step}
                  fill
                  sizes="40vw"
                  className={`object-cover transition-opacity duration-700 ${i === step ? "opacity-100" : "opacity-0"}`}
                />
              ))}
              <span className="corners absolute inset-3 text-paper" style={{ "--c": "18px" } as React.CSSProperties}>
                <i />
                <i />
                <i />
                <i />
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div aria-hidden className="select-none">
            <div className="type-label flex items-center justify-between text-mute">
              <span className="flex items-center gap-2 text-fg">
                <span className="rec-dot" /> <span data-tc className="tabular-nums">00:00:00:00</span>
              </span>
              <span className="tabular-nums">00:01:00:00</span>
            </div>
            <div className="mt-3 flex justify-between border-b border-line pb-1">
              {Array.from({ length: 25 }, (_, i) => (
                <span key={i} className={`w-px bg-line-strong ${i % 4 === 0 ? "h-3" : "h-1.5"}`} />
              ))}
            </div>
            <div data-track className="relative mt-2 h-14 md:h-16">
              <div className="flex h-full gap-1">
                {steps.map((s, i) => (
                  <div
                    key={s.word}
                    className={`relative flex-1 overflow-hidden border px-2 py-1.5 transition-colors duration-500 ${
                      i === step ? "border-rec" : i < step ? "border-fg/40" : "border-line"
                    }`}
                  >
                    <Image src={s.image} alt="" fill sizes="16vw" className="object-cover opacity-30" />
                    <span className="type-label relative text-fg">{s.word}</span>
                  </div>
                ))}
              </div>
              <div data-playhead className="absolute -top-3 bottom-0 left-0 w-px bg-rec will-change-transform">
                <span className="absolute -left-[5px] -top-1 block size-[11px] bg-rec" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reduced motion: the same steps as a plain sequence */}
      <div className="mx-auto hidden max-w-[1680px] px-5 py-24 motion-reduce:block md:px-10">
        <h2 className="type-display text-[clamp(2.6rem,6.5vw,7rem)] text-fg">{process.headline}</h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.word}>
              <span className="type-label text-rec-fg">{pad(i + 1)}</span>
              <p className="type-display mt-2 text-6xl text-fg">{s.word}</p>
              <p className="mt-2 text-lg text-mute">{s.line}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
