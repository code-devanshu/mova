"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { InstagramLogo, LinkedinLogo, X, YoutubeLogo } from "@phosphor-icons/react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { lockScroll } from "@/lib/scroll";
import { nav, site } from "@/lib/content";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const socialIcons = { Instagram: InstagramLogo, YouTube: YoutubeLogo, LinkedIn: LinkedinLogo } as const;

export function Nav() {
  const pathname = usePathname();
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  // Hide on the way down, return on the way up; solid backdrop once the page has moved.
  useGSAP(
    () => {
      const el = bar.current;
      if (!el) return;
      let hidden = false;
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate(self) {
          const y = self.scroll();
          el.dataset.scrolled = String(y > 40);
          const shouldHide = y > 200 && self.direction === 1;
          if (shouldHide !== hidden) {
            hidden = shouldHide;
            gsap.to(el, { yPercent: hidden ? -100 : 0, duration: 0.6, ease: "expo.out", overwrite: true });
          }
        },
      });
      return () => st.kill();
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  // Menu open/close choreography.
  useGSAP(
    () => {
      const el = menu.current;
      if (!el) return;
      const links = el.querySelectorAll("[data-menu-item]");
      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: open ? 1 : 0, clipPath: "inset(0% 0% 0% 0%)" });
        return;
      }
      if (open) {
        gsap
          .timeline()
          .set(el, { autoAlpha: 1 })
          .fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.inOut" })
          .fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06 }, "-=0.35");
      } else {
        gsap.to(el, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.6,
          ease: "expo.inOut",
          onComplete: () => {
            gsap.set(el, { autoAlpha: 0 });
          },
        });
      }
    },
    { dependencies: [open] },
  );

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header
        ref={bar}
        data-scrolled="false"
        className="fixed inset-x-0 top-0 z-nav transition-[background-color,backdrop-filter] duration-500 data-[scrolled=true]:bg-canvas/80 data-[scrolled=true]:backdrop-blur-md"
      >
        <div className="mx-auto flex h-16 max-w-[1680px] items-center justify-between px-5 md:h-[72px] md:px-10">
          <TransitionLink href="/" aria-label="MOVA, home" className="text-[1.6rem] md:text-[1.8rem]" onClick={close}>
            <Logo />
          </TransitionLink>

          <div className="flex items-center gap-3">
            <nav aria-label="Primary" className="mr-5 hidden items-center gap-9 md:flex">
              {nav.map((item) => {
                if (item.disabled) {
                  return (
                    <span
                      key={item.href}
                      aria-disabled="true"
                      className="cursor-not-allowed select-none py-2 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-fg/35"
                    >
                      {item.label}
                    </span>
                  );
                }
                const active = item.href === pathname;
                return (
                  <TransitionLink
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="group relative py-2 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-fg/80 transition-colors hover:text-fg aria-[current=page]:text-fg"
                  >
                    {item.label}
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-rec transition-transform duration-500 ease-(--ease-expo) group-hover:scale-x-100 group-aria-[current=page]:scale-x-100" />
                  </TransitionLink>
                );
              })}
            </nav>

            {/* Sound and theme toggles show at every size: before the CTA on desktop, before Menu on mobile. */}
            <SoundToggle />
            <ThemeToggle />

            <div className="hidden md:block">
              <Button href="/contact" size="sm">
                Start a project
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="type-label flex h-10 items-center gap-2 border border-line-strong px-4 text-fg md:hidden"
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menu}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="invisible fixed inset-0 z-menu flex flex-col bg-canvas px-5 pb-8 pt-5 md:hidden"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <div className="flex h-10 items-center justify-between">
          <Logo className="text-[1.6rem]" />
          <button type="button" onClick={close} className="flex size-10 items-center justify-center border border-line-strong">
            <X size={18} weight="bold" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>
        <nav aria-label="Mobile" className="mt-auto flex flex-col gap-1">
          {[...nav, { label: "Contact", href: "/contact", disabled: true }].map((item) => (
            <span key={item.href} className="overflow-hidden">
              {item.disabled ? (
                <span
                  data-menu-item
                  aria-disabled="true"
                  className="type-display block cursor-not-allowed select-none text-[clamp(3.5rem,17vw,6rem)] text-fg/25"
                >
                  {item.label}
                </span>
              ) : (
                <TransitionLink
                  href={item.href}
                  data-menu-item
                  onClick={close}
                  aria-current={item.href === pathname ? "page" : undefined}
                  className="type-display block text-[clamp(3.5rem,17vw,6rem)] text-fg"
                >
                  {item.label}
                </TransitionLink>
              )}
            </span>
          ))}
        </nav>
        <div className="mt-10 flex items-center justify-between border-t border-line pt-5">
          <div className="flex gap-4">
            {site.socials.map((s) => {
              const Icon = socialIcons[s.label];
              return (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="text-fg/80 hover:text-fg">
                  <Icon size={22} />
                </a>
              );
            })}
          </div>
          <span className="type-label text-mute">{site.locations.join(" · ")}</span>
        </div>
      </div>
    </>
  );
}
