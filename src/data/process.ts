export const processStages = [
  { number: "01", name: "Discover", tagline: "UNDERSTAND THE PROBLEM", description: "We start by understanding your idea, business goals, audience, and the challenges that need to be solved.", artifact: "project-brief.md", kind: "brief" },
  { number: "02", name: "Define", tagline: "DRAW THE BLUEPRINT", description: "We define the scope, technical architecture, product direction, and the foundation for development.", artifact: "system-architecture.fig", kind: "architecture" },
  { number: "03", name: "Design", tagline: "GIVE THE IDEA A SHAPE", description: "We create thoughtful user experiences, interface systems, and product interactions.", artifact: "interface-system.fig", kind: "design" },
  { number: "04", name: "Engineer", tagline: "BRING IT TO LIFE", description: "We turn the design and architecture into functional software through development, testing, and refinement.", artifact: "build.tsx", kind: "code" },
  { number: "05", name: "Evolve", tagline: "GO BEYOND THE LAUNCH", description: "We focus on deployment, improvement, and the next possibilities for the product.", artifact: "deployment.log", kind: "deploy" },
] as const;
