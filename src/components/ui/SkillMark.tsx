import { FaAws } from "react-icons/fa6";
import { getSkillIcon } from "@/lib/skillIcons";
import { BrandIcon } from "./BrandIcon";

// One mark per skill, shared by the banner preview and the popup so the two cannot drift apart. AWS comes from
// react-icons and follows the text colour; every other skill is a brand mark from getSkillIcon.
export function SkillMark({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  if (id === "aws") {
    return <FaAws className={className} aria-hidden />;
  }
  const icon = getSkillIcon(id);
  if (!icon) return null;
  return <BrandIcon icon={icon} className={className} />;
}
