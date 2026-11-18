"use client";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { InterfaceContent } from "./interface-content";
import { LogicContent } from "./logic-content";
import { IntelligenceContent } from "./intelligence-content";
import { FoundationContent } from "./foundation-content";
import { RegistrationMarks } from "@/components/ui";
import { buildLayers } from "@/data/layers";

const content = [InterfaceContent, LogicContent, IntelligenceContent, FoundationContent];
export function BuildStack({ variant = "hero", active = 0, fallback }: { variant?: "hero" | "exploded" | "wireframe"; active?: number; fallback?: ReactNode }) {
  const surface = useRef<HTMLDivElement>(null);
  const selected = Math.max(0, Math.min(3, active));
  const order = variant === "wireframe" ? [0, 1, 2, 3] : [selected, ...[0, 1, 2, 3].filter((index) => index !== selected)];
  function move(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || variant === "wireframe" || !window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches || document.documentElement.dataset.motion === "reduced") return;
    const rect = event.currentTarget.getBoundingClientRect();
    surface.current?.style.setProperty("--pointer-x", `${((event.clientX - rect.left) / rect.width - 0.5) * 4}deg`);
    surface.current?.style.setProperty("--pointer-y", `${((event.clientY - rect.top) / rect.height - 0.5) * -4}deg`);
  }
  function reset() { surface.current?.style.removeProperty("--pointer-x"); surface.current?.style.removeProperty("--pointer-y"); }
  return <figure className={`build-stack stack-${variant}`} data-active-layer={buildLayers[selected].name} onPointerMove={move} onPointerLeave={reset} aria-label={`Illustrative software blueprint. Selected layer: ${buildLayers[selected].name}.`}>
    <div className="stack-live" aria-hidden="true"><div className="stack-guide-horizontal"/><div className="stack-guide-vertical"/><div className="stack-float"><div className="stack-perspective" ref={surface}><div className="stack-assembly">{order.map((layerIndex, position) => {
      const Content = content[layerIndex]; const layer = buildLayers[layerIndex];
      return <div key={position} className={`stack-layer stack-layer-${position} ${position === 0 ? "layer-active" : ""}`}><RegistrationMarks/><span className="layer-edge-label">{layer.number} / {layer.name.toUpperCase()}</span><div className="plate-interior" key={layerIndex}><Content/></div></div>;
    })}</div></div></div><div className="stack-selected-annotation mono"><span className="annotation-leader"/><span>{buildLayers[selected].number} / {buildLayers[selected].name}<small>{buildLayers[selected].subtitle}</small></span></div><span className="stack-dimension mono">EVERY LAYER. CONSIDERED.</span></div>
    {fallback}
    {variant !== "hero" && <figcaption className="stack-caption mono"><span>THE BUILD STACK</span><span>ILLUSTRATIVE / {buildLayers[selected].name}</span></figcaption>}
    <noscript><style>{`.build-stack .stack-live{display:none!important}.build-stack .stack-static-fallback{display:block!important}`}</style></noscript>
  </figure>;
}
