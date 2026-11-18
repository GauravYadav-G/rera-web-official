import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Navigation } from "@/components/navigation/navigation";
import { BuildRail } from "@/components/navigation/build-rail";
import { Footer } from "@/components/footer";
import { MotionDirector } from "@/components/motion-director";
import { SiteGuide } from "@/components/guide/site-guide";
import { site } from "@/data/site";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], display: "swap", variable: "--font-geist" });
const mono = Geist_Mono({ subsets: ["latin"], display: "swap", variable: "--font-geist-mono" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", display: "swap", variable: "--font-instrument" });
const title = "RERA WEB — Software Development Startup from India";

export const metadata: Metadata = {
  metadataBase: site.url ? new URL(site.url) : undefined,
  title: { default: title, template: "%s — RERA WEB" },
  description: site.description,
  applicationName: "RERA WEB",
  keywords: ["software development India", "web development", "custom software", "AI automation", "RERA WEB", "product design"],
  alternates: site.url ? { canonical: site.url } : undefined,
  openGraph: { type: "website", locale: "en_IN", title, description: site.description, siteName: "RERA WEB" },
  twitter: { card: "summary_large_image", title, description: site.description },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const structuredData = { "@context": "https://schema.org", "@type": "Organization", name: site.name, ...(site.url ? { url: site.url } : {}), description: site.description, foundingLocation: { "@type": "Country", name: "India" }, founder: site.founders.map((person) => ({ "@type": "Person", name: person.name, jobTitle: person.role })), ...(site.contactEmail ? { email: site.contactEmail } : {}) };
  return <html lang="en-IN" className={`${geist.variable} ${mono.variable} ${serif.variable}`}><body id="top"><a className="skip-link" href="#main-content">Skip to content</a><Navigation /><BuildRail /><noscript><nav className="no-js-navigation mono" aria-label="Quick navigation">{["Services", "Work", "Process", "About", "Contact"].map((label) => <a key={label} href={`/${label.toLowerCase()}`}>{label}</a>)}</nav><style>{`@layer base{.service-panel[hidden]{display:block!important}}.service-toggle,.mobile-service-preview{display:none!important}.no-js-navigation{display:flex;gap:20px;flex-wrap:wrap;padding:100px var(--gutter) 0;font-size:12px}`}</style></noscript>{children}<Footer /><SiteGuide /><MotionDirector /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /></body></html>;
}
