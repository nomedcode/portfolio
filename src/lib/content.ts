export type Social = { label: string; url: string };

export type Profile = {
  name: string;
  fullName: string;
  location: string;
  roles: string[];
  about: string;
  email: string;
  socials: Social[];
};

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
  roles: [
    "Cloud Engineer",
    "DevOps Engineer",
    "Site Reliability Engineer",
    "System Administrator",
    "AI Engineer",
  ],
  about:
    "Computer Science Undergrad at BINUS, specializing in Cloud Technology, with a strong interest in Cloud Computing, AI/ML, and Data Engineering. Currently building Cloud / Mobile / Web Projects.",
  email: "faiqhaidarprasetya0@gmail.com",
  socials: [
    { label: "GitHub", url: "https://github.com/nomedcode" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/faiqhprasetya" },
  ],
};

// The main cloud skills. Both the banner preview and the popup lead with these, in this order, and nothing reshuffles.
export const featuredSkillIcons = ["aws", "googlecloud", "azure"];

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    name: "Programming Languages",
    skills: [
      { name: "TypeScript", icon: "typescript" },
      { name: "JavaScript", icon: "javascript" },
      { name: "Python", icon: "python" },
      { name: "Java", icon: "java" },
      { name: "C++", icon: "cplusplus" },
      { name: "HTML", icon: "html5" },
      { name: "CSS", icon: "css" },
    ],
  },
  {
    id: "cloud",
    name: "Cloud & Infrastructure",
    skills: [
      { name: "AWS", icon: "aws" },
      { name: "Google Cloud", icon: "googlecloud" },
      { name: "Azure", icon: "azure" },
      { name: "Terraform", icon: "terraform" },
      { name: "Docker", icon: "docker" },
      { name: "Kubernetes", icon: "kubernetes" },
      { name: "NGINX", icon: "nginx" },
      { name: "GitHub Actions", icon: "githubactions" },
    ],
  },
  {
    id: "frontend",
    name: "Frontend",
    skills: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextdotjs" },
      { name: "Vite", icon: "vite" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
      { name: "Motion", icon: "framer" },
      { name: "GSAP", icon: "gsap" },
    ],
  },
  {
    id: "backend",
    name: "Backend",
    skills: [
      { name: "Node.js", icon: "nodedotjs" },
      { name: "Bun", icon: "bun" },
      { name: "Laravel", icon: "laravel" },
    ],
  },
  {
    id: "mobile",
    name: "Mobile",
    skills: [
      { name: "Kotlin", icon: "kotlin" },
      { name: "Jetpack Compose", icon: "jetpackcompose" },
      { name: "Flutter", icon: "flutter" },
      { name: "Android Studio", icon: "androidstudio" },
    ],
  },
  {
    id: "databases",
    name: "Database",
    skills: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MySQL", icon: "mysql" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "Redis", icon: "redis" },
      { name: "Supabase", icon: "supabase" },
      { name: "Firebase", icon: "firebase" },
    ],
  },
  {
    id: "ai-ml",
    name: "Machine Learning",
    skills: [
      { name: "TensorFlow", icon: "tensorflow" },
      { name: "PyTorch", icon: "pytorch" },
      { name: "scikit-learn", icon: "scikitlearn" },
      { name: "NumPy", icon: "numpy" },
      { name: "Pandas", icon: "pandas" },
      { name: "Hugging Face", icon: "huggingface" },
      { name: "Langflow", icon: "langflow" },
    ],
  },
  {
    id: "ai-tools",
    name: "Tools & Builders",
    skills: [
      { name: "Figma", icon: "figma" },
      { name: "Ollama", icon: "ollama" },
      { name: "Kiro", icon: "kiro" },
      { name: "Hermes Agent", icon: "hermes" },
      { name: "MCP Registry", icon: "modelcontextprotocol" },
      { name: "Cisco Packet Tracer", icon: "cisco" },
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
