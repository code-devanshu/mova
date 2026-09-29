"use client";

import { useRef } from "react";
import { ArrowRight, ArrowUpRight, WhatsappLogo } from "@phosphor-icons/react";
import { gsap, useGSAP, MOTION } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { TransitionLink } from "./TransitionLink";
import { FrameCorners } from "./FrameCorners";

type Variant = "solid" | "ghost" | "ink" | "ink-outline";
type Size = "sm" | "md" | "lg";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: "arrow" | "external" | "whatsapp" | "none";
  className?: string;
  onClick?: () => void;
};

// solid/ghost follow the theme; ink/ink-outline are fixed, for use on the red.
// Red hovers always carry ink text: paper on red is only 3.3:1.
const variants: Record<Variant, string> = {
  solid: "bg-fg text-canvas hover:bg-rec hover:text-ink",
  ghost: "border border-line-strong text-fg hover:border-fg hover:bg-fg/5",
  ink: "bg-ink text-paper hover:text-rec",
  "ink-outline": "border border-ink/45 text-ink hover:border-ink hover:bg-ink hover:text-paper",
};

const cornerTone: Record<Variant, string> = {
  solid: "text-fg",
  ghost: "text-fg",
  ink: "text-ink",
  "ink-outline": "text-ink",
};

const sizes: Record<Size, string> = {
  sm: "h-10 gap-2.5 px-4 text-[0.72rem]",
  md: "h-14 gap-3 px-6 text-[0.8rem]",
  lg: "h-16 gap-4 px-8 text-[0.9rem]",
};

/** CTA with a "focus lock" hover (viewfinder corners snap around it) and a light magnetic pull. */
export function Button({ href, children, variant = "solid", size = "md", icon = "arrow", className = "", onClick }: Props) {
  const wrap = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = wrap.current;
      if (!el || !contextSafe) return;
      const mm = gsap.matchMedia();
      mm.add(`${MOTION} and (hover: hover) and (pointer: fine)`, () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
        const move = contextSafe((e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.18);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
        });
        const leave = contextSafe(() => {
          xTo(0);
          yTo(0);
        });
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: wrap },
  );

  const Icon = icon === "external" ? ArrowUpRight : icon === "whatsapp" ? WhatsappLogo : ArrowRight;
  const classes = `group relative inline-flex shrink-0 items-center justify-center whitespace-nowrap font-semibold uppercase tracking-[0.06em] transition-[background-color,color,border-color] duration-300 active:scale-[0.98] ${sizes[size]} ${variants[variant]} ${className}`;

  const inner = (
    <>
      <span>{children}</span>
      {icon !== "none" && (
        <span aria-hidden className="relative block size-[1.15em] overflow-hidden">
          <Icon
            weight="bold"
            className="absolute inset-0 size-full transition-transform duration-500 ease-(--ease-expo) group-hover:translate-x-[120%]"
          />
          <Icon
            weight="bold"
            className="absolute inset-0 size-full -translate-x-[120%] transition-transform duration-500 ease-(--ease-expo) group-hover:translate-x-0"
          />
        </span>
      )}
      <FrameCorners lock className={`-inset-2 ${cornerTone[variant]}`} size={10} />
    </>
  );

  const isExternal = /^https?:/.test(href);
  const isHash = href.startsWith("#");

  return (
    <span ref={wrap} className="inline-flex will-change-transform">
      {isExternal ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes} onClick={onClick}>
          {inner}
        </a>
      ) : isHash ? (
        <a
          href={href}
          className={classes}
          onClick={(e) => {
            e.preventDefault();
            onClick?.();
            scrollToTarget(href);
          }}
        >
          {inner}
        </a>
      ) : (
        <TransitionLink href={href} className={classes} onClick={onClick}>
          {inner}
        </TransitionLink>
      )}
    </span>
  );
}
