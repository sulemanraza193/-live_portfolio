import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import { experienceData } from '../data/siteData';

export default function Experience() {
  return (
    <section id="experience" className="py-28 px-6 bg-card/30">
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          eyebrow="Experience"
          title="Where the time went"
          description="Projects and study, roughly in order."
        />

        <div className="relative pl-8 border-l border-border">
          {experienceData.map((item, i) => (
            <Reveal
              key={item.company}
              direction={i % 2 === 0 ? 'right' : 'left'}
              delay={i * 0.1}
              className="relative pb-12 last:pb-0"
            >
              <span className="absolute -left-[calc(2rem+5px)] top-1 w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary ring-4 ring-bg" />
              <p className="text-xs font-mono text-secondary tracking-wide">{item.duration}</p>
              <h3 className="font-display text-lg font-semibold mt-1">{item.position}</h3>
              <p className="text-sm text-muted mb-2">{item.company}</p>
              <p className="text-sm text-muted leading-relaxed">{item.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
