"use client";
import Image from "next/image";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { RegistrationMarks } from "@/components/ui";
import { guide } from "@/data/guide";

const angleCount = 16;
const sprite = "/images/patch/turntable.webp";
const wrap = (index: number) => (index + angleCount) % angleCount;

export function PatchTurntable({ id }: { id?: string }) {
  const [angle, setAngle] = useState(0);
  const [requested, setRequested] = useState(false);
  const [status, setStatus] = useState<"idle" | "ready" | "error">("idle");
  const drag = useRef<{ id: number; x: number; angle: number } | null>(null);
  const imageAlt = "Patch, an original ceramic desktop robot with a friendly display, a graphite frame, and an ember-colored key.";

  useEffect(() => {
    if (!requested) return;
    let mounted = true;
    const asset = new window.Image();
    const ready = () => { if (mounted) setStatus("ready"); };
    const failed = () => { if (mounted) setStatus("error"); };
    asset.onload = () => { if (typeof asset.decode === "function") void asset.decode().then(ready, failed); else ready(); };
    asset.onerror = failed;
    asset.src = sprite;
    return () => { mounted = false; asset.onload = null; asset.onerror = null; };
  }, [requested]);

  function turn(amount: number) {
    setRequested(true);
    setAngle((current) => wrap(current + amount));
  }
  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0 || status === "error") return;
    drag.current = { x: event.clientX, id: event.pointerId, angle };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (!start || start.id !== event.pointerId) return;
    const amount = Math.round((event.clientX - start.x) / 23);
    if (amount !== 0) setRequested(true);
    setAngle(wrap((start.angle + amount) % angleCount));
  }
  function endDrag() { drag.current = null; }
  const ready = status === "ready";
  const rotated = ready && angle !== 0;
  const label = `ANGLE ${String(angle + 1).padStart(2, "0")} / ${angleCount}`;

  return <figure className="patch-turntable" id={id} data-angle={angle} data-ready={ready}>
    <RegistrationMarks />
    <div className="patch-stage-heading mono"><span>FIG. 07 / GUIDE UNIT</span><span>RW — 01</span></div>
    <div className="patch-stage" role="img" aria-label={imageAlt} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag}>
      <div className="patch-stage-grid" aria-hidden="true"><span /><span /><span /></div>
      <div className="patch-stage-number" aria-hidden="true" />
      <div className="patch-plinth" aria-hidden="true" />
      <span className="patch-stage-coordinate mono" aria-hidden="true">DATUM / 0.00</span>
      <span className="patch-stage-label mono" aria-hidden="true"><span>01</span> / CERAMIC HOUSING</span>
      <span className="patch-stage-label patch-label-bottom mono" aria-hidden="true"><span>02</span> / DESK GUIDE</span>
      <div className="patch-stage-image" aria-hidden="true">
        <Image src={guide.portrait} width={1000} height={1000} alt="" sizes="(max-width: 767px) 76vw, (max-width: 950px) 44vw, 500px" draggable={false} className={rotated ? "patch-poster-hidden" : ""} />
        {rotated && <div className="patch-sprite" style={{ backgroundImage: `url(${sprite})`, backgroundPosition: `${(angle % 4) * 100 / 3}% ${Math.floor(angle / 4) * 100 / 3}%` }} />}
      </div>
    </div>
    <figcaption className="patch-stage-footer">
      <div className="patch-stage-status"><span className="mono" aria-live="polite">{status === "error" ? "STILL VIEW" : requested && !ready ? "LOADING ANGLES…" : label}</span><span>{status === "error" ? "The turntable didn’t load." : "Drag or use the arrow buttons"}</span></div>
      <div className="patch-turn-controls" role="group" aria-label="Rotate the 3D render">
        <button type="button" aria-label="Rotate Patch left" onClick={() => turn(-1)} disabled={status === "error"}><ChevronLeft size={18} strokeWidth={1.5} /></button>
        <button type="button" aria-label="Reset Patch to front" onClick={() => setAngle(0)} disabled={angle === 0 || status === "error"}><RotateCcw size={15} strokeWidth={1.5} /></button>
        <button type="button" aria-label="Rotate Patch right" onClick={() => turn(1)} disabled={status === "error"}><ChevronRight size={18} strokeWidth={1.5} /></button>
      </div>
    </figcaption>
    <noscript><style>{`.patch-turn-controls,.patch-stage-status>span:last-child{display:none}.patch-stage{cursor:default}`}</style></noscript>
  </figure>;
}
