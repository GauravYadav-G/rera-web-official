import type { CSSProperties } from "react";

const cellCount = 48;

export function DitherSeam({ tone = "paper" }: { tone?: "paper" | "ink" }) {
  return <div className={`dither-seam dither-${tone}`} aria-hidden="true">{Array.from({ length: cellCount }, (_, index) => <i key={index} style={{ "--cell": index } as CSSProperties} />)}</div>;
}

export function ChapterTransition({ to }: { to: "paper" | "ink" }) {
  return (
    <div className={`chapter-transition with-dither to-${to}`} aria-hidden="true">
      <DitherSeam tone={to} />
    </div>
  );
}
