import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiSun, FiMoon, FiDownload } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const SECTION_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#home');
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const sections = SECTION_LINKS.map((l) => document.querySelector(l.href)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome]);

  // Section links only make sense on the home page — from anywhere else,
  // navigate home first and let the browser resolve the hash afterward.
  const handleSectionClick = (e, href) => {
    if (isHome) return; // let the native anchor scroll handle it
    e.preventDefault();
    setOpen(false);
    navigate(`/${href}`);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled
            ? 'bg-bg/70 backdrop-blur-lg border-b border-border shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-lg font-semibold tracking-tight">
            <span className="gradient-text">Suleman</span> 
            <span className="text-muted">.dev</span>
          </Link>

          <ul className="hidden lg:flex items-center gap-8">
            {SECTION_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={isHome ? link.href : `/${link.href}`}
                  onClick={(e) => handleSectionClick(e, link.href)}
                  className={`relative text-sm font-medium transition-colors ${
                    isHome && active === link.href ? 'text-text' : 'text-muted hover:text-text'
                  }`}
                >
                  {link.label}
                  {isHome && active === link.href && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-primary to-secondary"
                    />
                  )}
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/blog"
                className={`text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/blog') ? 'text-text' : 'text-muted hover:text-text'
                }`}
              >
                Blog
              </Link>
            </li>
          </ul>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 grid place-items-center rounded-full border border-border text-muted hover:text-text hover:border-secondary transition-colors"
            >
              {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>
            <a
              href="/resume.pdf"
              download
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-opacity"
            >
              <FiDownload size={14} /> Resume
            </a>
          </div>

          <button
            className="lg:hidden text-text"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[64px] left-0 right-0 z-40 bg-bg border-b border-border lg:hidden overflow-hidden"
          >
            <ul className="flex flex-col px-6 py-4 gap-1">
              {SECTION_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={isHome ? link.href : `/${link.href}`}
                    onClick={(e) => {
                      handleSectionClick(e, link.href);
                      setOpen(false);
                    }}
                    className="block py-3 text-base font-medium text-muted hover:text-text border-b border-border/60"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/blog"
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-medium text-muted hover:text-text border-b border-border/60"
                >
                  Blog
                </Link>
              </li>
              <li className="flex items-center justify-between pt-4">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 text-sm text-muted"
                >
                  {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
                  Toggle theme
                </button>
                <a
                  href="/resume.pdf"
                  download
                  className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white"
                >
                  <FiDownload size={14} /> Resume
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
