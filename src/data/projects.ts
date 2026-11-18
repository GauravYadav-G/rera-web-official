export type Project = {
  slug: string;
  name: string;
  category: string;
  description: string;
  stack: string[];
  status: "Live" | "Client project" | "Internal experiment" | "Concept" | "Technical exploration" | "In development";
  illustrative: boolean;
  liveUrl: string | null;
};

export const projects: Project[] = [
  {
    slug: "workspace-study",
    name: "A little less friction.",
    category: "WORKSPACE / INTERFACE STUDY",
    description: "An illustrative operations workspace exploring how thoughtful interfaces can make complex work feel simple. A concept, not a client project.",
    stack: ["INTERFACE DESIGN", "REACT", "TYPESCRIPT"],
    status: "Technical exploration",
    illustrative: true,
    liveUrl: null,
  },
];
