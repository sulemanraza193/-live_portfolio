import { FiMapPin, FiBookOpen, FiCode, FiCoffee } from 'react-icons/fi';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

const FACTS = [
  { icon: FiMapPin, label: 'Based in', value: 'Sialkot, Pakistan' },
  { icon: FiBookOpen, label: 'Education', value: 'BSCS, Virtual University' },
  { icon: FiCode, label: 'Focus', value: 'MERN + ML/Automation' },
  { icon: FiCoffee, label: 'Status', value: 'Open to freelance work' },
];

export default function About() {
  return (
    <section id="about" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="About"
          title="A developer who ships, not just prototypes"
          description="From first weather app to full production deployments — here's the short version."
        />

        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
          <Reveal direction="right">
            <div className="relative w-full max-w-sm mx-auto lg:mx-0 aspect-[4/5] rounded-2xl overflow-hidden gradient-border">
              <div className="w-full h-full bg-card flex items-center justify-center font-display text-4xl gradient-text">
                Salman Raza
              </div>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.1} className="space-y-6">
            <p className="text-muted leading-relaxed">
              I&apos;m a final-year Computer Science student at Virtual University of Pakistan,
              based in Sialkot, with a strong MERN stack background — React, Vite, Tailwind,
              Node/Express, and PostgreSQL or MongoDB depending on the job. I like taking
              projects from a blank folder to a deployed URL: production task managers with
              real authentication, WhatsApp automations wired through n8n, and now a
              Flask-based ML image classifier for my final year project.
            </p>
            <p className="text-muted leading-relaxed">
              I care about clean architecture and code that another developer could actually
              pick up — reusable components, sensible naming, and no dead ends. Outside of
              client work, I run a Pinterest-based tech affiliate blog and I&apos;m building
              toward consistent freelance and product income alongside full-time job
              applications.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {FACTS.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-secondary/50 hover:-translate-y-1 transition-all"
                >
                  <span className="shrink-0 w-9 h-9 grid place-items-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 text-secondary">
                    <Icon size={16} />
                  </span>
                  <div>
                    <p className="text-xs text-muted">{label}</p>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
