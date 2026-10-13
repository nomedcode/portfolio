import { getSkillIcon } from "@/lib/skillIcons";
import { BrandIcon } from "./BrandIcon";

// One mark per skill, shared by the banner preview and the popup so the two cannot drift apart. Every mark is a brand
// icon from getSkillIcon; the layered ones (AWS, Azure, Vite, Kotlin, Python, Java, Google Cloud) draw their own
// colours, and AWS takes the per-theme fill for its wordmark.
export function SkillMark({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const icon = getSkillIcon(id);
  if (!icon) return null;
  return <BrandIcon icon={icon} className={className} />;
}
