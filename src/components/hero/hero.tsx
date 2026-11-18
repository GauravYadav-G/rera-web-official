import { Play } from "lucide-react";
import { HeroBuildExperience } from "@/components/hero/hero-build-experience";
import { StaticStack } from "@/components/build-stack/static-stack";
import { ISTClock } from "@/components/navigation/ist-clock";
import { PrimaryLink } from "@/components/ui/primary-link";
import { TextLink } from "@/components/ui";
import { site } from "@/data/site";

export function Hero() {
  return <section className="hero" aria-labelledby="hero-heading"><div className="blueprint-rails" aria-hidden="true"><i/><i/><i/><i/></div><div className="container hero-container"><div className="hero-status mono"><span>INDEPENDENT TECHNOLOGY STARTUP <b>·</b> INDIA</span><ISTClock/></div><div className="hero-content"><div className="hero-comment mono"><span className="code-caret" aria-hidden="true"/><span>// every product starts with an empty file.</span></div><h1 id="hero-heading" className="hero-heading"><span>Ideas deserve</span><span><em>well-built</em></span><span>software.</span></h1><p className="hero-description">{site.description}</p><div className="hero-actions"><PrimaryLink href="#brief" magnetic focusBrief>Start a project</PrimaryLink><TextLink href="#services" down>See what we build</TextLink></div></div><div className="hero-art"><HeroBuildExperience fallback={<StaticStack/>}/></div><div className="hero-bottom mono"><span className="hero-chapter"><span>001</span> FROM AN IDEA. TO WHAT’S NEXT.</span><span className="hero-capabilities">WEB <b>·</b> SOFTWARE <b>·</b> AI <b>·</b> WEB3 <b>·</b> DESIGN <b>·</b> CLOUD</span><a className="hero-watch" href="#build-shorts"><Play size={12} strokeWidth={1.65} aria-hidden="true" /> Watch the build</a><a className="hero-scroll" href="#beginning" aria-label="Scroll to build — the beginning"><span>SCROLL TO BUILD</span><span className="scroll-arrow" aria-hidden="true">↓</span></a></div></div></section>;
}
