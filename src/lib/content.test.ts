import { describe, expect, test } from "vitest";
import { getSkillIcon } from "./skillIcons";
import {
  awards,
  cloudSkills,
  credlyBadge,
  education,
  profile,
  sections,
  skillCategories,
} from "./content";

describe("profile", () => {
  test("has the approved identity, location, and rotating hero roles", () => {
    expect(profile.name).toBe("Faiq Prasetya");
    expect(profile.fullName).toBe("Fa'iq Haidar Prasetya");
    expect(profile.location).toBe("Bandung, Indonesia");
    expect(profile.email).toBe("faiqhaidarprasetya0@gmail.com");
    expect(profile.roles).toEqual([
      "Cloud Engineer",
      "DevOps Engineer",
      "Site Reliability Engineer",
      "System Administrator",
    ]);
    expect(profile.about.trim()).not.toBe("");
    expect(profile.about).toMatch(/ Currently building Cloud \/ Mobile \/ Web Projects\.$/);
    expect(profile.about).not.toMatch(/CI\/CD|IaC|infrastructure as code/i);
    expect(profile.heroBackground).toMatch(/^linear-gradient\(/);
  });

  test("links only GitHub and LinkedIn, without Instagram", () => {
    expect(profile.socials).toEqual([
      { label: "GitHub", url: "https://github.com/nomedcode" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/faiqhprasetya" },
    ]);
  });
});

describe("cloud skills banner", () => {
  test("shows the four cloud tiles", () => {
    expect(cloudSkills.map((c) => c.name)).toEqual([
      "AWS",
      "Google Cloud",
      "Azure",
      "Terraform",
    ]);
  });
});

describe("skills", () => {
  test("renders the eight tech-stack categories", () => {
    expect(skillCategories.map((c) => c.name)).toEqual([
      "Languages",
      "Frontend Web",
      "Mobile & Android",
      "Backend & Edge",
      "Databases & Storage",
      "AI & Machine Learning",
      "AI Tools & Builders",
      "Cloud & Infra",
    ]);
  });
  test("lists the chosen skills in each category", () => {
    const byCategory = Object.fromEntries(
      skillCategories.map((c) => [c.name, c.skills.map((s) => s.name)])
    );
    expect(byCategory).toEqual({
      Languages: ["TypeScript", "JavaScript", "Python", "C++", "Java"],
      "Frontend Web": ["React", "Next.js", "Tailwind CSS", "Motion", "GSAP"],
      "Mobile & Android": ["Kotlin", "Jetpack Compose", "Flutter"],
      "Backend & Edge": ["Node.js", "Bun"],
      "Databases & Storage": [
        "PostgreSQL",
        "MySQL",
        "MongoDB",
        "Redis",
        "Supabase",
        "Firebase",
      ],
      "AI & Machine Learning": [
        "TensorFlow",
        "PyTorch",
        "Hugging Face",
        "Ollama",
        "Langflow",
      ],
      "AI Tools & Builders": ["GitHub Copilot", "Claude", "Cursor", "Figma", "Kiro"],
      "Cloud & Infra": [
        "Google Cloud",
        "Docker",
        "Kubernetes",
        "GitHub Actions",
        "Vercel",
        "Netlify",
        "Cloudflare",
      ],
    });
  });

  test("every skill has a name and a resolvable brand icon", () => {
    for (const c of skillCategories) {
      for (const s of c.skills) {
        expect(s.name).toBeTruthy();
        expect(getSkillIcon(s.icon)).toBeTruthy();
      }
    }
  });
});

describe("awards", () => {
  test("lists the consolidated gold medals and the I2ASPO semi grand award", () => {
    expect(awards.map((a) => a.title)).toEqual([
      "3x Gold Medals",
      "Semi Grand Award",
    ]);
  });

  test("every award carries an issuer, a year, and an extended-abstract reference", () => {
    for (const a of awards) {
      expect(a.title).toBeTruthy();
      expect(a.issuer).toBeTruthy();
      expect(a.year).toMatch(/^\d{4}( — \d{4})?$/);
      expect(a.description).toMatch(/extended abstract/i);
    }
  });
});

describe("credly badge", () => {
  test("points at the public Google Cloud Computing Foundations badge", () => {
    expect(credlyBadge.id).toBe("d0139198-6bd8-436e-9169-b098d5b1a6e7");
    expect(credlyBadge.name).toBe(
      "Google Cloud Computing Foundations Certificate"
    );
    expect(credlyBadge.issuer).toBe("Google Cloud");
    expect(credlyBadge.image).toMatch(/^\/badges\/.+\.png$/);
    expect(credlyBadge.url).toBe(
      "https://www.credly.com/badges/d0139198-6bd8-436e-9169-b098d5b1a6e7/public_url"
    );
  });

  test("includes the core Google Cloud skills", () => {
    for (const s of [
      "Google Cloud",
      "Cloud Computing",
      "Compute Engine",
      "Cloud Storage",
      "BigQuery",
      "IAM",
    ]) {
      expect(credlyBadge.skills).toContain(s);
    }
  });
});

describe("education", () => {
  test("every entry has school, degree, period, coursework", () => {
    for (const e of education) {
      expect(e.school).toBeTruthy();
      expect(e.degree).toBeTruthy();
      expect(e.period).toBeTruthy();
      expect(e.coursework.length).toBeGreaterThan(0);
    }
  });

  test("AWS re/Start is run by Orbit Future Academy with Amazon Web Services, Sept 2026 to Nov 2026", () => {
    const restart = education.find((e) => e.id === "aws-restart");
    expect(restart?.school).toBe("Orbit Future Academy x Amazon Web Services");
    expect(restart?.degree).toBe("AWS re/Start Learner — Batch 16");
    expect(restart?.period).toBe("Sept 2026 — Nov 2026");
  });

  test("BINUS runs 2024 to 2028", () => {
    expect(education.find((e) => e.id === "binus")?.period).toBe(
      "2024 — 2028"
    );
  });
});

describe("sections", () => {
  test("covers the six page chapters in display order", () => {
    expect(sections.map((s) => s.id)).toEqual([
      "projects",
      "skills",
      "certificates",
      "awards",
      "education",
      "contact",
    ]);
  });
});
