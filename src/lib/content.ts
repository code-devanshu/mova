/**
 * All site copy, as supplied by the client (MOVA website content doc).
 * Kept in one place so the client can review and edit wording without touching components.
 */

export const site = {
  name: "MOVA",
  tagline: "Own the frame.",
  identity: { from: "what if?", to: "who made this?" },
  description:
    "Creative production, content & social from Delhi NCR and Chandigarh. Built to make people stop, look and remember.",
  disciplines: ["Creative Production", "Content", "Editing", "Social"],
  locations: ["Delhi NCR", "Chandigarh"],
  // Placeholder handle from the brief. Swap for the real one when it's final.
  handle: "@MOVA________",
  // Add the studio's WhatsApp number (country code, no +) to enable direct chats.
  whatsappNumber: "",
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "YouTube", href: "https://youtube.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
} as const;

export function whatsappHref(message = "Hi MOVA, I have an idea I'd love to talk about.") {
  const text = encodeURIComponent(message);
  return site.whatsappNumber
    ? `https://wa.me/${site.whatsappNumber}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

// Demo build: only Home is live; flip `disabled` off as the other pages are signed off.
export const nav: { label: string; href: string; disabled?: boolean }[] = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work", disabled: true },
  { label: "Services", href: "/#services", disabled: true },
  { label: "About", href: "/#about", disabled: true },
];

export const footerNav = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/contact" },
] as const;

export const hero = {
  headline: ["Own the", "frame."],
  sub: "Creative production, content & social. Built to make people stop, look and remember.",
  primary: { label: "View our work", href: "#work" },
  secondary: { label: "Start a project", href: "/contact" },
  location: "Delhi NCR · Chandigarh · Anywhere the idea takes us",
};

export const intro = {
  headline: ["We make ideas", "move."],
  lead: "You bring the idea. We bring the vision, the people and the frame.",
  body: "From the first concept to the final upload, MOVA brings production, content, editing and social under one roof.",
  // "Think it. Shoot it. Move it."
  mantra: ["Think", "Shoot", "Move"],
};

export const services = {
  headline: "More than a shoot.",
  sub: "We create the whole visual world around your idea.",
  items: [
    {
      id: "production",
      title: "Production",
      line: "Lights. Camera. Let’s make it real.",
      offer: ["Photography", "Videography", "Studio & outdoor shoots", "Creative direction", "Drone"],
      image: "/media/studio-softbox.jpg",
      alt: "Photo studio lit with softboxes and a white backdrop",
    },
    {
      id: "content",
      title: "Content",
      line: "Made to be watched. Built to be remembered.",
      offer: ["Reels", "Creator content", "Brand content", "Music", "Podcasts", "Campaigns"],
      image: "/media/social-phone-tripod.jpg",
      alt: "Phone on a tripod recording a night street full of bokeh lights",
    },
    {
      id: "post",
      title: "Post",
      line: "The story doesn’t end when the camera stops.",
      offer: ["Editing", "Colour", "Sound", "Motion"],
      detail: "Everything that turns footage into a finished frame.",
      image: "/media/edit-timeline.jpg",
      alt: "Video editing timeline on a monitor",
    },
    {
      id: "social",
      title: "Social",
      line: "Don’t just post. Make people pause.",
      offer: ["Content planning", "Creative strategy", "Reels", "Social media management"],
      image: "/media/social-grid-phone.jpg",
      alt: "Hand holding a phone with a social feed in front of tall buildings",
    },
  ],
};

export const world = {
  headline: "What are we creating?",
  items: [
    {
      id: "creators",
      title: "Creators",
      line: "Your personality. Our frame.",
      ratio: [9, 16],
      format: "9:16 Reel",
      image: "/media/creator-hoodie.jpg",
      alt: "Creator in a blue hoodie laughing against a blue wall",
    },
    {
      id: "brands",
      title: "Brands",
      line: "Make them look twice.",
      ratio: [16, 9],
      format: "16:9 Film",
      image: "/media/brand-mirror.jpg",
      alt: "Man in sunglasses seated in front of a large round mirror",
    },
    {
      id: "artists",
      title: "Artists",
      line: "Give the sound a visual identity.",
      ratio: [1, 1],
      format: "1:1 Cover art",
      image: "/media/artist-red-jacket.jpg",
      alt: "Singer in a red jacket on stage under blue light beams",
    },
    {
      id: "products",
      title: "Products",
      line: "Make the product the moment.",
      ratio: [4, 5],
      format: "4:5 Post",
      image: "/media/product-headphones.jpg",
      alt: "Black headphones on a bright yellow background",
    },
    {
      id: "events",
      title: "Events",
      line: "Capture it before it becomes a memory.",
      ratio: [2.39, 1],
      format: "2.39:1 Widescreen",
      image: "/media/events-holi.jpg",
      alt: "Crowd at a Holi festival throwing coloured powder",
    },
    {
      id: "businesses",
      title: "Businesses",
      line: "Look as good online as you do offline.",
      ratio: [3, 2],
      format: "3:2 Photo",
      image: "/media/corporate-glass.jpg",
      alt: "Black and white office with people silhouetted against glass walls",
    },
  ],
};

export const workSection = {
  headline: "The work",
  sub: ["No long explanations.", "Just the frames."],
  cta: { label: "See all work", href: "/work" },
};

export const caseStudy = {
  ideaHeading: "The idea",
  idea: ["Every project starts somewhere.", "A thought.", "A mood.", "A “what if?”"],
  ideaClose: "We turn that starting point into something you can see, feel and share.",
  broughtHeading: "What we brought to the frame",
  capabilities: [
    "Creative Direction",
    "Production",
    "Photography",
    "Videography",
    "Editing",
    "Social Content",
  ],
} as const;

export const process = {
  headline: "From idea to impact.",
  steps: [
    { word: "Think", line: "What are we trying to say?", image: "/media/ideas-wall.jpg", alt: "Team planning with sticky notes on a glass wall" },
    { word: "Build", line: "We shape the idea, mood and direction.", image: "/media/bts-crew-dark.jpg", alt: "Two crew members setting up a camera in a dark room" },
    { word: "Shoot", line: "Lights on. Cameras rolling.", image: "/media/clapper.jpg", alt: "Clapperboard held up against the sky before a take" },
    { word: "Edit", line: "Cut. Colour. Sound. Detail.", image: "/media/mixing-console.jpg", alt: "Sound mixing console with coloured faders in a dark studio" },
    { word: "Release", line: "Now let the work speak.", image: "/media/events-phone-concert.jpg", alt: "Fan filming a concert on a phone" },
    { word: "Move", line: "Create again. Create better.", image: "/media/night-road.jpg", alt: "Long-exposure road at dusk with motion blur" },
  ],
};

export const socialMedia = {
  headline: "Your content shouldn’t live in a camera roll.",
  lead: "A great shoot is only the beginning.",
  body: "We turn your visuals into content that keeps your brand moving, from strategy to creation to posting.",
  pillars: [
    { title: "Content strategy", line: "Know what to say." },
    { title: "Content creation", line: "Know how to show it." },
    { title: "Social management", line: "Know when to post it." },
  ],
  cta: { label: "Make your social move", href: "/contact?type=social-media" },
};

export const why = {
  headline: "Why MOVA?",
  items: [
    { title: "One creative team.", line: "Less coordination. More creation." },
    { title: "One visual language.", line: "Everything feels like you." },
    { title: "Built for the feed.", line: "Because beautiful content means nothing if nobody stops for it." },
    { title: "From idea to upload.", line: "We stay with you beyond the shoot." },
  ],
};

export const about = {
  headline: "We’re MOVA.",
  body: "A creative production and content studio for brands, creators, artists and businesses that want their visuals to feel like them, only sharper.",
  verbs: ["shoot.", "create.", "edit.", "build content.", "keep brands moving."],
  manifesto: [
    { lead: "No", struck: "cookie-cutter", tail: "creative." },
    { lead: "No", struck: "boring", tail: "frames." },
  ],
  close: "Just ideas worth making.",
};

export const locations = {
  headline: ["Made in NCR.", "Creating beyond it."],
  regions: [
    { name: "Delhi NCR", cities: ["Delhi", "Gurgaon", "Noida", "Faridabad", "Ghaziabad"] },
    { name: "Chandigarh", cities: ["Chandigarh", "Mohali", "Panchkula"] },
  ],
  elsewhere: { title: "Somewhere else?", cta: "Tell us where", href: "/contact#location" },
  markers: [
    { id: "delhi", label: "Delhi NCR", location: [28.6139, 77.209] as [number, number] },
    { id: "chandigarh", label: "Chandigarh", location: [30.7333, 76.7794] as [number, number] },
  ],
};

export const social = {
  headline: "See what’s moving.",
  lines: ["Behind the scenes.", "Fresh frames.", "New projects.", "A little chaos."],
  cta: "Follow along",
  tiles: [
    { src: "/media/bts-tripod-warm.jpg", alt: "Camera on a tripod in warm low light" },
    { src: "/media/street-photographer.jpg", alt: "Photographer shooting on a busy street" },
    { src: "/media/bts-mic-bw.jpg", alt: "Singer recording behind a pop filter, black and white" },
    { src: "/media/projector.jpg", alt: "Film projector throwing a beam of light" },
    { src: "/media/drone-pilot.jpg", alt: "Drone pilot launching a drone over a wheat field" },
    { src: "/media/music-turntable.jpg", alt: "Close-up of a record spinning on a turntable" },
    { src: "/media/creator-forest.jpg", alt: "Photographer holding a camera out in an autumn forest" },
  ],
};

export const finalCta = {
  headline: ["Got a crazy idea?", "Good. We like those."],
  body: ["Tell us what you’re thinking.", "We’ll figure out how to make it look."],
  primary: { label: "Start a project", href: "/contact" },
  secondary: "Let’s talk on WhatsApp",
};

export const contact = {
  headline: "Let’s make something worth posting.",
  promise: "We read every brief. Promise.",
  types: [
    { value: "creator", label: "Creator" },
    { value: "brand", label: "Brand" },
    { value: "music", label: "Music" },
    { value: "product", label: "Product" },
    { value: "event", label: "Event" },
    { value: "corporate", label: "Corporate" },
    { value: "editing", label: "Editing" },
    { value: "social-media", label: "Social Media" },
    { value: "something-else", label: "Something Else" },
  ],
  submit: "Send it",
};
