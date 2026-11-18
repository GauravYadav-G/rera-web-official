"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowUpRight, CornerDownRight, Search, X } from "lucide-react";
import { getGuideAnchors, getGuideContext, guide, guideCapabilities, guidePages, searchGuide, type GuideDestination } from "@/data/guide";
import { site } from "@/data/site";
import { GuideOpenLink, guideOpenEvent, guidePanelId } from "./guide-open-link";
import { watchDockClearance } from "./dock-clearance";

type Segment = "suggested" | "pages" | "capabilities";
type Recent = { href: string; label: string };
const RECENT_KEY = "rera-guide-recent";
const SEGMENTS: { key: Segment; label: string }[] = [
  { key: "suggested", label: "For you" },
  { key: "pages", label: "Pages" },
  { key: "capabilities", label: "Capabilities" },
];

function readRecents(): Recent[] {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is Recent => typeof (item as Recent)?.href === "string" && typeof (item as Recent)?.label === "string").slice(0, 4) : [];
  } catch { return []; }
}

function writeRecents(list: Recent[]) {
  try { sessionStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 4))); } catch { /* Private mode: recents are a convenience, not a requirement. */ }
}

/** Label a visited path so it can be offered again as a recent destination. */
function describePath(pathname: string): string | null {
  const page = guidePages.find((item) => item.href === pathname || item.meta === pathname);
  if (page) return page.label;
  if (pathname.startsWith("/services/")) return pathname.split("/")[2]?.replace(/-/g, " ") ?? null;
  if (pathname.startsWith("/work/")) return "Workspace study";
  return null;
}

export function SiteGuide() {
  const pathname = usePathname();
  return <GuideDock key={pathname} pathname={pathname} />;
}

function GuideDock({ pathname }: { pathname: string }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const findField = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const navigating = useRef(false);
  const id = useId();
  const [open, setOpen] = useState(false);
  const [segment, setSegment] = useState<Segment>("suggested");
  const [query, setQuery] = useState("");
  const [recents, setRecents] = useState<Recent[]>([]);

  const context = getGuideContext(pathname);
  const anchors = useMemo(() => getGuideAnchors(pathname), [pathname]);
  const searching = query.trim().length > 0;

  const entries = useMemo<GuideDestination[]>(() => {
    if (searching) return searchGuide(query, pathname);
    if (segment === "pages") return guidePages;
    if (segment === "capabilities") return guideCapabilities;
    const seen = new Set<string>();
    return [...context.links, ...anchors].filter((item) => (seen.has(item.href) ? false : (seen.add(item.href), true)));
  }, [searching, query, pathname, segment, context.links, anchors]);

  const counts: Record<Segment, number> = {
    suggested: [...new Set([...context.links, ...anchors].map((item) => item.href))].length,
    pages: guidePages.length,
    capabilities: guideCapabilities.length,
  };

  // Remember where the visitor has been, so Patch can offer it again.
  useEffect(() => {
    const label = describePath(pathname);
    if (!label) return;
    setRecents(readRecents().filter((item) => item.href !== pathname));
    const next = [{ href: pathname, label }, ...readRecents().filter((item) => item.href !== pathname)];
    writeRecents(next);
  }, [pathname]);

  useEffect(() => {
    const openDialog = (source: HTMLElement | null) => {
      const panel = dialog.current;
      if (!panel || typeof panel.showModal !== "function" || panel.open) return;
      returnFocus.current = source;
      navigating.current = false;
      panel.showModal();
      setOpen(true);
      closeButton.current?.focus({ preventScroll: true });
    };
    const onRequest = (event: Event) => {
      event.preventDefault();
      openDialog((event as CustomEvent<HTMLElement>).detail || null);
    };
    // "g" opens the guide from anywhere, except while typing or in another dialog.
    const onShortcut = (event: globalThis.KeyboardEvent) => {
      if (event.key.toLowerCase() !== "g" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;
      if (dialog.current?.open || document.querySelector(".mobile-menu[role='dialog']")) return;
      event.preventDefault();
      openDialog(target);
    };
    const dock = document.querySelector<HTMLElement>(".guide-dock");
    const stopClearance = dock ? watchDockClearance(dock) : undefined;
    document.addEventListener(guideOpenEvent, onRequest);
    document.addEventListener("keydown", onShortcut);
    return () => {
      stopClearance?.();
      document.removeEventListener(guideOpenEvent, onRequest);
      document.removeEventListener("keydown", onShortcut);
    };
  }, []);

  function onClose() {
    setOpen(false);
    setQuery("");
    if (!navigating.current && returnFocus.current?.isConnected) returnFocus.current.focus({ preventScroll: true });
    returnFocus.current = null;
  }

  function leave() { navigating.current = true; dialog.current?.close(); }

  function jumpTo(href: string) {
    leave();
    if (href.startsWith("#")) {
      requestAnimationFrame(() => document.querySelector(href)?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
      return;
    }
    router.push(href);
  }

  function submitFind(event: FormEvent) {
    event.preventDefault();
    if (entries.length > 0) jumpTo(entries[0].href);
  }

  function isHere(href: string) {
    if (href.startsWith("#")) return false;
    const base = href.split("#")[0];
    return base === pathname || (base === "/" && pathname === "/");
  }

  function onDialogKey(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Tab") {
      const items = dialog.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], input");
      if (!items?.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); return; }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); return; }
      return;
    }
    if (event.key === "/" && document.activeElement !== findField.current) {
      event.preventDefault();
      findField.current?.focus();
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const links = Array.from(list.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []);
    if (links.length === 0) return;
    event.preventDefault();
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next = event.key === "ArrowDown"
      ? index < 0 ? 0 : (index + 1) % links.length
      : index < 0 ? links.length - 1 : (index - 1 + links.length) % links.length;
    links[next].focus();
    links[next].scrollIntoView({ block: "nearest" });
  }

  const visibleRecents = recents.filter((item) => item.href !== pathname).slice(0, 3);

  return <>
    <GuideOpenLink className="guide-dock" label="Patch site guide">
      <span className="guide-dock-avatar"><Image src="/images/patch/avatar.webp" width={84} height={84} alt="" unoptimized /></span>
      <span className="guide-dock-label"><span className="mono guide-dock-code" aria-hidden="true"><i /></span><span>Patch site guide</span></span>
      <span className="guide-dock-key mono" aria-hidden="true" />
      <span className="guide-dock-mobile-label">Guide</span><ArrowUpRight className="guide-dock-arrow" size={14} strokeWidth={1.5} aria-hidden="true" />
    </GuideOpenLink>

    <dialog className="guide-dialog" ref={dialog} id={guidePanelId} aria-labelledby="guide-dialog-title" aria-describedby="guide-dialog-description" onClose={onClose} onKeyDown={onDialogKey} onCancel={(event) => { if (searching) { event.preventDefault(); setQuery(""); findField.current?.focus(); } }} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="guide-dialog-inner">
        <div className="guide-dialog-kicker">
          <span className="mono"><i aria-hidden="true" /> RERA WEB / SITE GUIDE</span>
          <span className="guide-version mono">{guide.version}</span>
          <button ref={closeButton} type="button" aria-label="Close site guide" onClick={() => dialog.current?.close()}><X size={21} strokeWidth={1.5} /></button>
        </div>

        <div className="guide-dialog-intro">
          <div className="guide-dialog-portrait" aria-hidden="true">{open && <Image src={guide.portrait} alt="" width={1080} height={1080} sizes="122px" />}</div>
          <div>
            <div className="mono guide-location">YOU’RE ON / {context.location}</div>
            <h2 id="guide-dialog-title">Hi, I’m <em>Patch.</em></h2>
            <p id="guide-dialog-description">{context.prompt}</p>
          </div>
        </div>

        <form className="guide-find" onSubmit={submitFind} role="search">
          <Search size={16} strokeWidth={1.5} aria-hidden="true" />
          <label className="sr-only" htmlFor={`${id}-find`}>Find a page, chapter or capability</label>
          <input id={`${id}-find`} ref={findField} type="search" value={query} autoComplete="off" placeholder="Find a page, chapter or capability…" aria-describedby={`${id}-count`} onChange={(event) => setQuery(event.target.value)} />
          {searching && <button type="button" className="guide-find-clear" aria-label="Clear the guide search" onClick={() => { setQuery(""); findField.current?.focus(); }}>Clear <span aria-hidden="true">×</span></button>}
          {!searching && <kbd className="guide-find-key" aria-hidden="true">/</kbd>}
        </form>

        <div className="guide-segments" role="group" aria-label="Choose a guide list">
          {SEGMENTS.map((item) => <button key={item.key} type="button" aria-pressed={!searching && segment === item.key} onClick={() => { setSegment(item.key); setQuery(""); }}>
            <span>{item.label}</span><span className="mono">{counts[item.key]}</span>
          </button>)}
        </div>

        <nav className="guide-shortcuts guide-list" ref={list} aria-label={searching ? `Search results for ${query.trim()}` : `${SEGMENTS.find((item) => item.key === segment)?.label} destinations`}>
          {entries.map((item, index) => <Link key={`${item.href}-${index}`} href={item.href} prefetch={false} onClick={leave} aria-current={isHere(item.href) ? "page" : undefined}>
            <span className="mono guide-item-index">{item.meta ?? String(index + 1).padStart(2, "0")}</span>
            <span className="guide-item-copy"><span>{item.label}{isHere(item.href) && <em className="guide-here mono">You are here</em>}</span><small>{item.note}</small></span>
            {item.group === "This page" ? <CornerDownRight size={17} strokeWidth={1.5} aria-hidden="true" /> : <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden="true" />}
          </Link>)}
          {entries.length === 0 && <p className="guide-empty">Nothing matches “{query.trim()}”. Try “design”, “AI”, “process”, “terms”, or open the <Link href="/guide" prefetch={false} onClick={leave}>full site index</Link>.</p>}
        </nav>

        <p className="guide-results mono" id={`${id}-count`} role="status">{searching ? `${entries.length} ${entries.length === 1 ? "MATCH" : "MATCHES"} FOR “${query.trim().toUpperCase()}”` : `${entries.length} ${segment === "capabilities" ? "CAPABILITIES" : segment === "pages" ? "PAGES" : "SUGGESTIONS"}${anchors.length > 0 && segment === "suggested" ? ` · ${anchors.length} ON THIS PAGE` : ""}`}</p>

        {!searching && visibleRecents.length > 0 && <div className="guide-recents"><span className="mono">RECENT</span>{visibleRecents.map((item) => <Link key={item.href} href={item.href} prefetch={false} onClick={leave}>{item.label}</Link>)}</div>}

        <div className="guide-dialog-footer">
          <span className="mono">FOUNDED BY {site.foundersLabel.toUpperCase()}</span>
          <Link href={pathname === "/guide" ? "#guide-index" : "/guide"} prefetch={false} onClick={leave}><CornerDownRight size={14} strokeWidth={1.5} aria-hidden="true" /> Full site guide</Link>
        </div>
        <div className="guide-keys mono" aria-hidden="true"><span>G OPEN</span><span>/ FIND</span><span>↑↓ MOVE</span><span>ESC CLOSE</span><span className="guide-keys-id">GUIDE UNIT / {guide.identifier}</span></div>
        <p className="sr-only">Keyboard shortcuts: press G to open this guide on any page, forward slash to search, arrow keys to move through results, Enter to open the first result, and Escape to close.</p>
      </div>
    </dialog>
  </>;
}
