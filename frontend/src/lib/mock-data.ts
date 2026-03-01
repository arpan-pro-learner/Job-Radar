export interface Founder {
    name: string;
    role: string;
    avatar: string;
    bio: string;
}

export interface Role {
    title: string;
    location: string;
    type: string;
    salary: string;
}

export interface Startup {
    id: string;
    name: string;
    logo: string;
    websiteUrl: string;
    shortDescription: string;
    fullDescription: string;
    batch?: string;
    industry: string;
    location: string;
    teamSize: string;
    funding: string;
    hiringScore: number;
    remoteScore: number;
    growthScore: number;
    aiSummary: string;
    outreachAngle: string;
    techStack: string[];
    founders: Founder[];
    openRoles: Role[];
    images: string[];
    careersUrl?: string;
    createdAt?: string;
}

export const MOCK_STARTUPS: Startup[] = [
  {
    id: "1",
    name: "Anthropic",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Anthropic&backgroundColor=d97757",
    websiteUrl: "https://www.anthropic.com",
    shortDescription: "AI research and products that put safety at the frontier.",
    batch: "Series D",
    hiringScore: 98,
    remoteScore: 60,
    growthScore: 99,
    aiSummary: "Competing with OpenAI. Massive funding. Hiring purely exceptional talent.",
    outreachAngle: "Discuss their Constitutional AI paper.",
    fullDescription: "Anthropic is an AI safety and research company that's working to build reliable, interpretable, and steerable AI systems. Their flagship model, Claude, is a leading LLM.",
    industry: "Artificial Intelligence",
    location: "San Francisco",
    teamSize: "201-500",
    funding: "Series D",
    techStack: ["Python", "PyTorch", "Rust", "React", "Kubernetes"],
    founders: [
        { name: "Dario Amodei", role: "CEO", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dario", bio: "Ex-OpenAI VP of Research" },
        { name: "Daniela Amodei", role: "President", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniela", bio: "Ex-OpenAI VP of Safety" }
    ],
    openRoles: [
        { title: "Research Engineer", location: "San Francisco", type: "Full-time", salary: "$300k - $500k" },
        { title: "Member of Technical Staff", location: "San Francisco", type: "Full-time", salary: "$250k - $400k" }
    ],
    images: ["/mock/anthropic-1.jpg", "/mock/anthropic-2.jpg"],
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Kaito",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Kaito&backgroundColor=0f172a",
    websiteUrl: "https://kaito.xyz",
    shortDescription: "Decentralized search engine powered by LLMs and community indexing.",
    batch: "Seed",
    hiringScore: 85,
    remoteScore: 90,
    growthScore: 95,
    aiSummary: "Explosive user growth in Web3 communities. looking for full-stack devs with crypto interest.",
    outreachAngle: "Ask about their indexing challenges.",
    fullDescription: "Kaito is building a search engine for the decentralized web. They combine LLMs with crypto-native data sources to provide real-time insights that traditional search engines miss.",
    industry: "Web3 / Search",
    location: "Remote",
    teamSize: "11-50",
    funding: "Seed",
    techStack: ["TypeScript", "Next.js", "Solidity", "Go", "Pinecone"],
    founders: [
        { name: "Yu Hu", role: "CEO", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yu", bio: "Serial Entrepreneur" }
    ],
    openRoles: [
        { title: "Full Stack Engineer", location: "Remote", type: "Full-time", salary: "$140k - $200k" }
    ],
    images: [],
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "Resend",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Resend&backgroundColor=000000",
    websiteUrl: "https://resend.com",
    shortDescription: "Email API for developers. The Stripe of Email.",
    batch: "YC W23",
    hiringScore: 78,
    remoteScore: 100,
    growthScore: 92,
    aiSummary: "Extremely detailed docs and developer experience focus. Hiring frontend infra roles.",
    outreachAngle: "Compliment their documentation style.",
    fullDescription: "Resend is re-imagining email for developers. They focus on providing the best possible developer experience with a modern API and React-based email templates.",
    industry: "DevTools",
    location: "Remote",
    teamSize: "11-50",
    funding: "Series A",
    techStack: ["React", "Next.js", "Go", "Postgres", "AWS"],
    founders: [
        { name: "Zeno Rocha", role: "CEO", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zeno", bio: "Creator of Dracula Theme" }
    ],
    openRoles: [],
    images: []
  },
  {
    id: "4",
    name: "Linear",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Linear&backgroundColor=5e6ad2",
    websiteUrl: "https://linear.app",
    shortDescription: "The issue tracking tool you'll actually enjoy using.",
    batch: "Series B",
    hiringScore: 60,
    remoteScore: 80,
    growthScore: 85,
    aiSummary: "High bar for design engineering. Slower hiring pace but high quality roles.",
    outreachAngle: "Showcase a polished UI interaction you built.",
    fullDescription: "Linear is the standard for modern software development. They build tools that empower teams to build better software, faster. They are known for their obsession with speed and design.",
    industry: "Productivity",
    location: "Remote / SF",
    teamSize: "51-200",
    funding: "Series B",
    techStack: ["TypeScript", "React", "GraphQL", "MobX", "Electron"],
    founders: [
        { name: "Karri Saarinen", role: "CEO", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karri", bio: "Ex-Airbnb Design Lead" }
    ],
    openRoles: [
        { title: "Senior Product Designer", location: "Remote / SF", type: "Full-time", salary: "Competitive" }
    ],
    images: []
  },
  {
    id: "5",
    name: "Supabase",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Supabase&backgroundColor=3ecf8e",
    websiteUrl: "https://supabase.com",
    shortDescription: "The Open Source Firebase alternative.",
    batch: "YC S20",
    hiringScore: 88,
    remoteScore: 100,
    growthScore: 94,
    aiSummary: "Rapidly expanding product suite. Hiring for database internals and developer advocacy.",
    outreachAngle: "Mention a project you built with Supabase.",
    fullDescription: "Supabase provides all the backend features developers need to build a product: Database, Auth, Storage, and Realtime subscriptions. Built on top of Postgres.",
    industry: "DevTools",
    location: "Remote (Global)",
    teamSize: "51-200",
    funding: "Series B",
    techStack: ["Postgres", "Elixir", "Go", "TypeScript", "Next.js"],
    founders: [
        { name: "Paul Copplestone", role: "CEO", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Paul", bio: "Open Source Advocate" }
    ],
    openRoles: [
        { title: "Developer Advocate", location: "Remote", type: "Full-time", salary: "$120k - $180k" }
    ],
    images: []
  },
  {
    id: "6",
    name: "Vercel",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Vercel&backgroundColor=000000",
    websiteUrl: "https://vercel.com",
    shortDescription: "Develop. Preview. Ship. The platform for frontend developers.",
    batch: "Series D",
    hiringScore: 75,
    remoteScore: 95,
    growthScore: 80,
    aiSummary: "Mature engineering org. Focusing on AI SDKs and edge computing.",
    outreachAngle: "Discuss edge computing optimizations.",
    fullDescription: "Vercel's Frontend Cloud provides the developer experience and infrastructure to build, scale, and secure a faster, more personalized web.",
    industry: "Cloud / DevTools",
    location: "Remote",
    teamSize: "201-500",
    funding: "Series D",
    techStack: ["Next.js", "React", "Rust", "Go", "Turbo"],
    founders: [
        { name: "Guillermo Rauch", role: "CEO", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guillermo", bio: "Creator of Next.js" }
    ],
    openRoles: [],
    images: []
  },
  {
    id: "7",
    name: "LangChain",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=LangChain&backgroundColor=1c3c3c",
    websiteUrl: "https://langchain.com",
    shortDescription: "Building applications with LLMs through composability.",
    batch: "Seed",
    hiringScore: 98,
    remoteScore: 90,
    growthScore: 99,
    aiSummary: "At the center of the AI hype cycle. Hiring generalist engineers who can move fast.",
    outreachAngle: "Show an interesting chain or agent you built.",
    fullDescription: "LangChain is a framework for developing applications powered by language models. It enables applications that are data-aware and agentic.",
    industry: "AI / DevTools",
    location: "San Francisco / Remote",
    teamSize: "11-50",
    funding: "Series A",
    techStack: ["Python", "TypeScript", "LangChain", "OpenAI API"],
    founders: [
        { name: "Harrison Chase", role: "CEO", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harrison", bio: "Ex-Robust Intelligence" }
    ],
    openRoles: [
        { title: "Founding Engineer", location: "SF", type: "Full-time", salary: "$180k - $250k" }
    ],
    images: []
  },
  {
    id: "8",
    name: "Modal",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Modal&backgroundColor=4ade80",
    websiteUrl: "https://modal.com",
    shortDescription: "Serverless data processing and AI inference.",
    batch: "Series A",
    hiringScore: 82,
    remoteScore: 70,
    growthScore: 89,
    aiSummary: "Technical team solving hard infrastructure problems. Python experience is key.",
    outreachAngle: "Discuss container startup times.",
    fullDescription: "Modal lets you run code in the cloud without thinking about infrastructure. It's built for data teams and AI engineers.",
    industry: "Cloud / AI",
    location: "New York / Remote",
    teamSize: "11-50",
    funding: "Series A",
    techStack: ["Python", "Rust", "Kubernetes", "gVisor"],
    founders: [
        { name: "Erik Bernhardsson", role: "CEO", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Erik", bio: "Ex-Spotify CTO" }
    ],
    openRoles: [],
    images: []
  },
  {
    id: "9",
    name: "PostHog",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=PostHog&backgroundColor=000000",
    websiteUrl: "https://posthog.com",
    shortDescription: "The single platform to analyze, test, observe, and deploy new features.",
    batch: "YC W20",
    hiringScore: 85,
    remoteScore: 100,
    growthScore: 91,
    aiSummary: "Very transparent culture. They pay top of market for remote talent.",
    outreachAngle: "Read their handbook and mention a specific value.",
    fullDescription: "PostHog provides open-source product analytics, session recording, feature flags and A/B testing that you can host yourself.",
    industry: "Analytics",
    location: "Remote (Global)",
    teamSize: "51-200",
    funding: "Series B",
    techStack: ["Python", "Django", "React", "ClickHouse", "Kafka"],
    founders: [
        { name: "James Hawkins", role: "CEO", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James", bio: "Ex-Enterprise Sales" }
    ],
    openRoles: [
        { title: "Site Reliability Engineer", location: "Remote", type: "Full-time", salary: "$150k - $210k" }
    ],
    images: []
  },
  {
      id: "10",
      name: "Cursor",
      logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Cursor&backgroundColor=000000",
      websiteUrl: "https://www.cursor.com",
      shortDescription: "The AI-first code editor.",
      batch: "Startups",
      hiringScore: 95,
      remoteScore: 80,
      growthScore: 99,
      aiSummary: "Growing extremely fast. Looking for engineers who can build complex UI and robust systems.",
      outreachAngle: "Show a plugin or extension you built.",
      fullDescription: "Cursor is an IDE built for programming with AI. It's a fork of VS Code that integrates LLMs directly into the editing experience.",
      industry: "DevTools / AI",
      location: "San Francisco",
      teamSize: "11-50",
      funding: "Series A",
      techStack: ["TypeScript", "Electron", "Rust", "C++", "Python"],
      founders: [
          { name: "Michael Truell", role: "CEO", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael", bio: "MIT Drop-out" }
      ],
      openRoles: [
          { title: "Systems Engineer", location: "San Francisco", type: "Full-time", salary: "$180k - $300k" }
      ],
      images: []
  },
  {
      id: "11",
      name: "Perplexity",
      logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Perplexity&backgroundColor=1f2937",
      websiteUrl: "https://perplexity.ai",
      shortDescription: "Where knowledge begins. AI-powered search.",
      batch: "Series B",
      hiringScore: 88,
      remoteScore: 60,
      growthScore: 98,
      aiSummary: "Competing directly with Google. Hiring best-in-class ML and search engineers.",
      outreachAngle: "Discuss RAG optimization strategies.",
      fullDescription: "Perplexity AI is an AI-chat-based conversational search engine that delivers answers to questions using language models.",
      industry: "AI / Search",
      location: "San Francisco",
      teamSize: "51-200",
      funding: "Series B",
      techStack: ["Python", "PyTorch", "Next.js", "Kubernetes"],
      founders: [
          { name: "Aravind Srinivas", role: "CEO", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aravind", bio: "Ex-OpenAI, Ex-DeepMind" }
      ],
      openRoles: [],
      images: []
  },
  {
      id: "12",
      name: "Mistral",
      logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Mistral&backgroundColor=f59e0b",
      websiteUrl: "https://mistral.ai",
      shortDescription: "Open weights LLMs from Europe.",
      batch: "Series A",
      hiringScore: 80,
      remoteScore: 50,
      growthScore: 96,
      aiSummary: "European AI powerhouse. Hiring researchers and systems engineers deeply.",
      outreachAngle: "Discuss model compression or quantization.",
      fullDescription: "Mistral AI is a French artificial intelligence company. They promote open science and community collaboration.",
      industry: "AI / Research",
      location: "Paris",
      teamSize: "11-50",
      funding: "Series A",
      techStack: ["Python", "JAX", "C++", "CUDA"],
      founders: [
          { name: "Arthur Mensch", role: "CEO", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arthur", bio: "Ex-DeepMind" }
      ],
      openRoles: [],
      images: []
  }
];
