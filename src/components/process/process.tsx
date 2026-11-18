"use client";
import { useEffect, useState } from "react";
import { processStages } from "@/data/process";
import { SectionLabel } from "@/components/ui";
import { StageArtifact } from "./stage-artifact";

export function Process() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.stage)); }), { rootMargin: "-20% 0px -48% 0px" });
    document.querySelectorAll(".process-stage").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  const current = processStages[active];
  return <section id="process" className="section process-section motion-section"><div className="container"><SectionLabel number="04" suffix="A THOUGHTFUL WAY FORWARD">THE PROCESS</SectionLabel><div className="section-heading-row"><h2 className="display-l reveal">From brief<br />to something<br /><em>real.</em></h2><p className="body-copy">Great digital products are rarely created in a single moment. They take curiosity, planning, design, engineering, testing, and continuous improvement.</p></div><div className="process-layout"><aside className="process-sidebar"><span className="mono">THE BUILD / {current.number} OF 05</span><div className="process-active-number" aria-hidden="true">{current.number}<span style={{ color: "var(--mute)", fontSize: "0.22em", letterSpacing: "-.04em", marginLeft: 18 }}>/05</span></div><h3>{current.name}.</h3><span className="stage-tagline mono">{current.tagline}</span><p className="body-copy">One connected process.<br />Every decision builds on the last.</p><div className="process-counter" aria-label="Jump to a process stage">{processStages.map((stage, index) => <button key={stage.name} type="button" className={active === index ? "is-active" : ""} aria-label={`Jump to ${stage.name}`} aria-current={active === index ? "step" : undefined} onClick={() => { setActive(index); document.getElementById(`stage-${stage.kind}`)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" }); }}><span /></button>)}</div></aside><div className="process-stages"><div className="process-line-track" aria-hidden="true"><span className="process-line-fill" /></div>{processStages.map((stage, index) => <article className={`process-stage ${active === index ? "is-active" : ""}`} id={`stage-${stage.kind}`} data-stage={index} key={stage.number}><div className="stage-header"><span className="mono">{stage.number}</span><h3>{stage.name}</h3></div><p className="stage-description">{stage.description}</p><StageArtifact index={index} /></article>)}</div></div></div></section>;
}
