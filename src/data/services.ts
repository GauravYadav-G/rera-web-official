export const serviceNames = ["Web Development", "Custom Software", "AI & Automation", "Web3 & Blockchain", "UI/UX Design", "Backend & Cloud", "Other"] as const;

export const services = [
  {
    number: "01", slug: "web-development", name: "Web development", formName: "Web Development", discipline: "INTERFACE", technology: "REACT / NEXT.JS",
    tagline: "Digital experiences built for the modern web.",
    description: "We create responsive, high-performance websites and web applications designed to communicate clearly, work seamlessly, and grow with your business.",
    capabilities: ["Business and corporate websites", "Custom web applications", "E-commerce development", "Frontend engineering", "React and Next.js development", "Performance optimization"],
    approach: "A clear message. A thoughtful interface. A dependable foundation. We bring design and development together, with attention to the small details that make the web feel effortless.",
  },
  {
    number: "02", slug: "custom-software", name: "Custom software", formName: "Custom Software", discipline: "LOGIC", technology: "TYPESCRIPT / APIS",
    tagline: "Software that works around your business.",
    description: "We develop tailored software solutions that help businesses simplify operations, improve workflows, and solve specific challenges.",
    capabilities: ["SaaS applications", "Business management systems", "CRM and ERP solutions", "Custom dashboards", "API development", "Database architecture"],
    approach: "Your workflows should shape your software, not the other way around. We begin with how your business operates and work toward a focused, maintainable product that helps it work better.",
  },
  {
    number: "03", slug: "ai-automation", name: "AI & automation", formName: "AI & Automation", discipline: "INTELLIGENCE", technology: "AI / CONNECTED WORKFLOWS",
    tagline: "Make your digital systems work smarter.",
    description: "We explore intelligent applications and automation to help businesses reduce repetitive processes and create better digital experiences.",
    capabilities: ["AI-powered applications", "Intelligent assistants", "AI API integration", "Workflow automation", "Machine learning applications", "Data-driven tools"],
    approach: "Useful intelligence begins with a useful problem. We look for practical opportunities to connect your tools, support your decisions, and take repetitive work out of the day, with a person in control.",
  },
  {
    number: "04", slug: "web3-blockchain", name: "Web3 & blockchain", formName: "Web3 & Blockchain", discipline: "VERIFICATION", technology: "SMART CONTRACTS / WEB3",
    tagline: "Exploring the next generation of digital infrastructure.",
    description: "We develop decentralized application concepts and blockchain-based solutions that explore transparency, verification, and connected digital systems.",
    capabilities: ["Smart contracts", "Blockchain applications", "Web3 integration", "Decentralized applications", "Wallet integration", "Digital verification systems"],
    approach: "We approach decentralized technology with curiosity and care. The starting point is whether shared verification solves a real need, followed by a clearly scoped concept and a transparent explanation of its trade-offs.",
  },
  {
    number: "05", slug: "ui-ux-design", name: "UI/UX & product design", formName: "UI/UX Design", discipline: "DESIGN", technology: "INTERFACES / DESIGN SYSTEMS",
    tagline: "Technology should feel as good as it works.",
    description: "We design purposeful digital interfaces that combine visual clarity, thoughtful interaction, and practical usability.",
    capabilities: ["UI design", "UX design", "Interactive prototypes", "Product interfaces", "Design systems", "Frontend experience engineering"],
    approach: "We work from the user’s task outward: understand the journey, simplify the structure, and make each interaction feel considered. Visual craft and usable engineering belong in the same conversation.",
  },
  {
    number: "06", slug: "backend-cloud", name: "Backend & cloud", formName: "Backend & Cloud", discipline: "FOUNDATION", technology: "NODE.JS / POSTGRESQL / CLOUD",
    tagline: "The infrastructure behind every great experience.",
    description: "We create the technical foundations that power reliable applications, connected systems, and growing digital products.",
    capabilities: ["Backend development", "APIs", "Database systems", "Cloud deployment", "Application infrastructure", "Performance optimization"],
    approach: "Good foundations make the rest of a product possible. We focus on clear data models, well-defined APIs, sensible deployment, and a system your next developer can understand.",
  },
] as const;

export type Service = (typeof services)[number];
