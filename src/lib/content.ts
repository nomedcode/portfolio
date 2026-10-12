export type Social = { label: string; url: string };

export type Profile = {
  name: string;
  fullName: string;
  location: string;
  roles: string[];
  about: string;
  heroBackground: string;
  email: string;
  socials: Social[];
};

export type CloudSkill = { id: string; name: string };

export type Skill = { name: string; icon: string };

export type SkillCategory = {
  id: string;
  name: string;
  skills: Skill[];
};

export type Award = {
  id: string;
  title: string;
  year: string;
  issuer: string;
  description: string;
};

export type CredlyBadge = {
  id: string;
  name: string;
  issuer: string;
  image: string;
  url: string;
  skills: string[];
};

export type EducationItem = {
  id: string;
  school: string;
  degree: string;
  period: string;
  gpa?: string;
  coursework: string[];
};

export const profile: Profile = {
  name: "Faiq Prasetya",
  fullName: "Fa'iq Haidar Prasetya",
  location: "Bandung, Indonesia",
  roles: ["Cloud Engineer", "DevOps Engineer", "Site Reliability Engineer"],
  about:
    "Undergraduate Computer Science student at BINUS specializing in Cloud Technology, with a strong interest in Cloud Engineering, AI/ML, Data Engineering, and modern cloud infrastructure.",
  heroBackground:
    "linear-gradient(135deg, #1a1a2e 0%, #16213e 55%, #0f3460 100%)",
  email: "faiqhaidarprasetya0@gmail.com",
  socials: [
    { label: "GitHub", url: "https://github.com/nomedcode" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/faiqhprasetya" },
  ],
};

export const cloudSkills: CloudSkill[] = [
  { id: "aws", name: "AWS" },
  { id: "googlecloud", name: "Google Cloud" },
  { id: "azure", name: "Azure" },
  { id: "terraform", name: "Terraform" },
];

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    name: "Languages",
    skills: [
      { name: "TypeScript", icon: "typescript" },
      { name: "JavaScript", icon: "javascript" },
      { name: "Python", icon: "python" },
      { name: "Go", icon: "go" },
      { name: "C++", icon: "cplusplus" },
    ],
  },
  {
    id: "frontend",
    name: "Frontend Web",
    skills: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextdotjs" },
      { name: "Vue", icon: "vuedotjs" },
      { name: "Svelte", icon: "svelte" },
      { name: "Astro", icon: "astro" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
      { name: "Motion", icon: "framer" },
      { name: "GSAP", icon: "greensock" },
    ],
  },
  {
    id: "mobile",
    name: "Mobile & Android",
    skills: [
      { name: "Kotlin", icon: "kotlin" },
      { name: "Jetpack Compose", icon: "jetpackcompose" },
      { name: "Expo", icon: "expo" },
      { name: "Flutter", icon: "flutter" },
    ],
  },
  {
    id: "backend",
    name: "Backend & Edge",
    skills: [
      { name: "Node.js", icon: "nodedotjs" },
      { name: "Express", icon: "express" },
      { name: "NestJS", icon: "nestjs" },
      { name: "Bun", icon: "bun" },
      { name: "GraphQL", icon: "graphql" },
      { name: "tRPC", icon: "trpc" },
    ],
  },
  {
    id: "databases",
    name: "Databases & Storage",
    skills: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MySQL", icon: "mysql" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "Redis", icon: "redis" },
      { name: "Prisma", icon: "prisma" },
      { name: "Supabase", icon: "supabase" },
      { name: "Firebase", icon: "firebase" },
    ],
  },
  {
    id: "ai-ml",
    name: "AI & Machine Learning",
    skills: [
      { name: "TensorFlow", icon: "tensorflow" },
      { name: "PyTorch", icon: "pytorch" },
      { name: "Hugging Face", icon: "huggingface" },
      { name: "LangChain", icon: "langchain" },
      { name: "Google Gemini", icon: "googlegemini" },
      { name: "Ollama", icon: "ollama" },
    ],
  },
  {
    id: "ai-tools",
    name: "AI Tools & Builders",
    skills: [
      { name: "GitHub Copilot", icon: "githubcopilot" },
      { name: "Claude", icon: "anthropic" },
      { name: "Cursor", icon: "cursor" },
      { name: "v0", icon: "v0" },
      { name: "Figma", icon: "figma" },
    ],
  },
  {
    id: "cloud",
    name: "Cloud & Infra",
    skills: [
      { name: "Google Cloud", icon: "googlecloud" },
      { name: "Docker", icon: "docker" },
      { name: "Kubernetes", icon: "kubernetes" },
      { name: "GitHub Actions", icon: "githubactions" },
      { name: "Vercel", icon: "vercel" },
      { name: "Netlify", icon: "netlify" },
      { name: "Cloudflare", icon: "cloudflare" },
    ],
  },
];

export const awards: Award[] = [
  {
    id: "gold-medals",
    title: "3x Gold Medals",
    year: "2023 — 2024",
    issuer: "AISEEF · I2ASPO · ISIF",
    description:
      "Gold medals at AISEEF 2024 (Innovation Science), I2ASPO 2023 (Functional Food), and ISIF 2023 (Life Sciences) for the extended abstract on Bangle-derived sesquiterpenoids as a pancreatic cancer drug candidate.",
  },
  {
    id: "i2aspo-semi-grand-award",
    title: "Semi Grand Award",
    year: "2023",
    issuer: "I2ASPO",
    description:
      "Semi Grand Award at I2ASPO 2023 for the extended abstract on Bangle-derived sesquiterpenoids as a pancreatic cancer drug candidate.",
  },
];

export const credlyBadge: CredlyBadge = {
  id: "d0139198-6bd8-436e-9169-b098d5b1a6e7",
  name: "Google Cloud Computing Foundations Certificate",
  issuer: "Google Cloud",
  image: "/badges/google-cloud-computing-foundations.png",
  url: "https://www.credly.com/badges/d0139198-6bd8-436e-9169-b098d5b1a6e7/public_url",
  skills: [
    "Google Cloud",
    "Cloud Computing",
    "Compute Engine",
    "Cloud Storage",
    "BigQuery",
    "IAM",
  ],
};

export const education: EducationItem[] = [
  {
    id: "binus",
    school: "BINUS University",
    degree: "Undergraduate Computer Science — Cloud Technology",
    period: "2024 — 2028",
    gpa: "3.06",
    coursework: [
      "Software Development Operations in Cloud Environments",
      "Application Development in Cloud",
      "Cloud Services",
      "Intro to Cloud Security",
    ],
  },
  {
    id: "aws-restart",
    school: "Orbit Future Academy x Amazon Web Services",
    degree: "AWS re/Start Learner — Batch 16",
    period: "Sept 2026 — Nov 2026",
    coursework: [
      "AWS Core Services",
      "Linux & Networking",
      "Python Scripting",
      "Cloud Security",
    ],
  },
];

export const sections = [
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "certificates", label: "Certificates" },
  { id: "awards", label: "Awards" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
