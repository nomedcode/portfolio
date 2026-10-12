import { existsSync } from "node:fs";
import path from "node:path";
import { Nav } from "@/components/Nav/Nav";
import { Awards } from "@/components/sections/Awards";
import { Certificates } from "@/components/sections/Certificates";
import { Contact } from "@/components/sections/Contact";
import { Education } from "@/components/sections/Education";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { SkillsBanner } from "@/components/sections/SkillsBanner";
import { MotionProvider } from "@/components/ui/MotionProvider";

export default function Home() {
  // Evaluated at build time (static export): drop public/photo.png in and the hero frame fills with it.
  const photo = existsSync(path.join(process.cwd(), "public", "photo.png"))
    ? "/photo.png"
    : undefined;
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-page focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-fg"
      >
        Skip to main content
      </a>
      <Nav />
      <MotionProvider>
        <main id="main">
          <Hero photo={photo} />
          <Projects />
          <SkillsBanner />
          <Certificates />
          <Awards />
          <Education />
          <Contact />
        </main>
      </MotionProvider>
      <Footer />
    </>
  );
}
