import { Reveal } from "./Reveal";

export function SectionHeading({ id, title }: { id: string; title: string }) {
  return (
    <Reveal className="mb-16 text-center">
      <h2
        id={id}
        className="text-4xl font-semibold tracking-tight text-balance text-fg md:text-5xl"
        style={{ letterSpacing: "-0.02em" }}
      >
        {title}
      </h2>
    </Reveal>
  );
}
