import Reveal from './Reveal';
import { statsData } from '../data/siteData';
import { useCountUp } from '../hooks/useCountUp';

function Stat({ label, value }) {
  const { ref, value: count } = useCountUp(value);
  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-4xl sm:text-5xl font-semibold gradient-text">{count}+</p>
      <p className="text-sm text-muted mt-2">{label}</p>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="py-20 px-6 border-y border-border">
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
        {statsData.map((stat, i) => (
          <Reveal key={stat.label} direction="up" delay={i * 0.1}>
            <Stat {...stat} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
