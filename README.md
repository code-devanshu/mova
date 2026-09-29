# MOVA: website demo

Creative production studio site for MOVA (Delhi NCR · Chandigarh). Next.js 16 (App Router, Turbopack), Tailwind v4, GSAP + ScrollTrigger + Lenis for motion, React Three Fiber for the 3D hero, cobe for the globe.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (also type-checks)
npm run lint
```

## Design system

One idea runs through everything: **the frame**. The site behaves like a camera: a viewfinder with a REC light and running timecode, frames that snap focus on hover, cuts between pages like a shutter.

Two themes: **Darkroom** (dark) and **Light table** (light: the same two neutrals, flipped). First-time visitors get their device's setting; the toggle in the nav switches theme (the new one opens out from the toggle like a frame) and remembers the choice. To open every visitor on one theme, set `DEFAULT_THEME` in `src/lib/theme.ts` to `"dark"` or `"light"`.

| Token | Dark | Light | Use |
|---|---|---|---|
| `canvas` | `#0b0b0c` | `#eeece7` | Page background |
| `surface` | `#131315` | `#f7f6f2` | Cards, image placeholders |
| `fg` | `#eeece7` | `#0b0b0c` | Text |
| `mute` | `#8e8b85` | `#66635d` | Secondary text |
| `rec-fg` | `#e8452c` | `#bf3720` | Small red text (labels, errors), deepened on light to stay readable |
| `rec` | `#e8452c` | same | The only accent: REC light, key verbs, the final CTA |
| `ink` / `paper` | `#0b0b0c` / `#eeece7` | same | Fixed: text and marks on photos and on the red |

- Use the theme tokens (`bg-canvas`, `text-fg`, `text-mute`…) for anything that sits on the page; use `ink`/`paper` only where the colour must not change with the theme. All text passes WCAG AA in both themes.
- The "Selected work" film strip and the case study's "Next project" band stay dark in both themes: film on a light table.
- The 3D drum and the globe follow the theme too (`src/lib/theme.ts`).
- **Type:** Archivo (variable, with a width axis so headlines can stretch; see "MOVE." in the intro and the footer wordmark) + IBM Plex Mono for timecodes and labels.
- **Shape:** all-sharp. No border radius anywhere except the REC light.
- Tokens live in `src/app/globals.css` (`@theme` for dark, `[data-theme="light"]` for light). Change the accent there and it updates everywhere.

## Pages

| Route | Content (client doc section) |
|---|---|
| `/` | Hero (01), Intro (02), What we do (03), Our world (04), Selected work (05), Process (07), Social media (08), Why MOVA (09), About (10), Location (11), Social (12), Final CTA (13) |
| `/work` | Full archive with category filters (05) |
| `/work/[slug]` | Case study template: The idea, What we brought to the frame (06) |
| `/contact` | Project brief form (14), preselects a type via `?type=social-media` |
| Footer | (15), on every page |

## Where to edit

- **All copy:** `src/lib/content.ts` (kept verbatim from the client doc; em dashes swapped for periods/commas).
- **Projects:** `src/lib/projects.ts`. Each project gets a case-study page automatically.
- **Images:** `public/media/` (3D hero textures are smaller copies in `public/media/tex/`, listed in `src/components/home/HeroScene.tsx`).

## Placeholders to replace before launch

- [ ] Photos and project names are licensed stock stand-ins (sources in `public/media-credits.json`). Swap in MOVA's real work.
- [ ] Logo: `src/components/ui/Logo.tsx` is a typographic placeholder.
- [ ] Instagram handle (`@MOVA________`) and social URLs in `src/lib/content.ts`.
- [ ] WhatsApp number: set `site.whatsappNumber` (e.g. `"91XXXXXXXXXX"`). Until then the button opens WhatsApp with a prefilled message and no recipient.
- [ ] Brief form: `src/app/contact/actions.ts` validates but doesn't deliver anywhere yet. Connect Resend, a CRM or a sheet there.
- [ ] Set `NEXT_PUBLIC_SITE_URL` in production so social previews resolve correctly.

## Motion notes

- Everything honours `prefers-reduced-motion`: no smooth scroll, no pinning, static 3D, plain lists, instant theme switch.
- The theme is set by an inline script before first paint, so there's no flash of the wrong theme. The switch animation uses the View Transitions API and is instant in browsers without it.
- The intro preloader plays once per browser session and waits (max 2.5s) for the 3D frames to load.
- Heavy pieces load lazily: three.js only for the hero, cobe only when the globe scrolls near.
# mova
