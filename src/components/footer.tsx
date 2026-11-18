import Link from "next/link";
import { services } from "@/data/services";
import { navigation, site } from "@/data/site";
import { ISTClock } from "@/components/navigation/ist-clock";
import { Logo } from "@/components/ui";
import { FooterFrame } from "./footer-frame";

export function Footer() {
  const socialLinks = Object.entries(site.socials).filter(([, href]) => href);
  return <FooterFrame><div className="container">
    <div className="footer-manifesto"><span className="mono">A NOTE TO WHAT COMES NEXT</span><div><h2>Every product begins as a <em>possibility.</em></h2><p>Great things begin with curiosity. With an idea that refuses to remain just an idea. With the courage to try something new. And the patience to build it right.</p><p>RERA WEB is our beginning: an independent technology venture from India, built around the belief that thoughtful design and engineering can turn possibilities into reality.</p><p>We’re at the beginning of our journey. And this is only the first chapter.</p></div></div>
    <div className="footer-links"><div className="footer-brand"><Logo/><p>Built on curiosity.<br/>Engineered with purpose.</p><span className="footer-founders mono">FOUNDED BY {site.foundersLabel.toUpperCase()}</span><span className="mono"><ISTClock/></span></div><div><h3 className="mono"><Link prefetch={false} href="/services">CAPABILITIES</Link></h3>{services.map((service) => <Link prefetch={false} key={service.slug} href={`/services/${service.slug}`}>{service.name}</Link>)}</div><div><h3 className="mono">COMPANY</h3>{navigation.filter((item) => item.label !== "Services").map((item) => <Link prefetch={false} key={item.label} href={item.href}>{item.label}</Link>)}<Link prefetch={false} href="/guide">Site guide</Link></div><div><h3 className="mono">CONNECT</h3>{site.contactEmail && <a href={`mailto:${site.contactEmail}`}>{site.contactEmail} ↗</a>}{site.phone && <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}>{site.phone} ↗</a>}{socialLinks.map(([label, href]) => <a key={label} href={href!} target="_blank" rel="noopener noreferrer">{label} ↗</a>)}{!site.contactEmail && socialLinks.length === 0 && <Link prefetch={false} href="/contact#brief">Share your idea ↗</Link>}<span className="footer-location">Independent.<br/>Based in {site.locationLabel || "India"}.</span></div></div>
    <div className="footer-bottom mono"><span>© {new Date().getFullYear()} RERA WEB · BUILT IN INDIA</span><nav className="footer-legal-links" aria-label="Legal information"><Link prefetch={false} href="/privacy-policy">PRIVACY POLICY</Link><Link prefetch={false} href="/terms-and-conditions">TERMS & CONDITIONS</Link></nav><a href="#top">BACK TO TOP <span aria-hidden="true">↑</span></a></div>
  </div><div className="footer-wordmark" aria-hidden="true" data-wordmark="RERA WEB"/></FooterFrame>;
}
