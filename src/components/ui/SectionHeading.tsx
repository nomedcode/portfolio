import { Reveal } from "./Reveal";

export function SectionHeading({ id, title }: { id: string; title: string }) {
  return (
    <Reveal className="mb-16 text-center">
      <h2
        id={id}
        className="text-4xl font-semibold tracking-heading text-balance text-fg md:text-5xl"
      >
        {title}
      </h2>
    </Reveal>
  );
}
