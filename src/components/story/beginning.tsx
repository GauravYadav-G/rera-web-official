import { story } from "@/data/story";
import { SectionLabel } from "@/components/ui";
import { BuildStack } from "@/components/build-stack/build-stack";
import { StaticStack } from "@/components/build-stack/static-stack";
import { PlateIndicator } from "./plate-indicator";

export function Beginning() {
  return <section id="beginning" className="section beginning-section"><div className="container"><SectionLabel number="01" suffix="AN IDEA TAKES SHAPE">THE BEGINNING</SectionLabel><div className="beginning-grid"><aside className="beginning-aside"><div className="mono beginning-meta">BEFORE THE FIRST<br/>LINE OF CODE.<br/><span>THERE’S A BETTER QUESTION.</span></div><BuildStack variant="wireframe" fallback={<StaticStack/>}/><PlateIndicator/></aside><div className="beginning-content"><h2 className="display-l">Every product<br/>starts as a<br/><em>question.</em></h2><div className="question-reveal">{story.beginning.map((paragraph, index) => <p key={index}>{paragraph.split(" ").map((word, wordIndex) => <span className="reveal-word" key={wordIndex}>{word} </span>)}</p>)}</div><span className="mono story-endnote">CURIOSITY IS THE FIRST COMMIT.</span></div></div></div></section>;
}
