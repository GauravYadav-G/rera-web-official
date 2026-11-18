"use client";
import Link from "next/link";
import type { MouseEvent, PointerEvent, ReactNode } from "react";

export function PrimaryLink({ href, children, magnetic = false, focusBrief = false, className = "" }: { href: string; children: ReactNode; magnetic?: boolean; focusBrief?: boolean; className?: string }) {
  function move(event: PointerEvent<HTMLAnchorElement>) {
    if (!magnetic || event.pointerType !== "mouse" || document.documentElement.dataset.motion === "reduced" || !window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-6, Math.min(6, (event.clientX - rect.left - rect.width / 2) * 0.04));
    const y = Math.max(-6, Math.min(6, (event.clientY - rect.top - rect.height / 2) * 0.06));
    event.currentTarget.style.transform = `translate(${x}px, ${y}px)`;
  }
  function click(event: MouseEvent<HTMLAnchorElement>) {
    if (!focusBrief || !href.startsWith("#") || event.metaKey || event.ctrlKey) return;
    requestAnimationFrame(() => document.getElementById("brief-name")?.focus({ preventScroll: true }));
  }
  return <Link prefetch={false} href={href} className={`button ${className}`} onPointerMove={move} onPointerLeave={(event) => { event.currentTarget.style.removeProperty("transform"); }} onClick={click}><span>{children}</span><span className="button-arrow" aria-hidden="true">↗</span></Link>;
}
