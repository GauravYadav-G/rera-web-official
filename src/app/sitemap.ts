import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.url) return [];
  const base = site.url.replace(/\/$/, "");
  const pages = ["", "/services", "/work", "/process", "/about", "/contact", "/guide", "/terms-and-conditions", "/privacy-policy"];
  return [...pages.map((path) => ({ url: `${base}${path}`, changeFrequency: "monthly" as const, priority: path === "" ? 1 : 0.7 })), ...services.map((service) => ({ url: `${base}/services/${service.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })), ...projects.map((project) => ({ url: `${base}/work/${project.slug}`, changeFrequency: "monthly" as const, priority: 0.6 }))];
}
