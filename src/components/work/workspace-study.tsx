"use client";
import { useState } from "react";
import { InterfaceContent } from "@/components/build-stack/interface-content";

export function WorkspaceStudy() {
  const [view, setView] = useState<"interface" | "wireframe">("interface");
  return <div className="workspace-study"><div className="study-toolbar"><div className="mono"><span>WORKSPACE / 001</span><span>ILLUSTRATIVE CONCEPT</span></div><div role="group" aria-label="Choose a view of the workspace study"><button type="button" aria-pressed={view === "wireframe"} onClick={() => setView("wireframe")}>Wireframe</button><button type="button" aria-pressed={view === "interface"} onClick={() => setView("interface")}>Interface</button></div></div><div className={`study-canvas ${view === "wireframe" ? "study-wireframe" : ""}`} role="img" aria-label={`Illustrative workspace ${view}. Navigation, project summaries, and a clear table of active work.`}><div aria-hidden="true" className="work-interface-wrap"><InterfaceContent expanded/></div></div><div className="study-footnote mono"><span>{view === "interface" ? "STRUCTURE, GIVEN A VISUAL LANGUAGE." : "THE STRUCTURE BEFORE THE SURFACE."}</span><span>NOT A CLIENT PROJECT</span></div></div>;
}
