"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { buildChapters } from "@/data/site";

export function BuildRail() {
  const pathname = usePathname();
  const [active, setActive] = useState("");
  const [onPaper, setOnPaper] = useState(false);
  const fill = useRef<HTMLSpanElement>(null);
  const topFill = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    const chapters = buildChapters.map(({ id }) => document.getElementById(id)).filter((node): node is HTMLElement => Boolean(node));
    const light = [...document.querySelectorAll("[data-rail-tone='paper'], #about")];
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const amount = Math.min(1, Math.max(0, window.scrollY / scrollable));
      if (fill.current) fill.current.style.transform = `scaleY(${amount})`;
      if (topFill.current) topFill.current.style.transform = `scaleX(${amount})`;
      const chapterLine = window.innerHeight * .35;
      const toneLine = window.innerHeight * .5;
      let current = "";
      for (const section of chapters) {
        if (section.getBoundingClientRect().top > chapterLine) break;
        current = section.id;
      }
      setActive(current);
      setOnPaper(light.some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= toneLine && rect.bottom > toneLine;
      }));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const main = document.querySelector("main");
    const observer = new ResizeObserver(schedule);
    if (main) observer.observe(main);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [pathname]);

  if (pathname !== "/") return null;
  return <><div className="mobile-progress" aria-hidden="true"><span ref={topFill} /></div><nav className={`build-rail ${onPaper ? "on-paper" : ""}`} aria-label="Chapter navigation"><span className="build-rail-track" aria-hidden="true"><span ref={fill} /></span>{buildChapters.map((chapter) => <a key={chapter.id} href={`#${chapter.id}`} className={active === chapter.id ? "is-active" : ""} aria-current={active === chapter.id ? "location" : undefined}><span className="rail-label">{chapter.label}</span><span className="rail-number">{chapter.number}</span><i aria-hidden="true" /></a>)}</nav></>;
}
