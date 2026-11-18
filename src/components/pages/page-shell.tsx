import Link from "next/link";
import type { ReactNode } from "react";
import { PrimaryLink } from "@/components/ui/primary-link";
import { TextLink } from "@/components/ui";

type Crumb = { label: string; href?: string };
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return <nav aria-label="Breadcrumb" className="page-breadcrumb mono"><ol><li><Link href="/">Home</Link></li>{items.map((item) => <li key={item.label}><span className="breadcrumb-slash" aria-hidden="true">/</span>{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>)}</ol></nav>;
}
export function PageIntro({ label, title, description, index, children }: { label: string; title: ReactNode; description: string; index?: string; children?: ReactNode }) {
  return <header className="page-intro"><div className="page-intro-label mono"><span>{label}</span><span>{index || "INDEPENDENT THINKING / RERA WEB"}</span></div><div className="page-intro-grid"><h1>{title}</h1><div className="page-intro-aside"><p>{description}</p>{children}</div></div></header>;
}
export function ProjectCTA({ service, title, label = "THE NEXT BUILD" }: { service?: string; title?: ReactNode; label?: string }) {
  const href = service ? `/contact?service=${encodeURIComponent(service)}#brief` : "/contact#brief";
  return <section className="page-project-cta"><div className="container"><span className="mono">{label}</span><div className="page-cta-content"><h2>{title || <>Good things begin<br />with a <em>conversation.</em></>}</h2><div><p>No perfect brief needed.<br />Just an idea worth talking about.</p><PrimaryLink href={href}>Start a project</PrimaryLink><TextLink href="/process">See how we build</TextLink></div></div><div className="cta-bottom mono"><span>BUILT ON CURIOSITY.</span><span>ENGINEERED WITH PURPOSE.</span></div></div></section>;
}
export function FAQList({ items }: { items: { question: string; answer: string }[] }) {
  return <div className="faq-list">{items.map((item, index) => <details key={item.question}><summary><span className="mono">0{index + 1}</span><span>{item.question}</span><span className="faq-toggle" aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>;
}
