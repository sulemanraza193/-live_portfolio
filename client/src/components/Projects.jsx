import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiStar } from 'react-icons/fi';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import api from '../utils/api';
import { fallbackProjects } from '../data/siteData';

function ProjectCard({ project }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -6 }}
      className="group relative rounded-2xl border border-border bg-card overflow-hidden flex flex-col"
    >
      {project.featured && (
        <span className="absolute top-3 right-3 z-10 flex items-center gap-1 text-[11px] font-mono bg-bg/80 backdrop-blur px-2 py-1 rounded-full border border-border text-secondary">
          <FiStar size={10} /> Featured
        </span>
      )}
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full grid place-items-center font-display text-2xl text-muted">
            {project.title}
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-lg font-semibold">{project.title}</h3>
        <p className="text-sm text-muted mt-2 leading-relaxed flex-1">{project.description}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          {project.techStack?.map((tech) => (
            <span
              key={tech}
              className="text-[11px] font-mono px-2 py-1 rounded-md bg-border/60 text-muted"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-5 pt-5 border-t border-border">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-text transition-colors"
            >
              <FiGithub size={15} /> Code
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-text transition-colors"
            >
              <FiExternalLink size={15} /> Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState(fallbackProjects);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    let cancelled = false;
    api
      .get('/projects')
      .then((res) => {
        if (!cancelled && Array.isArray(res.data) && res.data.length) {
          setProjects(res.data);
        }
      })
      .catch(() => {
        // API not running yet — fallback data already set
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(
    () => ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))],
    [projects]
  );

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Projects"
          title="Things I've built"
          description="Pulled live from the projects database — filter by category below."
        />

        <Reveal className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                filter === cat
                  ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent'
                  : 'border-border text-muted hover:text-text hover:border-secondary/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </Reveal>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card aspect-[4/5] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
