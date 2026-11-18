export const site = {
  name: "RERA WEB",
  tagline: "Ideas deserve well-built software.",
  founder: "Gaurav",
  coFounder: "Abhijeet",
  founders: [
    { name: "Gaurav", role: "Founder" },
    { name: "Abhijeet", role: "Co-founder" },
  ],
  foundersLabel: "Gaurav & Abhijeet",
  foundersRole: "Founders, RERA WEB",
  description:
    "RERA WEB is an independent technology startup founded by Gaurav & Abhijeet in India. We engineer high-performance web development (Next.js & React), custom software architectures, AI & workflow automation, Web3 & blockchain solutions, UI/UX product design, and scalable backend cloud infrastructure. Our objective is to bridge imagination and execution—building dependable, intelligent digital products that scale.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://reraweb.vercel.app",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
  phone: null as string | null,
  locationLabel: "India" as string | null,
  founderPortrait: null as string | null,
  availabilityLabel: null as string | null,
  socials: {
    LinkedIn: null as string | null,
    GitHub: null as string | null,
    X: null as string | null,
    Instagram: null as string | null,
  },
  budgetBands: ["Under ₹1 lakh", "₹1–3 lakh", "₹3–5 lakh", "₹5 lakh and above", "Let’s discuss", "Prefer not to say"],
  logomark: true,
};

export const navigation = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const buildChapters = [
  { id: "beginning", number: "01", label: "Beginning" },
  { id: "vision", number: "02", label: "Vision" },
  { id: "services", number: "03", label: "Technology" },
  { id: "process", number: "04", label: "Process" },
  { id: "about", number: "05", label: "People" },
  { id: "contact", number: "06", label: "Next" },
];
