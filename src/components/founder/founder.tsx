import Image from "next/image";
import { story } from "@/data/story";
import { site } from "@/data/site";
import { SectionLabel, RegistrationMarks } from "@/components/ui";
import { ISTClock } from "@/components/navigation/ist-clock";
import { ChapterTransition } from "@/components/dither-seam";

export function Founder() {
  const socials = Object.entries(site.socials).filter(([, href]) => href);
  return <><ChapterTransition to="paper" /><section id="about" className="section founder-section motion-section"><div className="container"><SectionLabel number="05" suffix="THE PERSON BEHIND THE BUILD">THE HUMAN SIDE</SectionLabel><div className="founder-grid"><div className="founder-left"><h2 className="display-l reveal">Behind every<br />product, there’s<br />a <em>beginning.</em></h2><div className="founder-identity">{site.founderPortrait ? <div className="founder-portrait" style={{ position: "relative", aspectRatio: "4/5" }}><RegistrationMarks /><Image src={site.founderPortrait} alt={`${site.foundersLabel}, founders of RERA WEB`} fill sizes="(max-width: 768px) 100vw, 40vw" style={{ objectFit: "cover" }} /></div> : <div className="founder-name"><span>Gaurav.</span><span>Abhijeet.</span></div>}<div className="founder-name-meta mono"><span>{site.foundersLabel.toUpperCase()} / FOUNDERS, RERA WEB</span><span>BUILT IN INDIA</span></div>{socials.length > 0 && <div className="founder-links mono">{socials.map(([name, href]) => <a key={name} href={href!} target="_blank" rel="noopener noreferrer">{name} ↗</a>)}</div>}</div></div><div className="founder-copy">{story.founder.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></div><div className="founder-signature mono"><span>BUILT IN INDIA. INSPIRED BY WHAT’S POSSIBLE.</span><ISTClock /></div></div></section></>;
}
