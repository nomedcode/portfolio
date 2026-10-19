import type { CSSProperties } from "react";
import { featuredSkillIcons, skillCategories } from "@/lib/content";
import { SkillMark } from "@/components/ui/SkillMark";
import { PreviewReveal } from "./PreviewReveal";

// Banner-only placement: the two runs trade places so the infra tools sit where the web tools were and vice versa.
// The category lists in content.ts are untouched, so the dialog still groups each skill where it belongs.
const INFRA = ["terraform", "docker", "kubernetes"];
const WEB = ["gsap", "nodedotjs", "bun"];

function swapRuns(list: string[], a: string[], b: string[]): string[] {
  const i = list.indexOf(a[0]);
  const j = list.indexOf(b[0]);
  if (i < 0 || j < 0) return list;
  const out = [...list];
  a.forEach((_, k) => (out[i + k] = b[k]));
  b.forEach((_, k) => (out[j + k] = a[k]));
  return out;
}

// A fixed order, the same on the server and after hydration: the three main cloud skills first, then every other
// skill once, in content order. Nothing reshuffles between loads or opens.
const order = (() => {
  const seen = new Set<string>(featuredSkillIcons);
  const list: string[] = [...featuredSkillIcons];
  for (const cat of skillCategories) {
    for (const s of cat.skills) {
      if (!seen.has(s.icon)) {
        seen.add(s.icon);
        list.push(s.icon);
      }
    }
  }
  return swapRuns(list, INFRA, WEB);
})();

// Server-rendered on purpose: importing skillIcons into a client component shipped all 47 paths twice, once in the
// HTML and again in the first-load JS chunk.
export function SkillsPreview() {
  return (
    <PreviewReveal>
      {order.map((id, i) => (
        <li
          key={id}
          data-preview-logo
          data-reveal
          data-skill={id}
          style={{ "--i": i } as CSSProperties}
          className="preview-logo flex h-7 w-7 items-center justify-center"
        >
          <SkillMark id={id} className="h-7 w-7" />
        </li>
      ))}
    </PreviewReveal>
  );
}
