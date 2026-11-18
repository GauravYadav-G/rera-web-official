"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navigation, site } from "@/data/site";
import { Logo } from "@/components/ui";

export function Navigation() {
  const pathname = usePathname();
  return <NavigationContent key={pathname} pathname={pathname}/>;
}
function NavigationContent({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  useEffect(() => {
    let previous = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const current = window.scrollY;
      setScrolled(current > 24);
      if (current < 100) setHidden(false);
      else if (Math.abs(current - previous) > 5) setHidden(current > previous && current > 320);
      const hero = document.querySelector(".hero");
      setPastHero(Boolean(hero && hero.getBoundingClientRect().bottom < 0));
      previous = current;
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", scroll, { passive: true });
    update();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", scroll); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const oldOverflow = document.body.style.overflow;
    const oldActive = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const nodes = () => Array.from(panel.current?.querySelectorAll<HTMLElement>("a[href],button:not([disabled])") || []);
    nodes()[0]?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); return; }
      if (event.key !== "Tab") return;
      const focusable = nodes();
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", key);
    return () => { document.body.style.overflow = oldOverflow; document.removeEventListener("keydown", key); if (oldActive?.isConnected) oldActive.focus({ preventScroll: true }); };
  }, [open]);
  return <>
    <header className={`site-header ${scrolled ? "is-scrolled" : ""} ${hidden && !open ? "is-hidden" : ""} ${open ? "menu-is-open" : ""}`}><div className="header-inner"><Logo/><nav className="desktop-nav" aria-label="Main navigation">{navigation.map((item) => <Link prefetch={false} href={item.href} key={item.label} aria-current={isCurrent(item.href) ? "page" : undefined}>{item.label}</Link>)}</nav><Link prefetch={false} href="/contact" className="nav-cta">Let’s talk <span aria-hidden="true">↗</span></Link><button ref={toggle} type="button" className="menu-toggle" aria-label="Open navigation" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)}><Menu size={23} strokeWidth={1.5}/></button></div></header>
    {open && <div id="mobile-navigation" ref={panel} className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation"><div className="mobile-menu-brand"><Logo onClick={() => setOpen(false)}/></div><button type="button" className="mobile-menu-close" aria-label="Close navigation" onClick={() => setOpen(false)}><X size={23} strokeWidth={1.5}/></button><div className="mobile-menu-kicker mono">INDEPENDENT BY DESIGN.</div><nav aria-label="Mobile navigation">{navigation.map((item, index) => <Link key={item.label} href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined} onClick={() => setOpen(false)}><span className="mono">0{index + 1}</span><span>{item.label}</span><span className="mobile-menu-arrow" aria-hidden="true">↗</span></Link>)}</nav><div className="mobile-menu-bottom"><span className="mono">BUILT IN INDIA.</span>{site.contactEmail && <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>}</div></div>}
    {pastHero && pathname === "/" && !open && <Link className="mobile-contact-bar mono" href="/contact">HAVE SOMETHING IN MIND? <span>LET’S TALK ↗</span></Link>}
  </>;
}
