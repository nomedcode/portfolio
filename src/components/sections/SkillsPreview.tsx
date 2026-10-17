import type { CSSProperties } from "react";
import { featuredSkillIcons, skillCategories } from "@/lib/content";
import { SkillMark } from "@/components/ui/SkillMark";
import { PreviewReveal } from "./PreviewReveal";

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
  return list;
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
