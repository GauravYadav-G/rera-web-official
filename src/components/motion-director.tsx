"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Scroll owns decorative rules only. Interactive diagrams own their own transforms. */
export function MotionDirector() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const limited = navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4;
    let disposed = false;
    let revert: (() => void) | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    const setMode = () => { document.documentElement.dataset.motion = preference.matches || limited ? "reduced" : "full"; };
    setMode();
    preference.addEventListener("change", setMode);
    const visibility = new IntersectionObserver((entries) => {
      for (const entry of entries) entry.target.classList.toggle("is-inview", entry.isIntersecting);
    }, { rootMargin: "30px" });
    document.querySelectorAll(".build-stack, .contact-empty-plate").forEach((node) => visibility.observe(node));
    const timer = setTimeout(async () => {
      if (limited) return;
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        const mm = gsap.matchMedia();
        revert = () => mm.revert();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.utils.toArray<HTMLElement>(".section-label-rule").forEach((element) => {
            if (element.getBoundingClientRect().top < window.innerHeight) return;
            gsap.fromTo(element, { scaleX: 0.4 }, { scaleX: 1, duration: 0.75, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 94%", once: true } });
          });
          const narrative = document.querySelector(".question-reveal");
          if (narrative) gsap.fromTo(narrative.querySelectorAll(".reveal-word"), { opacity: 0.4 }, { opacity: 1, stagger: 0.06, ease: "none", scrollTrigger: { trigger: narrative, start: "top 88%", end: "bottom 65%", scrub: 0.2 } });
          const line = document.querySelector(".process-line-fill");
          if (line) gsap.fromTo(line, { scaleY: 0, transformOrigin: "top" }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".process-stages", start: "top 65%", end: "bottom 70%", scrub: true } });
          gsap.utils.toArray<HTMLElement>(".dither-seam").forEach((seam) => {
            gsap.fromTo(seam.querySelectorAll("i"), { scaleY: 0.2 }, { scaleY: 1, ease: "none", stagger: { each: 0.012, from: "center" }, scrollTrigger: { trigger: seam, start: "top 98%", end: "bottom 70%", scrub: 0.25 } });
          });
        });
        const refresh = () => {
          clearTimeout(refreshTimer);
          refreshTimer = setTimeout(() => { if (!disposed) ScrollTrigger.refresh(); }, 120);
        };
        const main = document.getElementById("main-content");
        let previousHeight = main?.offsetHeight || 0;
        resizeObserver = new ResizeObserver(() => {
          const height = main?.offsetHeight || 0;
          if (Math.abs(height - previousHeight) > 2) { previousHeight = height; refresh(); }
        });
        if (main) resizeObserver.observe(main);
        void document.fonts.ready.then(() => { if (!disposed) refresh(); });
      } catch { /* Progressive enhancement: all content is already visible. */ }
    }, 180);
    return () => {
      disposed = true;
      clearTimeout(timer);
      clearTimeout(refreshTimer);
      resizeObserver?.disconnect();
      visibility.disconnect();
      preference.removeEventListener("change", setMode);
      revert?.();
    };
  }, [pathname]);
  return null;
}
