import type { Metadata } from "next";
import { site } from "@/data/site";
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return { title, description, alternates: site.url ? { canonical: `${site.url.replace(/\/$/, "")}${path}` } : undefined, openGraph: { title: `${title} — RERA WEB`, description, ...(site.url ? { url: `${site.url.replace(/\/$/, "")}${path}` } : {}) }, twitter: { card: "summary_large_image", title: `${title} — RERA WEB`, description } };
}
