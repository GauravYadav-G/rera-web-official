import Link from "next/link";
import { projects } from "@/data/projects";
import { Breadcrumbs, PageIntro, ProjectCTA } from "@/components/pages/page-shell";
import { InterfaceContent } from "@/components/build-stack/interface-content";
import { WorkVisualLink } from "@/components/work/work-visual-link";
import { BuildFilms } from "@/components/films/build-films";
import { RegistrationMarks, TextLink } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Work — Ideas made tangible", "A closer look at RERA WEB’s technical explorations, software films, and the thinking behind the build.", "/work");

export default function WorkPage() {
  return <main id="main-content" className="page-main work-directory">
    <div className="container"><Breadcrumbs items={[{ label: "Work" }]} /><PageIntro label="SELECTED BUILDS & EXPLORATIONS" index="OUR JOURNEY / JUST BEGINNING" title={<>Ideas are a start.<br />Making is the <em>difference.</em></>} description="A closer look at how we think and what we’re exploring. Small beginnings, deliberate decisions, and software with a reason to exist."><TextLink href="#work-index" down>See the study</TextLink><TextLink href="#build-shorts" down>Watch the films</TextLink></PageIntro>
      <div className="work-directory-index mono" id="work-index"><span>TECHNICAL EXPLORATIONS</span><span>{String(projects.length).padStart(2, "0")} STUDY / NO BORROWED CREDENTIALS</span></div>
      {projects.map((project) => <article className="directory-project" key={project.slug}>
        <div className="project-overline"><span className="mono">001 / {project.category}</span><span className="status-pill">{project.status}</span></div>
        <WorkVisualLink href={`/work/${project.slug}`}><div className="work-visual"><RegistrationMarks /><div className="work-visual-top mono"><span>WORKSPACE / A PRODUCT INTERFACE STUDY</span><span>ILLUSTRATIVE · CONCEPT</span></div><div className="work-interface-wrap" aria-hidden="true"><InterfaceContent expanded /></div></div></WorkVisualLink>
        <div className="directory-project-copy"><div><Link href={`/work/${project.slug}`} prefetch={false}><h2>A little less <em>friction.</em></h2></Link><div className="project-tech mono">{project.stack.map((item) => <span key={item}>{item}</span>)}</div></div><div><p>{project.description}</p><TextLink href={`/work/${project.slug}`}>Inside the study</TextLink></div></div>
      </article>)}
    </div>
    <BuildFilms />
    <section className="work-honesty"><div className="container page-split"><span className="mono">A NOTE ON WHERE WE ARE</span><div><h2>Real curiosity.<br />No borrowed <em>credibility.</em></h2><p>We’re an early-stage startup. The study above is an illustrative concept, not a client case study or a launched product. As real builds take shape, this is where their stories will live.</p><TextLink href="/about">Meet the person behind the build</TextLink></div></div></section>
    <ProjectCTA title={<>The next story<br />could be <em>yours.</em></>} />
  </main>;
}
