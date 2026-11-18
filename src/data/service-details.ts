import type { Service } from "./services";
export type ServiceDetail = {
  heading: string; accent: string; note: string; fit: string; focus: string;
  outcomes: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
};
export const serviceDetails: Record<Service["slug"], ServiceDetail> = {
  "web-development": {
    heading: "Web", accent: "development.", note: "BUILT FOR PEOPLE. ENGINEERED FOR THE WEB.", fit: "Founders launching an idea, businesses rethinking their digital presence, and products that need a better web experience.", focus: "A website should do more than look the part. It should communicate clearly, respond quickly, and make the next step feel natural.",
    outcomes: [
      { title: "Clarity from the first click.", description: "A deliberate content structure and responsive interface, shaped around what your visitors need to understand and do." },
      { title: "Performance with purpose.", description: "Attention to loading, accessibility, search fundamentals, and the details that matter on real devices." },
      { title: "Room for what’s next.", description: "Reusable components and a maintainable foundation, with content management and integrations scoped to your needs." },
    ],
    faqs: [
      { question: "Can you work on an existing website?", answer: "Yes. We can begin by reviewing the existing code, content, and goals, then discuss whether a focused improvement or a fresh build makes more sense." },
      { question: "Will the website work on mobile?", answer: "Responsive layouts and accessible interaction are part of our approach. The specific device and browser testing scope is agreed before development." },
      { question: "Do you handle hosting and ongoing updates?", answer: "We can discuss deployment, content editing, and maintenance alongside the build. Hosting costs, ongoing support, and third-party subscriptions are outlined separately in the proposal." },
    ],
  },
  "custom-software": {
    heading: "Custom", accent: "software.", note: "YOUR WORKFLOW. NOT SOMEONE ELSE’S TEMPLATE.", fit: "Teams working around disconnected tools, businesses with specific operational needs, and founders developing a focused software product.", focus: "The best software fits the way your business actually works. We start with your processes, then build only what the problem calls for.",
    outcomes: [
      { title: "The workflow comes first.", description: "A clear understanding of roles, tasks, and decisions before choosing modules or writing implementation code." },
      { title: "Connected, not complicated.", description: "Purpose-built dashboards, business logic, and APIs that give your information a useful structure." },
      { title: "A product you can evolve.", description: "Documented decisions, a considered data model, and an architecture that the next developer can understand." },
    ],
    faqs: [
      { question: "Do I need a complete specification?", answer: "No. A description of the problem and the people affected is a good beginning. We can work with you to define the workflows, scope, and priorities." },
      { question: "Can the software connect to tools we already use?", answer: "We evaluate the available APIs, permissions, and data formats before proposing integrations. Feasibility and external service costs are discussed during discovery." },
      { question: "Who owns the finished software?", answer: "Ownership, licensing, handover, and any third-party components are addressed in the written project agreement before work begins." },
    ],
  },
  "ai-automation": {
    heading: "AI &", accent: "automation.", note: "USEFUL INTELLIGENCE. A PERSON IN CONTROL.", fit: "Businesses with repetitive tasks, information-heavy workflows, or a practical use case for an intelligent assistant.", focus: "We don’t start with a model. We start with a task. Then we ask whether intelligence or automation can make it meaningfully easier.",
    outcomes: [
      { title: "A problem worth automating.", description: "A grounded look at the workflow, the data available, and where a more intelligent system could help." },
      { title: "Tools that work together.", description: "API integrations, structured tool calls, and workflow automation designed around clear inputs and useful outputs." },
      { title: "Human judgment stays involved.", description: "Review points, fallback behavior, and testing against realistic scenarios rather than treating generated output as guaranteed truth." },
    ],
    faqs: [
      { question: "Will AI be right for my business?", answer: "Not necessarily. We assess the use case first. A simpler rules-based workflow may be more appropriate, reliable, or cost-effective." },
      { question: "How do you approach sensitive data?", answer: "We discuss the data involved, provider policies, access controls, and whether information should leave your systems before proposing an AI integration." },
      { question: "Are model and API costs included?", answer: "Ongoing model, API, and platform charges depend on the providers and usage. They are identified separately in the proposal; we do not promise unlimited usage or perfect accuracy." },
    ],
  },
  "web3-blockchain": {
    heading: "Web3 &", accent: "blockchain.", note: "VERIFICATION, WITH A REASON TO EXIST.", fit: "Founders exploring decentralized products and organizations considering shared records or digital verification.", focus: "New infrastructure is useful only when it solves a real problem. We explore where transparency and shared verification genuinely add value.",
    outcomes: [
      { title: "A considered use case.", description: "An honest discussion about what decentralization changes, its limitations, and whether a conventional system is a better fit." },
      { title: "A tangible first concept.", description: "Wallet connections, application interfaces, and smart-contract concepts that make the proposed experience understandable." },
      { title: "Risks made visible.", description: "Clear boundaries around security reviews, transaction costs, external dependencies, and the responsibilities of a production release." },
    ],
    faqs: [
      { question: "Do you provide financial or investment advice?", answer: "No. Our focus is software concepts and application engineering, not investment recommendations, token value, or financial returns." },
      { question: "Are smart-contract audits included?", answer: "No independent audit is implied. Any production deployment involving real assets needs a separately agreed security review and, where appropriate, an independent specialist audit." },
      { question: "Can we begin with a prototype?", answer: "Yes. A scoped concept or test-network prototype can help evaluate the idea before considering a production system." },
    ],
  },
  "ui-ux-design": {
    heading: "UI/UX &", accent: "product design.", note: "LESS FRICTION. MORE INTENTION.", fit: "Founders shaping a new product, teams refining an existing interface, and businesses that want a more coherent digital experience.", focus: "Design is not the layer we add at the end. It is how we make a product understandable, useful, and a little more enjoyable to use.",
    outcomes: [
      { title: "A journey that makes sense.", description: "Information architecture, user flows, and wireframes that establish what the product should do before deciding how it should look." },
      { title: "An interface with intention.", description: "Typography, spacing, hierarchy, and interaction states that bring clarity and consistency to each screen." },
      { title: "Designed to be built.", description: "Reusable components, interactive prototypes, and implementation notes that connect visual decisions to real frontend engineering." },
    ],
    faqs: [
      { question: "Can you design without developing the product?", answer: "Yes. We can scope a design-only engagement, including the screens, prototype, component guidance, and handover your development team needs." },
      { question: "Can you improve just one part of an interface?", answer: "Absolutely. A focused review of a journey, onboarding flow, or important screen can be a useful starting point." },
      { question: "Are research and user testing included?", answer: "The research and testing approach is agreed during discovery. We do not claim user research has been conducted unless it is actually part of the work." },
    ],
  },
  "backend-cloud": {
    heading: "Backend &", accent: "cloud.", note: "THE QUIET WORK THAT MAKES EVERYTHING WORK.", fit: "Products needing a considered API, better data architecture, reliable deployment, or connections between existing systems.", focus: "An effortless experience relies on careful work behind the scenes. We focus on the structure, clarity, and operational details that support your product.",
    outcomes: [
      { title: "Data with a clear structure.", description: "Schemas, relationships, and access patterns designed around the information your application actually needs." },
      { title: "APIs with clear boundaries.", description: "Well-defined interfaces, input validation, authentication, and error handling that make systems easier to connect." },
      { title: "Deployment you understand.", description: "A practical deployment approach with configuration guidance, operational considerations, and explicit ownership of ongoing responsibilities." },
    ],
    faqs: [
      { question: "Can you work with an existing backend?", answer: "We can review the architecture and code, identify the constraints, and discuss a scoped improvement or integration before recommending a rebuild." },
      { question: "Do you guarantee uptime or unlimited scale?", answer: "No blanket uptime or scale guarantees are made. Reliability goals, monitoring, testing, and support arrangements are discussed for each project." },
      { question: "Who pays for cloud services?", answer: "Hosting and external service charges are typically separate from development. Account ownership, billing, and access are agreed before deployment." },
    ],
  },
};
