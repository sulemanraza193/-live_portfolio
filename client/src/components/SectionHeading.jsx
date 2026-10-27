import Reveal from './Reveal';

export default function SectionHeading({ eyebrow, title, description }) {
  return (
    <Reveal className="max-w-2xl mx-auto text-center mb-14">
      {eyebrow && (
        <span className="font-mono text-xs tracking-widest text-secondary uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mt-3">
        {title}
      </h2>
      {description && (
        <p className="text-muted mt-4 leading-relaxed">{description}</p>
      )}
    </Reveal>
  );
}
