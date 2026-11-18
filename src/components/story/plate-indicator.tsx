"use client";
import { useEffect, useState } from "react";

export function PlateIndicator() {
  const [count, setCount] = useState(1);
  useEffect(() => {
    const section = document.getElementById("beginning");
    if (!section) return;
    let scheduled = false;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight * 0.7 - rect.top) / (rect.height * 0.75)));
      const next = Math.min(4, Math.floor(progress * 4) + 1);
      setCount(next);
      section.dataset.plates = String(next);
      scheduled = false;
    };
    const onScroll = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="plate-indicator mono"><span>STRUCTURE EMERGING</span><span>PLATES <b>{count} / 4</b></span></div>;
}
