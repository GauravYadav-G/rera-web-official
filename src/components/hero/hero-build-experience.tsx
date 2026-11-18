"use client";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { BuildStack } from "@/components/build-stack/build-stack";
import { buildLayers } from "@/data/layers";

export function HeroBuildExperience({ fallback }: { fallback: ReactNode }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const layer = buildLayers[active];
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? 3 : (index + (event.key === "ArrowRight" ? 1 : 3)) % 4;
    setActive(next); buttons.current[next]?.focus();
  }
  return <div className="hero-experience"><div className="inspector-topline mono"><span>PRODUCT BLUEPRINT / BUILD 001</span><span>ILLUSTRATIVE</span></div><div className="inspector-panel" role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`} tabIndex={0}><BuildStack active={active} fallback={fallback}/><div className="inspector-readout"><span className="mono">{layer.number} / {layer.file}</span><p>{layer.description}</p></div></div><div className="hero-layer-controls" role="tablist" aria-label="Inspect the Build Stack layers">{buildLayers.map((item, index) => <button ref={(element) => { buttons.current[index] = element; }} type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} key={item.name} onClick={() => setActive(index)} onKeyDown={(event) => navigate(event, index)}><span>{item.number}</span><span>{item.name}</span></button>)}</div><noscript><style>{`.hero-layer-controls{display:none}`}</style></noscript></div>;
}
