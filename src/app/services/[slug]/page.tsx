import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/data/services";
import { serviceDetails } from "@/data/service-details";
import { site } from "@/data/site";
import { ServicePreview } from "@/components/services/service-preview";
import { Breadcrumbs, FAQList, ProjectCTA } from "@/components/pages/page-shell";
import { DesignSpecimen } from "@/components/pages/design-specimen";
import { PrimaryLink } from "@/components/ui/primary-link";
import { ChapterTransition } from "@/components/dither-seam";
import { SectionLabel, TextLink } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() { return services.map((service) => ({ slug: service.slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  return service ? pageMetadata(service.name, service.description, `/services/${slug}`) : {};
}
export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const index = services.findIndex((item) => item.slug === slug);
  if (index < 0) notFound();
  const service = services[index];
  const detail = serviceDetails[service.slug];
  const related = [services[(index + 1) % services.length], services[(index + 2) % services.length]];
  const jsonLd = { "@context": "https://schema.org", "@type": "Service", name: service.name, description: service.description, provider: { "@type": "Organization", name: "RERA WEB", ...(site.url ? { url: site.url } : {}) } };
  return <main id="main-content" className={`page-main service-detail service-detail-${service.slug}`}>
    <div className="container"><Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: service.name }]}/><header className="service-hero"><div className="service-hero-copy"><span className="eyebrow mono">[{service.number}] / {service.discipline}</span><h1>{detail.heading}<br/><em>{detail.accent}</em></h1><p className="service-hero-tagline">{service.tagline}</p><p className="service-hero-description">{service.description}</p><PrimaryLink href={`/contact?service=${encodeURIComponent(service.formName)}#brief`}>Let’s build something</PrimaryLink></div><div className="service-hero-art"><ServicePreview index={index}/><div className="service-art-caption mono"><span>BUILD STUDY / {service.number}</span><span>AN IDEA, MADE VISIBLE.</span></div></div></header><div className="service-route-meta mono"><span>{detail.note}</span><span>INDEPENDENT / INDIA</span></div></div>
    <ChapterTransition to="paper" /><section className="service-perspective"><div className="container"><SectionLabel suffix="THE THINKING BEHIND THE BUILD">PURPOSE BEFORE TECHNOLOGY</SectionLabel><div className="perspective-grid"><div><h2>The right approach.<br/>For your <em>reality.</em></h2><p className="perspective-lead">{detail.focus}</p><span className="mono">A GOOD FIT FOR</span><p>{detail.fit}</p></div><div className="outcome-list">{detail.outcomes.map((outcome, number) => <article key={outcome.title}><span className="mono">0{number + 1}</span><div><h3>{outcome.title}</h3><p>{outcome.description}</p></div></article>)}</div></div></div></section><ChapterTransition to="ink" />
    {service.slug === "ui-ux-design" && <section className="container design-route-feature"><SectionLabel suffix="ILLUSTRATIVE / DESIGN LANGUAGE">CLARITY, DOWN TO THE DETAILS</SectionLabel><DesignSpecimen/></section>}
    <section className="container page-section service-capability-section"><div className="page-split"><div><span className="eyebrow mono">WHAT WE CAN WORK ON</span><h2 className="page-subheading">The parts.<br/>The <em>possibilities.</em></h2><p className="body-copy">{service.approach}</p></div><ol className="detail-capabilities">{service.capabilities.map((capability, number) => <li key={capability}><span className="mono">0{number + 1}</span><span>{capability}</span><span aria-hidden="true">↗</span></li>)}</ol></div></section>
    <section className="container page-section service-faq-section"><div className="page-split"><div><span className="eyebrow mono">BEFORE WE BEGIN</span><h2 className="page-subheading">A few good<br/><em>questions.</em></h2><p className="body-copy">The right build begins with a clear conversation. Here’s a little of what that might cover.</p></div><FAQList items={detail.faqs}/></div></section>
    <section className="container connected-services"><div className="connected-heading"><span className="mono">CONNECTED CAPABILITIES</span><TextLink href="/services">All services</TextLink></div>{related.map((item) => <Link href={`/services/${item.slug}`} className="related-service-row" key={item.slug}><span className="mono">{item.number}</span><h2>{item.name}</h2><span aria-hidden="true">↗</span></Link>)}</section>
    <ProjectCTA service={service.formName}/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}/>
  </main>;
}
