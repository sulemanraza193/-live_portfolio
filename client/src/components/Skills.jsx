import { useState } from 'react';
import { motion } from 'framer-motion';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import { skillCategories } from '../data/siteData';

function SkillBar({ skill, delay }) {
  const Icon = skill.icon;
  return (
    <Reveal direction="up" delay={delay} className="mb-5 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Icon size={16} style={{ color: skill.color }} />
          {skill.name}
        </div>
        <span className="text-xs font-mono text-muted">{skill.percentage}%</span>
      </div>
      <div className="h-2 rounded-full bg-border overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut', delay }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
        />
      </div>
    </Reveal>
  );
}

export default function Skills() {
  const [active, setActive] = useState(skillCategories[0].category);
  const current = skillCategories.find((c) => c.category === active);

  return (
    <section id="skills" className="py-28 px-6 bg-card/30">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          eyebrow="Skills"
          title="Tools I reach for"
          description="Grouped by where they sit in the stack — tap a category to filter."
        />

        <Reveal className="flex flex-wrap justify-center gap-2 mb-10">
          {skillCategories.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setActive(cat.category)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                active === cat.category
                  ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent'
                  : 'border-border text-muted hover:text-text hover:border-secondary/50'
              }`}
            >
              {cat.category}
            </button>
          ))}
        </Reveal>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-border bg-card p-8"
        >
          {current.skills.map((skill, i) => (
            <SkillBar key={skill.name} skill={skill} delay={i * 0.08} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
