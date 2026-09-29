"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { getProject } from "@/lib/projects";

type TransitionApi = { navigate: (href: string) => void };

const TransitionContext = createContext<TransitionApi | null>(null);

export function usePageTransition() {
  return useContext(TransitionContext);
}

/** The title card shown while the shutter is closed, like a slate between scenes. */
function slateFor(pathname: string) {
  if (pathname === "/") return "Own the frame.";
  if (pathname === "/work") return "The work";
  if (pathname === "/contact") return "Start a project";
  if (pathname.startsWith("/work/")) return getProject(pathname.split("/")[2])?.title ?? "The work";
  return "MOVA";
}

const BARS = 6;

export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  const slate = useRef<HTMLParagraphElement>(null);
  const busy = useRef(false);
  const covered = useRef(false);
  const pendingHash = useRef<string | null>(null);
  const failsafe = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reveal = useCallback(() => {
    const el = overlay.current;
    if (!el) return;
    if (failsafe.current) clearTimeout(failsafe.current);
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(el, { visibility: "hidden" });
        busy.current = false;
      },
    });
    tl.to(slate.current, { autoAlpha: 0, y: -12, duration: 0.3, ease: "power2.in" })
      .to(el.querySelectorAll("[data-layer='ink']"), {
        scaleY: 0,
        transformOrigin: "50% 0%",
        duration: 0.7,
        ease: "expo.inOut",
        stagger: 0.035,
      })
      .to(
        el.querySelectorAll("[data-layer='rec']"),
        { scaleY: 0, transformOrigin: "50% 0%", duration: 0.7, ease: "expo.inOut", stagger: 0.035 },
        "<0.08",
      );
  }, []);

  const navigate = useCallback(
    (href: string) => {
      const el = overlay.current;
      const url = new URL(href, window.location.href);
      if (busy.current) return;
      if (!el || prefersReducedMotion()) {
        router.push(href);
        return;
      }

      busy.current = true;
      pendingHash.current = url.hash || null;
      if (slate.current) slate.current.textContent = slateFor(url.pathname);

      gsap.set(el, { visibility: "visible" });
      gsap.set(slate.current, { autoAlpha: 0, y: 12 });
      const tl = gsap.timeline({
        onComplete: () => {
          covered.current = true;
          router.push(href, { scroll: false });
          // If the route never changes (error, offline), don't leave the screen covered.
          failsafe.current = setTimeout(() => {
            covered.current = false;
            reveal();
          }, 5000);
        },
      });
      tl.fromTo(
        el.querySelectorAll("[data-layer='rec']"),
        { scaleY: 0, transformOrigin: "50% 100%" },
        { scaleY: 1, duration: 0.6, ease: "expo.inOut", stagger: 0.035 },
      )
        .fromTo(
          el.querySelectorAll("[data-layer='ink']"),
          { scaleY: 0, transformOrigin: "50% 100%" },
          { scaleY: 1, duration: 0.6, ease: "expo.inOut", stagger: 0.035 },
          "<0.1",
        )
        .to(slate.current, { autoAlpha: 1, y: 0, duration: 0.45, ease: "expo.out" }, "-=0.2");
    },
    [router, reveal],
  );

  // The new route has committed: jump to the top (or the requested section) and lift the shutter.
  useEffect(() => {
    if (!covered.current) return;
    covered.current = false;
    scrollToTarget(0, true);
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (pendingHash.current) {
        scrollToTarget(pendingHash.current, true);
        pendingHash.current = null;
      }
      reveal();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, reveal]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={overlay}
        aria-hidden
        className="pointer-events-none invisible fixed inset-0 z-transition"
      >
        <div className="absolute inset-0 flex">
          {Array.from({ length: BARS }, (_, i) => (
            <div key={`r${i}`} data-layer="rec" className="h-full flex-1 origin-bottom scale-y-0 bg-rec" />
          ))}
        </div>
        <div className="absolute inset-0 flex">
          {Array.from({ length: BARS }, (_, i) => (
            <div key={`i${i}`} data-layer="ink" className="-mx-px h-full flex-1 origin-bottom scale-y-0 bg-canvas" />
          ))}
        </div>
        <p
          ref={slate}
          className="type-display invisible absolute inset-x-0 top-1/2 -translate-y-1/2 px-5 text-center text-[clamp(2.5rem,8vw,7rem)] text-fg"
        />
      </div>
    </TransitionContext.Provider>
  );
}
