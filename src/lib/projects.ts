/**
 * Demo portfolio. Every project here is a placeholder built from licensed stock
 * (see public/media-credits.json) so the layouts can be reviewed. Replace titles,
 * summaries and images with MOVA's real work before launch.
 */

export const categories = ["Creator", "Brand", "Music", "Product", "Events", "Corporate", "Drone"] as const;
export type Category = (typeof categories)[number];

export type Capability =
  | "Creative Direction"
  | "Production"
  | "Photography"
  | "Videography"
  | "Editing"
  | "Social Content";

export type Media = { src: string; alt: string; w: number; h: number };

export type Project = {
  slug: string;
  title: string;
  category: Category;
  year: number;
  summary: string;
  cover: Media;
  gallery: Media[];
  brought: Capability[];
  featured?: boolean;
};

const m = (src: string, alt: string, w: number, h: number): Media => ({ src: `/media/${src}.jpg`, alt, w, h });

export const projects: Project[] = [
  {
    slug: "off-duty",
    title: "Off-Duty",
    category: "Creator",
    year: 2026,
    summary: "Personality-first portraits and reels for a lifestyle creator.",
    cover: m("creator-hoodie", "Creator in a blue hoodie laughing against a blue wall", 1800, 2700),
    gallery: [
      m("social-phone-sky", "Phone held up against a clear blue sky", 960, 642),
      m("social-phone-tripod", "Phone on a tripod filming a night street", 960, 642),
      m("creator-red-top", "Creator in a red top and sunglasses against a teal wall", 1800, 2700),
    ],
    brought: ["Creative Direction", "Photography", "Social Content"],
    featured: true,
  },
  {
    slug: "smoke-signals",
    title: "Smoke Signals",
    category: "Music",
    year: 2026,
    summary: "A music video and cover art for a debut single.",
    cover: m("artist-smoke", "Singer raising a hand through stage smoke and red light", 960, 640),
    gallery: [
      m("music-studio", "Recording studio with guitars on the wall under red light", 1800, 1200),
      m("artist-portrait-blue", "Portrait of an artist lit in cool blue", 1800, 2251),
      m("bts-mic-bw", "Singer recording behind a pop filter, black and white", 960, 640),
    ],
    brought: ["Creative Direction", "Production", "Videography", "Editing"],
    featured: true,
  },
  {
    slug: "the-yellow-edit",
    title: "The Yellow Edit",
    category: "Brand",
    year: 2026,
    summary: "A colour-blocked streetwear lookbook built for the feed.",
    cover: m("brand-yellow", "Model in bright yellow trousers beside a basketball hoop", 1800, 2492),
    gallery: [
      m("brand-mirror", "Man in sunglasses seated in front of a round mirror", 1800, 2250),
      m("product-sneakers-colour", "Two colourful sneakers floating on white", 1800, 2251),
    ],
    brought: ["Creative Direction", "Production", "Photography", "Editing"],
    featured: true,
  },
  {
    slug: "holi-aftermovie",
    title: "Holi Aftermovie",
    category: "Events",
    year: 2025,
    summary: "A festival day cut into a one-minute aftermovie and a week of reels.",
    cover: m("events-holi", "Crowd at a Holi festival throwing coloured powder", 960, 473),
    gallery: [
      m("events-fire", "Fire breather performing for a night crowd", 960, 640),
      m("events-phones", "Crowd with raised hands under purple stage lights", 1800, 1200),
    ],
    brought: ["Production", "Videography", "Editing", "Social Content"],
    featured: true,
  },
  {
    slug: "street-level",
    title: "Street Level",
    category: "Brand",
    year: 2025,
    summary: "Campaign stills and short loops for a footwear drop.",
    cover: m("brand-teal", "Model in striped trousers posing against a teal wall", 1800, 2695),
    gallery: [
      m("brand-skate-yellow", "Skater mid-push in front of a yellow wall", 960, 640),
      m("product-sneaker-black", "Black running shoe on a white background", 1800, 1800),
    ],
    brought: ["Creative Direction", "Photography", "Social Content"],
    featured: true,
  },
  {
    slug: "sound-in-colour",
    title: "Sound, in Colour",
    category: "Product",
    year: 2026,
    summary: "Studio product stills and loops for a headphone launch.",
    cover: m("product-headphones", "Black headphones on a bright yellow background", 1800, 1200),
    gallery: [
      m("boombox", "Person lying beside a vintage boombox on a pale backdrop", 1800, 1198),
      m("studio-softbox", "Photo studio lit with softboxes and a white backdrop", 1800, 1012),
    ],
    brought: ["Creative Direction", "Photography", "Social Content"],
    featured: true,
  },
  {
    slug: "glass-walls",
    title: "Glass Walls",
    category: "Corporate",
    year: 2025,
    summary: "A company film and leadership portraits.",
    cover: m("corporate-glass", "Black and white office with people silhouetted against glass", 960, 640),
    gallery: [
      m("corporate-conference", "Conference hall with an audience facing the stage", 1800, 1200),
      m("corporate-suit", "Man in a suit on a stairway", 1800, 1200),
      m("ideas-wall", "Team planning with sticky notes on a glass wall", 1800, 1200),
    ],
    brought: ["Production", "Videography", "Editing"],
    featured: true,
  },
  {
    slug: "roundabout",
    title: "Roundabout",
    category: "Drone",
    year: 2026,
    summary: "Top-down aerials for a city infrastructure film.",
    cover: m("drone-roundabout", "Aerial view of a roundabout and curving roads", 960, 539),
    gallery: [
      m("drone-dirt-road", "Aerial view of a dirt road curving through green fields", 960, 539),
      m("drone-snow-forest", "Aerial view of a river cutting through a snowy forest", 960, 641),
    ],
    brought: ["Production", "Videography", "Editing"],
    featured: true,
  },
  {
    slug: "golden-hour-series",
    title: "Golden Hour Series",
    category: "Creator",
    year: 2025,
    summary: "A travel creator series shot at sunrise, cut for reels and YouTube.",
    cover: m("creator-mountain", "Photographer on a mountain ridge above the clouds at sunrise", 1800, 1200),
    gallery: [
      m("creator-forest", "Photographer holding a camera out in an autumn forest", 1800, 1200),
      m("street-photographer", "Photographer shooting on a busy street", 1800, 1218),
    ],
    brought: ["Creative Direction", "Videography", "Editing", "Social Content"],
  },
  {
    slug: "blue-hour-live",
    title: "Blue Hour Live",
    category: "Music",
    year: 2025,
    summary: "A live session filmed on three cameras in one night.",
    cover: m("artist-blue", "Rapper performing under a blue spotlight", 960, 640),
    gallery: [
      m("artist-red-jacket", "Singer in a red jacket under blue light beams", 960, 640),
      m("music-turntable", "Record spinning on a turntable", 960, 1440),
      m("events-lasers", "Concert crowd under green and blue lasers", 1800, 1350),
    ],
    brought: ["Production", "Videography", "Editing"],
  },
  {
    slug: "under-wraps",
    title: "Under Wraps",
    category: "Product",
    year: 2026,
    summary: "A launch reveal film for a new car, from covered to cruising.",
    cover: m("product-car-cover", "Car hidden under an orange cover in a studio", 960, 640),
    gallery: [
      m("night-road", "Long-exposure road at dusk with motion blur", 960, 638),
      m("bts-tripod-warm", "Camera on a tripod in warm low light", 960, 640),
    ],
    brought: ["Creative Direction", "Production", "Videography", "Editing"],
  },
  {
    slug: "confetti-night",
    title: "Confetti Night",
    category: "Events",
    year: 2026,
    summary: "Concert coverage turned around overnight for next-morning posts.",
    cover: m("events-confetti", "Confetti falling over a packed concert crowd", 1800, 1085),
    gallery: [
      m("events-confetti-night", "Confetti cannon firing over a crowd at night", 1800, 1201),
      m("events-phone-concert", "Fan filming a concert on a phone", 960, 640),
    ],
    brought: ["Photography", "Videography", "Editing", "Social Content"],
  },
  {
    slug: "last-light",
    title: "Last Light",
    category: "Drone",
    year: 2025,
    summary: "Sunset aerials for a coastal travel campaign.",
    cover: m("drone-sunset", "Drone silhouetted against an orange sunset", 960, 640),
    gallery: [
      m("drone-tide", "Aerial view of a boat on turquoise water", 960, 1200),
      m("drone-pilot", "Drone pilot launching a drone over a wheat field", 1800, 1202),
    ],
    brought: ["Production", "Videography", "Editing"],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}

export function categorySlug(c: Category) {
  return c.toLowerCase();
}

export function isPortrait(media: Media) {
  return media.h > media.w;
}
