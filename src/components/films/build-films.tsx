import { films, type Film } from "@/data/films";
import { ChapterTransition } from "@/components/dither-seam";
import { RegistrationMarks, SectionLabel, TextLink } from "@/components/ui";
import { FilmRoom } from "./film-room";

export function BuildFilms({ variant = "collection" }: { variant?: "home" | "collection" | "study" }) {
  const entries: readonly Film[] = variant === "study" ? [films[0]] : films;
  const title = variant === "study" ? <>The study,<br />in <em>motion.</em></> : <>The build,<br />in <em>motion.</em></>;
  return <>
    <ChapterTransition to="paper" />
    <section id="build-shorts" className={`build-films paper-surface build-films-${variant}`} data-rail-tone="paper" aria-labelledby="build-films-title">
      <div className="film-deep-links" aria-hidden="true">{entries.map((film) => <span key={film.id} id={film.id} />)}</div>
      <div className="container">
        <SectionLabel suffix="ON DEMAND / NO AUDIO">BUILD SHORTS</SectionLabel>
        <div className="film-section-intro"><h2 id="build-films-title" className="display-l">{title}</h2><div><p>{variant === "study" ? "See the interface take shape, from the first wireframe to the details that make a workspace clearer." : "A closer look at the craft: a product interface takes shape, a toolchain runs, and Patch takes a turn in the studio."}</p>{variant === "home" && <TextLink href="/work#build-shorts">See the work behind the films</TextLink>}</div></div>
        <div className="screening-frame"><RegistrationMarks /><FilmRoom films={entries} /></div>
        <noscript>
          <style>{`.screening-frame{display:none!important}`}</style>
          <div className="film-nojs">{entries.map((film) => <article key={film.id}>
            <span className="mono eyebrow">{film.number} / {film.category}</span><h3>{film.title}</h3><p>{film.description}</p><video src={film.file} poster={film.poster} controls playsInline preload="none" aria-label={`${film.title} — silent film`} /><details><summary>Visual description</summary><p>{film.transcript}</p></details>{film.credits && <ul>{film.credits.map((credit) => <li key={credit.href}><a href={credit.href}>{credit.kind}: {credit.name}</a></li>)}</ul>}
          </article>)}</div>
        </noscript>
      </div>
    </section>
    <ChapterTransition to="ink" />
  </>;
}
