"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, MOTION } from "@/lib/gsap";

type Props = {
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  children: React.ReactNode;
  delay?: number;
  start?: string;
  id?: string;
};

/** Headline whose lines rise out of a mask as it scrolls into view. Static under reduced motion. */
export function SplitHeading({ as: Tag = "h2", className = "", children, delay = 0, start = "top 85%", id }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.25,
              ease: "expo.out",
              stagger: 0.09,
              delay,
              scrollTrigger: { trigger: el, start, once: true },
            });
          },
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
