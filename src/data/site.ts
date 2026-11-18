export const site = {
  name: "RERA WEB",
  founder: "Gaurav",
  coFounder: "Abhijeet",
  founders: [
    { name: "Gaurav", role: "Founder" },
    { name: "Abhijeet", role: "Co-founder" },
  ],
  foundersLabel: "Gaurav & Abhijeet",
  foundersRole: "Founders, RERA WEB",
  description: "An independent technology startup from India, building digital experiences and intelligent software for ideas that deserve to go further.",
  url: process.env.NEXT_PUBLIC_SITE_URL || null,
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
