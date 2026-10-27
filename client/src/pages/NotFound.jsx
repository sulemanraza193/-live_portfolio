import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-mono text-secondary text-sm mb-2">404</p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold">
          This route doesn&apos;t <span className="gradient-text">resolve</span>
        </h1>
        <p className="text-muted mt-4 max-w-sm mx-auto">
          The page you're looking for isn't part of this build. Let's get you back on track.
        </p>
        <Link
          to="/"
          className="inline-block mt-8 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-opacity"
        >
          Back to home
        </Link>
      </motion.div>
    </div>
  );
}
