import Link from "next/link";
import { services } from "@/data/services";
import { Breadcrumbs, PageIntro, ProjectCTA } from "@/components/pages/page-shell";
import { LogicContent } from "@/components/build-stack/logic-content";
import { RegistrationMarks, TextLink } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Services — Design, software & digital engineering", "Explore RERA WEB’s capabilities in web development, custom software, AI, Web3, product design, and backend engineering.", "/services");
export default function ServicesPage() {
  return <main id="main-content" className="page-main services-directory"><div className="container"><Breadcrumbs items={[{ label: "Services" }]}/><PageIntro label="OUR CAPABILITIES" index="SIX DISCIPLINES / ONE CONNECTED APPROACH" title={<>Good ideas.<br/>The right <em>systems.</em></>} description="From the first wireframe to the foundations underneath it. Design and engineering, working together to give your idea the right form."><TextLink href="#capability-index" down>Find your foundation</TextLink></PageIntro>
    <div className="directory-banner"><RegistrationMarks/><div className="directory-banner-copy"><span className="mono">THE BUILD / EVERY LAYER CONNECTED</span><h2>Not six silos.<br/>One considered <em>build.</em></h2><p>We’re founder-led and independent. These are connected capabilities, not departments. We shape the approach around your problem.</p></div><div className="directory-diagram" role="img" aria-label="Illustrative diagram of connected authentication, order, billing and notification modules"><div aria-hidden="true"><LogicContent/></div><span className="mono">ILLUSTRATIVE / SYSTEM ARCHITECTURE</span></div></div>
    <section className="directory-index" id="capability-index" aria-label="Service directory"><div className="index-heading mono"><span>THE CAPABILITY INDEX</span><span>SELECT A DISCIPLINE ↘</span></div>{services.map((service) => <article className="directory-row" key={service.slug}><span className="directory-number mono">{service.number}</span><div className="directory-title"><h2><Link href={`/services/${service.slug}`}>{service.name}<span aria-hidden="true">↗</span></Link></h2><span className="mono">{service.technology}</span></div><div className="directory-description"><p>{service.tagline}</p><p>{service.description}</p><TextLink href={`/services/${service.slug}`}>Explore {service.discipline.toLowerCase()}</TextLink></div></article>)}</section>
  </div><ProjectCTA title={<>You bring the question.<br/>We bring the <em>curiosity.</em></>}/></main>;
}
