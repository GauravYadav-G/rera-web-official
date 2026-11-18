import { ArrowUpRight, Play } from "lucide-react";
import { SectionLabel, TextLink } from "@/components/ui";
import { ChapterTransition } from "@/components/dither-seam";
import { GuideOpenLink } from "./guide-open-link";
import { PatchTurntable } from "./patch-turntable";

export function GuideFeature() {
  return <>
    <ChapterTransition to="paper" />
    <section className="guide-feature section paper-surface" data-rail-tone="paper" id="meet-patch" aria-labelledby="meet-patch-title">
      <div className="container">
        <SectionLabel suffix="FIELD NOTE / 001">A GUIDE TO THE BUILD</SectionLabel>
        <div className="guide-feature-grid">
          <div className="guide-feature-copy">
            <span className="eyebrow mono">INTRODUCING RW / 01</span><h2 className="display-l" id="meet-patch-title">Meet <em>Patch.</em></h2>
            <p>A small guide to the things we build. Find the right service, see a study, or go straight to a conversation.</p>
            <div className="guide-feature-actions"><GuideOpenLink className="button"><span>Open site guide</span><ArrowUpRight size={19} strokeWidth={1.5} aria-hidden="true" /></GuideOpenLink><TextLink href="/guide">Full site index</TextLink></div>
            <a className="patch-studio-link" href="/work#patch-studio"><span className="patch-studio-icon"><Play size={14} strokeWidth={1.6} aria-hidden="true" /></span><span><span>Watch the studio cut</span><small className="mono">PATCH / PRODUCT STUDY · 0:06</small></span><ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" /></a>
          </div>
          <PatchTurntable />
        </div>
      </div>
    </section>
    <ChapterTransition to="ink" />
  </>;
}
