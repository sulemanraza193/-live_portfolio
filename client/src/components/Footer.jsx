import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FiMail, FiArrowUp } from 'react-icons/fi';

const LINKS = ['Home', 'About', 'Skills', 'Projects', 'Experience', 'Contact'];

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link to="/" className="font-display text-lg font-semibold">
          <span className="gradient-text">Salman</span>
          <span className="text-muted">.dev</span>
        </Link>

        <ul className="flex flex-wrap justify-center gap-6 text-sm text-muted">
          {LINKS.map((link) => (
            <li key={link}>
              <a href={`/#${link.toLowerCase()}`} className="hover:text-text transition-colors">
                {link}
              </a>
            </li>
          ))}
          <li>
            <Link to="/blog" className="hover:text-text transition-colors">Blog</Link>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <a href="https://github.com/sulemanraza193" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-muted hover:text-text transition-colors"><FaGithub size={18} /></a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted hover:text-text transition-colors"><FaLinkedin size={18} /></a>
          <a href="mailto:hello@example.com" aria-label="Email" className="text-muted hover:text-text transition-colors"><FiMail size={18} /></a>
          <button
            onClick={scrollTop}
            aria-label="Back to top"
            className="w-9 h-9 grid place-items-center rounded-full border border-border hover:border-secondary hover:text-secondary transition-colors"
          >
            <FiArrowUp size={15} />
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-muted mt-10">
        © {new Date().getFullYear()} Salman Raza. Built with React, Tailwind & Framer Motion.
      </p>
    </footer>
  );
}
