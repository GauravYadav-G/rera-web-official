"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: { sitekey: string; theme: string; action: string; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void }) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}

export function Turnstile({ onToken, resetKey }: { onToken: (token: string) => void; resetKey: number }) {
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const container = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const callback = useRef(onToken);
  const [ready, setReady] = useState(false);
  useEffect(() => { callback.current = onToken; }, [onToken]);
  useEffect(() => {
    if (!ready || !sitekey || !container.current || !window.turnstile) return;
    widget.current = window.turnstile.render(container.current, { sitekey, theme: "dark", action: "contact", callback: (token) => callback.current(token), "expired-callback": () => callback.current(""), "error-callback": () => callback.current("") });
    return () => { if (widget.current && window.turnstile) window.turnstile.remove(widget.current); widget.current = null; };
  }, [ready, sitekey]);
  useEffect(() => { if (widget.current && window.turnstile) { window.turnstile.reset(widget.current); callback.current(""); } }, [resetKey]);
  if (!sitekey) return null;
  return <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={() => setReady(true)} /><div className="turnstile-slot" ref={container} aria-label="Spam protection verification" /></>;
}
