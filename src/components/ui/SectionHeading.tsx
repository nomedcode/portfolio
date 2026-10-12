import { Reveal } from "./Reveal";

export function SectionHeading({
  id,
  title,
  dark = false,
}: {
  id: string;
  title: string;
  dark?: boolean;
}) {
  return (
    <Reveal className="mb-16 text-center">
      <h2
        id={id}
        className={`text-4xl font-semibold tracking-tight text-balance md:text-5xl ${
          dark ? "text-white" : "text-fg"
        }`}
        style={{ letterSpacing: "-0.02em" }}
      >
        {title}
      </h2>
    </Reveal>
  );
}
