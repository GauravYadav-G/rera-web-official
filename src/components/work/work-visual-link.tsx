"use client";
import Link from "next/link";
import { useRef, type PointerEvent, type ReactNode } from "react";

export function WorkVisualLink({ href, children }: { href: string; children: ReactNode }) {
  const frame = useRef<HTMLAnchorElement>(null);
  function move(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse" || document.documentElement.dataset.motion === "reduced" || !window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    frame.current?.style.setProperty("--work-x", `${((event.clientX - rect.left) / rect.width - 0.5) * 2}deg`);
    frame.current?.style.setProperty("--work-y", `${((event.clientY - rect.top) / rect.height - 0.5) * -2}deg`);
  }
  function reset() { frame.current?.style.removeProperty("--work-x"); frame.current?.style.removeProperty("--work-y"); }
  return <Link ref={frame} className="work-visual-link" href={href} onPointerMove={move} onPointerLeave={reset}>{children}</Link>;
}
