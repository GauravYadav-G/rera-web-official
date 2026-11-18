import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { Breadcrumbs, PageIntro, ProjectCTA } from "@/components/pages/page-shell";
import { WorkspaceStudy } from "@/components/work/workspace-study";
import { BuildFilms } from "@/components/films/build-films";
import { SectionLabel, TextLink } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return projects.map((project) => ({ slug: project.slug })); }
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return project ? pageMetadata("Workspace — an interface study", project.description, `/work/${slug}`) : {};
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return <main id="main-content" className="page-main case-study-page"><div className="container"><Breadcrumbs items={[{ label: "Work", href: "/work" }, { label: "Workspace study" }]}/><PageIntro label="WORKSPACE / A PRODUCT INTERFACE STUDY" index="EXPLORATION 001" title={<>A little less<br/><em>friction.</em></>} description="What if the tools you use every day made the important things a little easier to see? An illustrative exploration of focus, structure, and a more considered workspace."><span className="status-pill">Technical exploration</span></PageIntro><div className="case-meta"><div><span className="mono">DISCIPLINE</span><p>Product interface design</p></div><div><span className="mono">EXPLORING</span><p>Hierarchy · Components · Workflow</p></div><div><span className="mono">STATUS</span><p>Illustrative concept — not a client build</p></div></div><WorkspaceStudy/>
    <section className="page-section"><SectionLabel suffix="THE QUESTION BEFORE THE INTERFACE">THE STARTING POINT</SectionLabel><div className="page-split"><h2 className="page-subheading">More focus.<br/>Less <em>friction.</em></h2><div className="body-copy"><p>A workspace can quickly become another thing to manage. This study asks how a small set of deliberate decisions might bring the important work back into focus.</p><p>The aim isn’t to put every possible feature on one screen. It’s to give the user a clear place to begin, a useful view of current work, and an understandable next action.</p></div></div></section>
    <section className="case-decisions"><SectionLabel suffix="SMALL DECISIONS. SHARED INTENTION.">THREE DESIGN DECISIONS</SectionLabel>{[
      ["Navigation that stays out of the way.", "A persistent sidebar creates a clear mental model. The main surface stays available for the task, rather than competing navigation."],
      ["An overview with a reason to exist.", "Summary information establishes context. The active-project table gives that context an immediate connection to useful work."],
      ["Consistency in the smallest details.", "Shared spacing, typography, and component states make the interface feel like one system instead of a collection of disconnected screens."],
    ].map(([title, description], index) => <article key={title}><span className="mono">0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}</section>
    <div className="case-disclosure"><span className="mono">A CLEAR DISTINCTION</span><p>All workspace content, project names, and activity shown are illustrative. This is a visual concept made for the RERA WEB website. It is not a launched SaaS product, a commissioned client project, or evidence of measured business results.</p><TextLink href="/services/ui-ux-design">Explore product design</TextLink></div><div className="case-back"><TextLink href="/work">Back to all work</TextLink></div></div><BuildFilms variant="study" /><ProjectCTA service="UI/UX Design" title={<>Your challenge.<br/>A fresh <em>perspective.</em></>}/></main>;
}
