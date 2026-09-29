import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { PageTransition } from "@/components/providers/PageTransition";
import { Preloader } from "@/components/layout/Preloader";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { INTRO_KEY } from "@/lib/intro";
import { DEFAULT_THEME, THEME_KEY } from "@/lib/theme";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "MOVA | Creative Production, Content & Social",
    template: "%s | MOVA",
  },
  description:
    "From “what if?” to “who made this?” Creative production, content, editing and social from Delhi NCR and Chandigarh.",
  openGraph: {
    title: "MOVA | Own the frame.",
    description: "Creative production, content & social. Built to make people stop, look and remember.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eeece7" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0c" },
  ],
  colorScheme: "dark light",
};

const themeFallback =
  DEFAULT_THEME === "system" ? "window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'" : `'${DEFAULT_THEME}'`;

// Runs before first paint: picks the theme (saved choice, else DEFAULT_THEME), enables motion styles,
// skips the intro if it already played this session, and reveals everything after 6s if the app's scripts
// never start (data-js-ready is set by the preloader).
const bootScript = `(function(){var d=document.documentElement;var t=null;try{t=localStorage.getItem('${THEME_KEY}')}catch(e){}if(t!=='light'&&t!=='dark'){t=${themeFallback}}d.setAttribute('data-theme',t);d.style.colorScheme=t;try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('js-motion')}if(sessionStorage.getItem('${INTRO_KEY}')==='1'){d.setAttribute('data-intro','done')}setTimeout(function(){if(!d.hasAttribute('data-js-ready'))d.classList.add('motion-failsafe')},6000)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-dvh bg-canvas text-fg antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-transition focus:bg-fg focus:px-4 focus:py-3 focus:text-canvas"
        >
          Skip to content
        </a>
        <PageTransition>
          <SmoothScroll />
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </PageTransition>
        <Preloader />
        <div aria-hidden className="grain z-grain" />
      </body>
    </html>
  );
}
