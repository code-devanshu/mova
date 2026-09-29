import { InstagramLogo, LinkedinLogo, WhatsappLogo, YoutubeLogo } from "@phosphor-icons/react/ssr";
import { footerNav, site, whatsappHref } from "@/lib/content";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { FooterWordmark } from "./FooterWordmark";
import { BackToTop } from "./BackToTop";

const socialIcons = { Instagram: InstagramLogo, YouTube: YoutubeLogo, LinkedIn: LinkedinLogo } as const;

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-canvas pt-20 md:pt-28">
      <div className="mx-auto max-w-[1680px] px-5 md:px-10">
        <p className="type-display max-w-[16ch] text-[clamp(2.6rem,6.5vw,6.5rem)] text-fg">
          From “{site.identity.from}” to{" "}
          <span className="text-rec">“{site.identity.to}”</span>
        </p>

        <div className="mt-16 grid grid-cols-2 gap-10 md:mt-24 md:grid-cols-12 md:gap-6">
          <div className="col-span-2 md:col-span-4">
            <p className="type-display text-3xl wdth-100">{site.tagline}</p>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-mute">
              {site.disciplines.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="md:col-span-2 md:col-start-6">
            <ul className="flex flex-col gap-2">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <TransitionLink
                    href={item.href}
                    className="text-sm font-semibold uppercase tracking-[0.08em] text-fg/80 transition-colors hover:text-rec-fg"
                  >
                    {item.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex flex-col gap-2 md:col-span-2">
            {site.socials.map((s) => {
              const Icon = socialIcons[s.label];
              return (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-fg/80 transition-colors hover:text-rec-fg"
                  >
                    <Icon size={16} weight="bold" /> {s.label}
                  </a>
                </li>
              );
            })}
            <li>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-fg/80 transition-colors hover:text-rec-fg"
              >
                <WhatsappLogo size={16} weight="bold" /> WhatsApp
              </a>
            </li>
          </ul>

          <div className="col-span-2 md:col-span-2">
            <ul className="flex flex-col gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-fg/80">
              {site.locations.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <FooterWordmark />

      <div className="mx-auto flex max-w-[1680px] flex-col gap-2 border-t border-line px-5 py-6 text-xs text-mute md:flex-row md:items-center md:justify-between md:px-10">
        <p>© 2026 MOVA. All rights reserved.</p>
        <BackToTop />
      </div>
    </footer>
  );
}
