import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0B" },
    { media: "(prefers-color-scheme: light)", color: "#0A0A0B" },
  ],
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const title = "RERA WEB — Software Development, Web Platforms & AI Engineering";
const ogTitle = "RERA WEB — Web Development, Custom Software, AI Automation, Web3 & Cloud Engineering";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s — RERA WEB" },
  description: site.description,
  applicationName: "RERA WEB",
  keywords: [
    "RERA WEB",
    "software development India",
    "web development company",
    "custom software engineering",
    "AI automation startup",
    "UI UX product design studio",
    "Web3 and blockchain development",
    "backend and cloud architecture",
    "intelligent software",
    "Next.js web development",
    "Gaurav & Abhijeet",
    "independent technology startup",
    "enterprise SaaS solutions",
    "smart contracts",
    "PostgreSQL Node.js engineering",
  ],
  authors: [
    { name: "Gaurav", url: site.url },
    { name: "Abhijeet", url: site.url },
  ],
  creator: "RERA WEB",
  publisher: "RERA WEB",
  category: "technology",
  alternates: {
    canonical: site.url,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    title: ogTitle,
    description: site.description,
    siteName: "RERA WEB",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "RERA WEB — Ideas deserve well-built software. An independent technology startup from India.",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ogTitle,
    description: site.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        logo: `${site.url}/images/logo.png`,
        image: `${site.url}/opengraph-image`,
        description: site.description,
        foundingLocation: { "@type": "Country", name: "India" },
        founders: site.founders.map((person) => ({
          "@type": "Person",
          name: person.name,
          jobTitle: person.role,
        })),
        ...(site.contactEmail ? { email: site.contactEmail } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        description: site.description,
        publisher: { "@id": `${site.url}/#organization` },
      },
    ],
  };

  return (
    <html lang="en-IN" className={`${geist.variable} ${mono.variable} ${serif.variable}`}>
      <body id="top">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Navigation />
        <BuildRail />
        <noscript>
          <nav className="no-js-navigation mono" aria-label="Quick navigation">
            {["Services", "Work", "Process", "About", "Contact"].map((label) => (
              <a key={label} href={`/${label.toLowerCase()}`}>
                {label}
              </a>
            ))}
          </nav>
          <style>{`@layer base{.service-panel[hidden]{display:block!important}}.service-toggle,.mobile-service-preview{display:none!important}.no-js-navigation{display:flex;gap:20px;flex-wrap:wrap;padding:100px var(--gutter) 0;font-size:12px}`}</style>
        </noscript>
        {children}
        <Footer />
        <SiteGuide />
        <MotionDirector />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
