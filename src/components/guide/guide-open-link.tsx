"use client";
import type { MouseEvent, ReactNode } from "react";

export const guideOpenEvent = "rera:guide-open";
export const guidePanelId = "rera-site-guide";

/** A working page link without JS, an in-place shortcut when the guide is mounted. */
export function GuideOpenLink({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  function open(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return;
    const request = new CustomEvent(guideOpenEvent, { cancelable: true, detail: event.currentTarget });
    if (!document.dispatchEvent(request)) event.preventDefault();
  }
  return <a href="/guide" onClick={open} className={className} aria-label={label} aria-haspopup="dialog" aria-controls={guidePanelId}>{children}</a>;
}
