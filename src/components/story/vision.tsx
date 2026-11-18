import { story } from "@/data/story";
import { SectionLabel } from "@/components/ui";
import { StaticStack } from "@/components/build-stack/static-stack";
import { VisionExplorer } from "./vision-explorer";
export function Vision() {
  return <section id="vision" className="section vision-section"><div className="blueprint-rails" aria-hidden="true"><i/><i/><i/><i/></div><div className="container"><SectionLabel number="02" suffix="THE IDEA BECOMES A SYSTEM">OUR VISION</SectionLabel><h2 className="display-l vision-heading">We see possibilities<br/>where others<br/>see <em>limits.</em></h2><VisionExplorer lines={story.manifesto} fallback={<StaticStack/>}><div className="body-copy">{story.vision.map((paragraph, index) => <p key={index} className={index === 2 ? "vision-honest-line" : undefined}>{paragraph}</p>)}</div></VisionExplorer><div className="vision-closing mono"><span>RERA WEB</span><span>WE DON’T JUST BUILD SOFTWARE.<br/><b>WE BUILD POSSIBILITIES.</b></span><span className="vision-closing-arrow" aria-hidden="true">↓</span></div></div></section>;
}
