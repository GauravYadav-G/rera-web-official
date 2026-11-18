import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumbs, PageIntro, ProjectCTA } from "@/components/pages/page-shell";
import { PatchTurntable } from "@/components/guide/patch-turntable";
import { SectionLabel, TextLink } from "@/components/ui";
import { guideCapabilities, guidePages } from "@/data/guide";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Meet Patch — Your guide to RERA WEB", `Meet Patch, RERA WEB’s original 3D site guide. Search every page and capability, inspect the character, and find a direct route to ${site.foundersLabel} and the project brief.`, "/guide");

export default function GuidePage() {
  return <main id="main-content" className="page-main guide-page"><div className="container">
    <Breadcrumbs items={[{ label: "Site guide" }]} />
    <PageIntro label="THE RERA WEB SITE GUIDE" index="PATCH / RW — 01" title={<>A little help<br />finding your <em>way.</em></>} description={`Not sure where to begin? Patch searches every page, chapter, and capability, and points you to the right one — all the way to a conversation with ${site.foundersLabel}.`}>
      <TextLink href="#guide-index" down>Jump to the page index</TextLink><TextLink href="#patch-exhibit" down>Inspect Patch</TextLink>
    </PageIntro>
    <div className="guide-page-exhibit">
      <div className="guide-page-copy">
        <span className="eyebrow mono">ORIGINAL CHARACTER STUDY / 001</span><h2>Small robot.<br />Useful <em>directions.</em></h2>
        <p>Patch is a desk companion inspired by the tools of software making: an off-white instrument shell, a small terminal display, and one ember key.</p>
        <p>The guide searches the site and suggests links based on the page you’re visiting. Press <strong className="guide-key-hint">G</strong> anywhere to open it, or <strong className="guide-key-hint">/</strong> to jump straight to the find field. It isn’t a chatbot, and it doesn’t ask for or collect your details.</p>
        <TextLink href="/work#build-shorts">Watch the studio cut</TextLink>
      </div>
      <PatchTurntable id="patch-exhibit" />
    </div>
    <section className="guide-page-index" id="guide-index" aria-labelledby="guide-index-title">
      <SectionLabel suffix="THE SHORTEST WAY THERE">SITE INDEX</SectionLabel><h2 id="guide-index-title" className="page-subheading">Choose a <em>destination.</em></h2>
      <ol>{guidePages.map((page, index) => <li key={page.href}><Link href={page.href} prefetch={false}><span className="mono">{String(index + 1).padStart(2, "0")}</span><span className="guide-index-title">{page.label}</span><span className="guide-index-description">{page.note}</span><ArrowUpRight size={22} strokeWidth={1.5} aria-hidden="true" /></Link></li>)}</ol>
      <div className="guide-service-index"><span className="eyebrow mono">LOOKING FOR A SPECIFIC CAPABILITY?</span><ul>{guideCapabilities.map((service) => <li key={service.href}><Link href={service.href} prefetch={false}>{service.label} <span aria-hidden="true">↗</span></Link></li>)}</ul></div>
    </section>
  </div><ProjectCTA title={<>An idea is enough<br />to <em>begin.</em></>} /></main>;
}
