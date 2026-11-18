"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main id="main-content" className="not-found container"><span className="mono muted">SOMETHING NEEDS ANOTHER LOOK</span><h1 className="display-l">A small<br/><em>interruption.</em></h1><p className="body-copy">This page couldn’t finish loading. You can try again, or return to the beginning. No project submission has been confirmed by this message.</p><div style={{ display: "flex", gap: 25, alignItems: "center", flexWrap: "wrap", marginBottom: 50 }}><button className="button" onClick={reset}><span>Try again</span><span aria-hidden="true">↗</span></button><Link href="/" className="text-link"><span>Back to the beginning</span><span aria-hidden="true">↗</span></Link></div></main>;
}
