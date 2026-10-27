import { motion } from 'framer-motion';

const VARIANTS = {
  up: { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -32 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: 32 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -32 }, show: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.92 }, show: { opacity: 1, scale: 1 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
};

export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className = '',
  as: Component = motion.div,
}) {
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={VARIANTS[direction]}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </Component>
  );
}
