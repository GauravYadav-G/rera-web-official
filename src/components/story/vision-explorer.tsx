"use client";
import { useState, type ReactNode } from "react";
import { BuildStack } from "@/components/build-stack/build-stack";
export function VisionExplorer({ children, lines, fallback }: { children: ReactNode; lines: string[]; fallback: ReactNode }) {
  const [active, setActive] = useState(0);
  return <div className="vision-layout"><div className="vision-copy">{children}<div className="manifesto-lines" aria-label="Our approach and the four software layers">{lines.map((line, index) => <button type="button" className={active === index ? "is-active" : ""} key={line} onClick={() => setActive(index)} aria-pressed={active === index}><span className="mono">0{index + 1}</span><span>{line}</span><span aria-hidden="true">↗</span></button>)}</div></div><div className="vision-visual"><BuildStack variant="exploded" active={active} fallback={fallback}/></div></div>;
}
