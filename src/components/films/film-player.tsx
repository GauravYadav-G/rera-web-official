"use client";
import Image from "next/image";
import { Play } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { Film } from "@/data/films";
import { guideOpenEvent } from "@/components/guide/guide-open-link";

export function FilmPlayer({ film }: { film: Film }) {
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const player = useRef<HTMLVideoElement>(null);
  const playButton = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!started) return;
    const video = player.current;
    if (!video) return;
    video.focus({ preventScroll: true });
    const pause = () => video.pause();
    const pauseOnHide = () => { if (document.hidden) pause(); };
    const solo = () => document.querySelectorAll<HTMLVideoElement>(".film-frame video").forEach((other) => { if (other !== video) other.pause(); });
    video.addEventListener("play", solo);
    document.addEventListener(guideOpenEvent, pause);
    document.addEventListener("visibilitychange", pauseOnHide);
    void video.play().catch(() => {});
    const observer = new IntersectionObserver(([entry]) => {
      if (entry && !entry.isIntersecting && document.fullscreenElement !== video && document.pictureInPictureElement !== video) pause();
    });
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.removeEventListener("play", solo);
      document.removeEventListener(guideOpenEvent, pause);
      document.removeEventListener("visibilitychange", pauseOnHide);
      pause();
    };
  }, [started]);

  function reset() {
    setStarted(false);
    setReady(false);
    setFailed(false);
    requestAnimationFrame(() => playButton.current?.focus({ preventScroll: true }));
  }

  return <div className="film-player" data-film={film.id}>
    <div className="film-frame">
      {started ? <video ref={player} src={film.file} poster={film.poster} preload="metadata" playsInline controls tabIndex={0} aria-label={`${film.title} — silent film`} aria-describedby={id} onLoadedData={() => setReady(true)} onError={() => setFailed(true)} /> :
      <button ref={playButton} type="button" className="film-poster-trigger" aria-label={`Play ${film.title}`} onClick={() => setStarted(true)}>
        <Image src={film.poster} width={1152} height={648} alt="" sizes="(max-width: 767px) 92vw, (max-width: 1100px) 57vw, 860px" />
        <span className="film-play-icon" aria-hidden="true"><Play size={21} strokeWidth={1.6} /></span>
        <span className="film-poster-label mono">Play {film.title}</span>
        <span className="film-poster-duration mono" aria-hidden="true" data-time={film.duration} />
      </button>}
      {started && !ready && !failed && <span className="film-loading mono" role="status">LOADING FILM…</span>}
    </div>
    {failed && <p className="film-failure" role="status">The film couldn’t load. Try returning to the poster, or read the visual description below.</p>}
    <div className="film-controls-line">
      <details className="film-transcript"><summary>Visual description <span aria-hidden="true">+</span></summary><p id={id}>{film.transcript}</p></details>
      {started && <button type="button" className="film-return" onClick={reset}>Back to poster <span aria-hidden="true">↖</span></button>}
    </div>
  </div>;
}
