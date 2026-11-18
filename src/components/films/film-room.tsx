"use client";
import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import type { Film } from "@/data/films";
import { FilmPlayer } from "./film-player";

export function FilmRoom({ films }: { films: readonly Film[] }) {
  const [selected, setSelected] = useState(0);
  const room = useRef<HTMLDivElement>(null);
  const film = films[selected];
  const hasIndex = films.length > 1;

  useEffect(() => {
    function fromHash() {
      const index = films.findIndex((entry) => window.location.hash === `#${entry.id}`);
      if (index >= 0) setSelected(index);
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [films]);

  function choose(index: number) {
    if (selected === index) return;
    room.current?.querySelector("video")?.pause();
    setSelected(index);
    const view = room.current?.querySelector(".screening-view");
    if (view && window.matchMedia("(max-width: 767px)").matches && view.getBoundingClientRect().bottom < 100) {
      view.scrollIntoView({ block: "nearest", behavior: "instant" });
    }
  }

  return <div className="screening-room" ref={room}>
    <div className="screening-layout">
      <div className="screening-view">
        <div className="screening-topline mono"><span>SCREENING / {film.number}</span><span>{film.category}</span></div>
        <FilmPlayer key={film.id} film={film} />
      </div>
      <div className="screening-aside">
        {hasIndex && <div className="screening-index" role="group" aria-label="Choose a short film"><div className="screening-index-label mono"><span>THE FILM INDEX</span><span>{String(films.length).padStart(2, "0")} SHORTS</span></div>{films.map((entry, index) => <button key={entry.id} type="button" aria-pressed={selected === index} onClick={() => choose(index)}>
          <span className="mono screening-index-number">{entry.number}</span><span className="screening-index-description"><span>{entry.title}</span><small>{entry.discipline} / {entry.duration}</small></span><Play size={15} strokeWidth={1.5} aria-hidden="true" />
        </button>)}</div>}
        <div className="screening-note"><div aria-live="polite" aria-atomic="true"><span className="mono">VIEWING NOTES / {film.number}</span><p>{film.description}</p></div>{film.credits && <details className="screening-credits" key={film.id}><summary>Source credits <span aria-hidden="true">+</span></summary><ul>{film.credits.map((credit) => <li key={credit.href}><a href={credit.href} target="_blank" rel="noopener noreferrer">{credit.kind}: {credit.name} <span aria-hidden="true">↗</span></a></li>)}</ul></details>}</div>
      </div>
    </div>
  </div>;
}
