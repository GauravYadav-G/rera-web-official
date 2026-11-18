import { services } from "./services";
import { site } from "./site";

export const guide = {
  name: "Patch",
  identifier: "RW / 01",
  version: "v0.2",
  portrait: "/images/patch/patch.webp",
  contact: "/contact#brief",
};

export type GuideGroup = "Suggested" | "This page" | "Pages" | "Capabilities";
export type GuideDestination = {
  label: string;
  note: string;
  href: string;
  group: GuideGroup;
  meta?: string;
  keywords?: string;
};

const foundersKeywords = site.foundersLabel.toLowerCase();

export const guidePages: GuideDestination[] = [
  { label: "Home", note: "The whole story, from an empty file to launch", href: "/", group: "Pages", meta: "/", keywords: "chapters beginning vision hero" },
  { label: "Services", note: "All six capabilities in one index", href: "/services", group: "Pages", meta: "/services", keywords: "capabilities what we build disciplines" },
  { label: "Work", note: "Interface studies and the Build Shorts films", href: "/work", group: "Pages", meta: "/work", keywords: "projects films shorts video case study workspace" },
  { label: "Process", note: "Five stages, from question to launch", href: "/process", group: "Pages", meta: "/process", keywords: "how we build stages discover define design engineer evolve timeline" },
  { label: "About", note: `The founders — ${site.foundersLabel}`, href: "/about", group: "Pages", meta: "/about", keywords: `founders team people india gaurav abhijeet ${foundersKeywords}` },
  { label: "Site guide", note: "Patch, the 3D turntable and the full index", href: "/guide", group: "Pages", meta: "/guide", keywords: "patch robot guide navigation help map 3d character" },
  { label: "Contact", note: "Send the project brief to the founders", href: guide.contact, group: "Pages", meta: "/contact", keywords: "brief enquiry email budget hire start project talk" },
  { label: "Terms & conditions", note: "Website use, illustrative work and engagements", href: "/terms-and-conditions", group: "Pages", meta: "/terms", keywords: "legal terms conditions rules acceptable use" },
  { label: "Privacy policy", note: "How enquiry and technical details are handled", href: "/privacy-policy", group: "Pages", meta: "/privacy", keywords: "legal privacy data cookies gdpr personal information" },
];

export const guideCapabilities: GuideDestination[] = services.map((service) => ({
  label: service.name,
  note: service.tagline,
  href: `/services/${service.slug}`,
  group: "Capabilities",
  meta: service.number,
  keywords: `${service.formName} ${service.discipline} ${service.technology} ${service.capabilities.join(" ")}`.toLowerCase(),
}));

const homeChapters: GuideDestination[] = [
  { label: "Meet Patch", href: "#meet-patch", note: "The guide unit and its 3D turntable", group: "This page", meta: "00" },
  { label: "The beginning", href: "#beginning", note: "Chapter 01 — the question before the code", group: "This page", meta: "01" },
  { label: "Our vision", href: "#vision", note: "Chapter 02 — the exploded build stack", group: "This page", meta: "02" },
  { label: "Our technology", href: "#services", note: "Chapter 03 — the six capabilities", group: "This page", meta: "03" },
  { label: "Selected builds", href: "#work", note: "The illustrative workspace study", group: "This page", meta: "—" },
  { label: "Build shorts", href: "#build-shorts", note: "Three silent films about making software", group: "This page", meta: "—" },
  { label: "The process", href: "#process", note: "Chapter 04 — brief to something real", group: "This page", meta: "04" },
  { label: "The human side", href: "#about", note: `Chapter 05 — ${site.foundersLabel}`, group: "This page", meta: "05" },
  { label: "What comes next", href: "#contact", note: "Chapter 06 — the project brief", group: "This page", meta: "06" },
];

const pageAnchors: Record<string, GuideDestination[]> = {
  "/": homeChapters,
  "/services": [{ label: "Capability index", href: "#capability-index", note: "Six disciplines, each with its own page", group: "This page", meta: "01–06" }],
  "/work": [
    { label: "The study", href: "#work-index", note: "Jump to the workspace interface study", group: "This page", meta: "001" },
    { label: "Build shorts", href: "#build-shorts", note: "Three silent films about making software", group: "This page", meta: "—" },
  ],
  "/work/workspace-study": [{ label: "The study in motion", href: "#build-shorts", note: "Watch the wireframe become an interface", group: "This page", meta: "01" }],
  "/process": [{ label: "Follow the build", href: "#our-process", note: "All five stages and what each one leaves behind", group: "This page", meta: "01–05" }],
  "/guide": [
    { label: "Patch exhibit", href: "#patch-exhibit", note: "Rotate the 3D render of the guide unit", group: "This page", meta: "07" },
    { label: "Site index", href: "#guide-index", note: "Every page and capability in one list", group: "This page", meta: "—" },
  ],
  "/contact": [{ label: "Project brief", href: "#brief", note: "The form itself — name, email and idea", group: "This page", meta: "001" }],
};

/** In-page jumps are only offered where those anchors actually exist. */
export function getGuideAnchors(pathname: string): GuideDestination[] {
  return pageAnchors[pathname] ?? [];
}

export const guideIndex: GuideDestination[] = [...guidePages, ...guideCapabilities];

const capabilities: GuideDestination = { label: "Explore capabilities", href: "/services", note: "See the six things we build", group: "Suggested" };
const work: GuideDestination = { label: "See a build in action", href: "/work/workspace-study", note: "Open the illustrative workspace study", group: "Suggested" };
const clips: GuideDestination = { label: "Watch the build shorts", href: "/work#build-shorts", note: "Three silent films, on demand", group: "Suggested" };
const process: GuideDestination = { label: "Follow the build process", href: "/process", note: "From the first question to launch", group: "Suggested" };
const contact: GuideDestination = { label: "Start a project brief", href: guide.contact, note: `Tell ${site.foundersLabel} what you have in mind`, group: "Suggested" };
const about: GuideDestination = { label: "Meet the founders", href: "/about", note: `${site.foundersLabel}, and why we build`, group: "Suggested" };
const patch: GuideDestination = { label: "Rotate Patch in 3D", href: "/guide#patch-exhibit", note: "Inspect the guide unit from sixteen angles", group: "Suggested" };

export function getGuideContext(pathname: string): { location: string; prompt: string; links: GuideDestination[] } {
  if (pathname === "/guide") {
    return { location: "Site guide", prompt: "You’re at the full index. Rotate the guide unit, or jump straight to a page.", links: [patch, capabilities, work, contact] };
  }
  if (pathname.startsWith("/services")) {
    return { location: "Capabilities", prompt: "Choosing what to build? See how an idea takes shape, or share the problem you’re working on.", links: pathname === "/services" ? [work, clips, process, contact] : [capabilities, process, contact] };
  }
  if (pathname.startsWith("/work")) {
    return { location: "Work", prompt: "Looking for the thinking behind the build? Follow a study, or watch it take shape on film.", links: pathname === "/work" ? [work, clips, process, contact] : [clips, capabilities, contact] };
  }
  if (pathname === "/about") {
    return { location: "About", prompt: `RERA WEB is led by ${site.foundersLabel}. See how we work, then take the next step.`, links: [process, work, contact] };
  }
  if (pathname === "/process") {
    return { location: "Process", prompt: "Five stages, one continuous conversation. Ready to start at stage one?", links: [capabilities, about, contact] };
  }
  if (pathname === "/contact") {
    return { location: "Contact", prompt: "A few sentences are enough to begin. The project brief is the best place to share them.", links: [contact, capabilities, about] };
  }
  if (pathname === "/terms-and-conditions" || pathname === "/privacy-policy") {
    return { location: "Site information", prompt: "Find the policy you need, or ask us a question about it.", links: [pathname === "/privacy-policy" ? { label: "Website terms", href: "/terms-and-conditions", note: "Terms & conditions", group: "Suggested" } : { label: "Privacy policy", href: "/privacy-policy", note: "How enquiry information is handled", group: "Suggested" }, contact, capabilities] };
  }
  return { location: "Home", prompt: "I can point you to the right page. Search, or pick a chapter below.", links: [capabilities, work, clips, process, about, contact] };
}

/** Case-insensitive search across labels, notes, paths and keywords. */
export function searchGuide(query: string, pathname: string): GuideDestination[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  const anchors = getGuideAnchors(pathname);
  const pool: GuideDestination[] = [...getGuideContext(pathname).links, ...anchors, ...guideIndex];
  const seen = new Set<string>();
  const matches: GuideDestination[] = [];
  for (const item of pool) {
    if (seen.has(item.href)) continue;
    const haystack = `${item.label} ${item.note} ${item.meta ?? ""} ${item.keywords ?? ""} ${item.href}`.toLowerCase();
    if (terms.every((term) => haystack.includes(term))) {
      seen.add(item.href);
      matches.push(item);
    }
  }
  return matches.slice(0, 9);
}
