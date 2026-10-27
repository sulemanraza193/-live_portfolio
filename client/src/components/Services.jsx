import {
  FiLayout, FiServer, FiShare2, FiDatabase, FiSmartphone, FiCode,
} from 'react-icons/fi';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import { servicesData } from '../data/siteData';

const ICONS = [FiLayout, FiServer, FiShare2, FiDatabase, FiSmartphone, FiCode];

export default function Services() {
  return (
    <section id="services" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Services"
          title="What I can take off your plate"
          description="The parts of building a product I've done enough times to do well."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={service.title} direction="up" delay={i * 0.08}>
                <div className="h-full p-6 rounded-2xl border border-border bg-card hover:-translate-y-1.5 hover:border-secondary/50 transition-all">
                  <span className="w-11 h-11 grid place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-secondary mb-4">
                    <Icon size={20} />
                  </span>
                  <h3 className="font-display font-semibold text-lg">{service.title}</h3>
                  <p className="text-sm text-muted mt-2 leading-relaxed">{service.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
