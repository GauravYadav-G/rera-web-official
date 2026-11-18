const controls = [
  ".hero-bottom .hero-scroll", ".hero-bottom .hero-watch", ".hero-layer-controls",
  ".patch-turn-controls", ".screening-index button", ".screening-credits summary", ".screening-credits a",
  ".film-play-icon", ".film-transcript summary", ".film-return", ".form-submit", ".footer-bottom a",
].join(",");

type Box = Pick<DOMRectReadOnly, "left" | "right" | "top" | "bottom" | "width" | "height">;

/** Avoid taking the pointer away from primary controls on the page beneath the floating guide. */
export function watchDockClearance(dock: HTMLElement) {
  const main = document.querySelector("main");
  let frame = 0;
  let lift = 0;
  const margin = 8;
  const update = () => {
    frame = 0;
    const dockBox = dock.getBoundingClientRect();
    if (!dockBox.width || !dockBox.height) return;
    const vw = document.documentElement.clientWidth;
    const bottom = dockBox.bottom + lift;
    const inset = Math.max(0, dock.dataset.dockEdge === "left" ? dockBox.left : vw - dockBox.right);
    const targets: Box[] = [...document.querySelectorAll(controls)].map((item) => item.getBoundingClientRect());
    for (const video of document.querySelectorAll(".film-frame video")) {
      const box = video.getBoundingClientRect();
      targets.push({ left: box.left, right: box.right, top: box.bottom - 48, bottom: box.bottom, width: box.width, height: Math.min(box.height, 48) });
    }
    const relevant = targets.filter((box) => box.width > 1 && box.height > 1 && box.bottom > 0 && box.top < bottom + margin);

    function clearance(left: number) {
      let edge = bottom;
      const right = left + dockBox.width;
      for (let i = 0; i < relevant.length; i++) {
        const top = edge - dockBox.height;
        const blockers = relevant.filter((box) => box.right > left - margin && box.left < right + margin && box.bottom > top - margin && box.top < edge + margin);
        if (blockers.length === 0) break;
        edge = Math.min(...blockers.map((box) => box.top - margin));
      }
      return bottom - edge;
    }

    const right = clearance(vw - inset - dockBox.width);
    const left = right > 0 ? clearance(inset) : right;
    const safeLift = Math.max(0, bottom - dockBox.height - 82);
    const edge = left < right ? "left" : "right";
    const nextLift = Math.min(edge === "left" ? left : right, safeLift);
    if (dock.dataset.dockEdge !== edge) dock.dataset.dockEdge = edge;
    if (lift !== nextLift) {
      lift = nextLift;
      dock.style.setProperty("--dock-lift", `${lift}px`);
    }
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  const resize = new ResizeObserver(schedule);
  if (main) resize.observe(main);
  resize.observe(dock);
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  document.addEventListener("focusin", schedule);
  schedule();
  return () => {
    cancelAnimationFrame(frame);
    resize.disconnect();
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    document.removeEventListener("focusin", schedule);
  };
}
