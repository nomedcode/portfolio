import { FaAws } from "react-icons/fa6";
import { VscAzure } from "react-icons/vsc";
import { getSkillIcon } from "@/lib/skillIcons";
import { BrandIcon } from "./BrandIcon";

// One mark per skill, shared by the banner preview and the popup so the two cannot drift apart. AWS and Azure come
// from react-icons and follow the text colour; every other skill is a brand mark from getSkillIcon.
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
  if (id === "azure") {
    return <VscAzure className={className} aria-hidden />;
  }
  const icon = getSkillIcon(id);
  if (!icon) return null;
  return <BrandIcon icon={icon} className={className} />;
}
