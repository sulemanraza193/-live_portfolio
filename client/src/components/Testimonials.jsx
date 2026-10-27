import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import SectionHeading from './SectionHeading';
import { testimonialsData } from '../data/siteData';

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % testimonialsData.length);
    }, 5000);
    return () => clearInterval(t);
  }, [paused]);

  const go = (dir) => {
    setIndex((i) => (i + dir + testimonialsData.length) % testimonialsData.length);
  };

  const current = testimonialsData[index];

  return (
    <section className="py-28 px-6 bg-card/30">
      <div className="max-w-2xl mx-auto">
        <SectionHeading eyebrow="Testimonials" title="What people say" />

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.4 }}
              className="text-center p-8 rounded-2xl border border-border bg-card"
            >
              <p className="text-lg leading-relaxed">&ldquo;{current.quote}&rdquo;</p>
              <footer className="mt-6">
                <p className="font-display font-semibold">{current.name}</p>
                <p className="text-sm text-muted">{current.role}</p>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="w-9 h-9 grid place-items-center rounded-full border border-border hover:border-secondary hover:text-secondary transition-colors"
            >
              <FiChevronLeft size={16} />
            </button>
            <div className="flex gap-2">
              {testimonialsData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === index ? 'bg-secondary w-5' : 'bg-border'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="w-9 h-9 grid place-items-center rounded-full border border-border hover:border-secondary hover:text-secondary transition-colors"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
