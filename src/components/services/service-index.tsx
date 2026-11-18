"use client";
import { useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { services } from "@/data/services";
import { SectionLabel, TextLink } from "@/components/ui";
import { ServicePreview } from "./service-preview";

export function ServiceIndex() {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowDown") next = (index + 1) % services.length;
    else if (event.key === "ArrowUp") next = (index + services.length - 1) % services.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = services.length - 1;
    else return;
    event.preventDefault();
    buttons.current[next]?.focus();
  }
  return <section id="services" className="section services-section"><div className="container">
    <SectionLabel number="03" suffix="CAPABILITIES, NOT SILOS">OUR TECHNOLOGY</SectionLabel>
    <div className="section-heading-row"><h2 className="display-l">Ideas need the<br />right <em>systems</em><br />to become real.</h2><div className="body-copy"><p>Every ambitious idea requires the right technical foundation. We connect design, engineering, and emerging technologies to solve meaningful problems.</p><TextLink href="/services">Explore our capabilities</TextLink></div></div>
    <div className="services-layout"><div className="service-list">{services.map((service, index) => <div className={`service-row ${active === index ? "is-active" : ""}`} key={service.slug}>
      <h3><button ref={(element) => { buttons.current[index] = element; }} type="button" className="service-trigger" aria-expanded={active === index} aria-controls={`service-panel-${service.slug}`} id={`service-button-${service.slug}`} onClick={() => setActive(index)} onKeyDown={(event) => navigate(event, index)}><span className="service-number mono">{service.number}</span><span>{service.name}</span><span className="service-toggle" aria-hidden="true">{active === index ? "−" : "+"}</span></button></h3>
      <div className="service-panel" id={`service-panel-${service.slug}`} role="region" aria-labelledby={`service-button-${service.slug}`} hidden={active !== index}>
        <div className="mobile-service-preview">{active === index && <ServicePreview index={index} />}</div>
        <p className="service-tagline">{service.tagline}</p><p className="service-description">{service.description}</p><ul className="service-capabilities mono">{service.capabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul><Link href={`/services/${service.slug}`} className="text-link"><span>Explore service</span><span aria-hidden="true">↗</span></Link>
      </div>
    </div>)}</div><div className="services-preview"><ServicePreview key={active} index={active} /><p className="preview-context mono"><span>SELECT A CAPABILITY TO INSPECT</span><span>ILLUSTRATIVE SOFTWARE STUDIES</span></p></div></div>
  </div></section>;
}
