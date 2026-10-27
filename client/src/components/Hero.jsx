import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiMail } from 'react-icons/fi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';

const ROLES = ['Full Stack Developer', 'React Developer', 'MERN Stack Developer'];
const BUILD_LOG = ['npm install', 'compiling react...', 'compiling node...', 'build ready ✓'];

function useTypewriter(words, speed = 70, pause = 1400) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];
    let timeout;

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === '') {
      setDeleting(false);
      setWordIndex((i) => i + 1);
    } else {
      timeout = setTimeout(() => {
        setText((t) =>
          deleting ? current.slice(0, t.length - 1) : current.slice(0, t.length + 1)
        );
      }, deleting ? speed / 2 : speed);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, words, speed, pause]);

  return text;
}

function useBuildLog() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step >= BUILD_LOG.length - 1) return;
    const t = setTimeout(() => setStep((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [step]);
  return BUILD_LOG.slice(0, step + 1);
}

export default function Hero() {
  const typed = useTypewriter(ROLES);
  const log = useBuildLog();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[-10%] w-[420px] h-[420px] rounded-full bg-primary/25 blur-[110px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-15%] right-[-10%] w-[480px] h-[480px] rounded-full bg-secondary/20 blur-[120px]"
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="inline-block text-xs font-mono tracking-widest text-secondary border border-border rounded-full px-3 py-1 mb-6">
            AVAILABLE FOR FREELANCE AND FULL-TIME WORK
          </span>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight">
            Hi, I&apos;m <span className="gradient-text">Suleman</span>
          </h1>

          <div className="mt-4 h-10 font-display text-xl sm:text-2xl text-muted">
            <span className="text-text">{typed}</span>
            <span className="inline-block w-[2px] h-6 bg-secondary ml-1 align-middle animate-pulse" />
          </div>

          <p className="mt-6 text-muted max-w-lg leading-relaxed">
            I build full-stack products end to end — React on the front, Node and Express
            underneath, backed by MongoDB or PostgreSQL — and deploy them so they actually run
            in production, not just on localhost.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="/resume.pdf"
              download
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20"
            >
              <FiDownload size={16} /> Download Resume
            </a>
            <a
              href="#contact"
              className="flex items-center gap-2 px-6 py-3 rounded-full border border-border font-medium text-text hover:border-secondary hover:-translate-y-0.5 transition-all"
            >
              <FiMail size={16} /> Contact Me
            </a>
          </div>

          <div className="mt-8 flex items-center gap-5 text-muted">
            <a href="https://github.com/sulemanraza193" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-text hover:-translate-y-0.5 transition-all"><FaGithub size={20} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-text hover:-translate-y-0.5 transition-all"><FaLinkedin size={20} /></a>
            <a href="mailto:hello@example.com" aria-label="Email" className="hover:text-text hover:-translate-y-0.5 transition-all"><FiMail size={20} /></a>
            <a href="https://leetcode.com" target="_blank" rel="noreferrer" aria-label="LeetCode" className="hover:text-text hover:-translate-y-0.5 transition-all"><SiLeetcode size={20} /></a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          className="relative mx-auto"
        >
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-[2rem] overflow-hidden gradient-border">
            <div className="w-full h-full bg-card flex items-center justify-center font-display text-5xl gradient-text">
              SR
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute -bottom-8 -left-6 sm:-left-12 w-56 rounded-xl border border-border bg-card/95 backdrop-blur px-4 py-3 shadow-xl font-mono text-xs text-muted"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-400/70" />
              <span className="w-2 h-2 rounded-full bg-yellow-400/70" />
              <span className="w-2 h-2 rounded-full bg-green-400/70" />
            </div>
            {log.map((line, i) => (
              <div key={i} className={i === log.length - 1 ? 'text-secondary' : ''}>
                $ {line}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
