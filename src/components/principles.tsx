import { principles } from "@/data/principles";
import { SectionLabel } from "@/components/ui";

export function Principles() {
  return <section className="section principles-section motion-section"><div className="container"><SectionLabel suffix="WHAT WE COME BACK TO">WHY WE BUILD</SectionLabel><h2 className="display-l reveal">Big thinking.<br /><em>Careful</em> engineering.</h2><div>{principles.map((principle, index) => <article className="principle-row" key={principle.title}><span className="mono">0{index + 1}</span><h3>{principle.title}</h3><p>{principle.description}</p></article>)}</div></div></section>;
}
