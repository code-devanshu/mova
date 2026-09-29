"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, MOTION } from "@/lib/gsap";
import { contact, site, whatsappHref } from "@/lib/content";
import { Button } from "@/components/ui/Button";

export function ContactIntro() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const split = SplitText.create("[data-contact-title]", { type: "lines", mask: "lines", linesClass: "split-line" });
        gsap.from(split.lines, { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.08, delay: 0.3 });
        gsap.from("[data-contact-fade]", { y: 20, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08, delay: 0.6 });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="md:sticky md:top-[calc(var(--nav-h)+2.5rem)]">
      <h1 data-contact-title className="type-display text-[clamp(3.4rem,7.4vw,8rem)] text-fg">
        {contact.headline}
      </h1>
      <p data-contact-fade className="mt-8 flex items-center gap-3 text-xl font-semibold text-fg">
        <span className="rec-dot" aria-hidden />
        {contact.promise}
      </p>
      <div data-contact-fade className="mt-12 border-t border-line pt-8">
        <p className="text-lg text-mute">Rather talk it through?</p>
        <div className="mt-4">
          <Button href={whatsappHref()} variant="ghost" icon="whatsapp">
            Let’s talk on WhatsApp
          </Button>
        </div>
        <p className="type-label mt-10 text-mute">{site.locations.join(" · ")}</p>
      </div>
    </div>
  );
}
