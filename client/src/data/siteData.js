import {
  FaReact, FaNodeJs, FaGitAlt, FaDocker,
} from 'react-icons/fa';
import {
  SiExpress, SiMongodb, SiPostgresql, SiTailwindcss, SiJavascript,
  SiVite, SiVercel, SiPostman,
} from 'react-icons/si';

export const skillCategories = [
  {
    category: 'Frontend',
    skills: [
      { name: 'React', percentage: 92, icon: FaReact, color: '#61DAFB' },
      { name: 'JavaScript (ES2023)', percentage: 90, icon: SiJavascript, color: '#F7DF1E' },
      { name: 'Tailwind CSS', percentage: 88, icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'Vite', percentage: 85, icon: SiVite, color: '#646CFF' },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { name: 'Node.js', percentage: 87, icon: FaNodeJs, color: '#68A063' },
      { name: 'Express.js', percentage: 85, icon: SiExpress, color: '#94A3B8' },
    ],
  },
  {
    category: 'Database',
    skills: [
      { name: 'MongoDB', percentage: 83, icon: SiMongodb, color: '#47A248' },
      { name: 'PostgreSQL', percentage: 80, icon: SiPostgresql, color: '#4169E1' },
    ],
  },
  {
    category: 'Tools & DevOps',
    skills: [
      { name: 'Git', percentage: 88, icon: FaGitAlt, color: '#F05032' },
      { name: 'Vercel / Railway', percentage: 82, icon: SiVercel, color: '#F8FAFC' },
      { name: 'Postman', percentage: 80, icon: SiPostman, color: '#FF6C37' },
      { name: 'Docker', percentage: 60, icon: FaDocker, color: '#2496ED' },
    ],
  },
];

export const experienceData = [
  {
    company: 'Freelance / Self-Directed',
    position: 'Full Stack Developer',
    duration: '2024 — Present',
    description:
      'Building production MERN applications end to end — authentication systems, REST APIs, and deployed full-stack apps on Railway and Vercel, alongside automation tooling using n8n and the WhatsApp Cloud API.',
  },
  {
    company: 'Internship Assessment Project',
    position: 'Full Stack Developer',
    duration: '2025',
    description:
      'Shipped a Team Task Manager with a React/Vite/Tailwind frontend and a Node/Express + PostgreSQL (Neon) backend, implementing Passport.js authentication with secure cross-domain sessions.',
  },
  {
    company: 'Virtual University of Pakistan',
    position: 'BS Computer Science (Final Year)',
    duration: '2022 — 2026',
    description:
      'Coursework spanning data structures, databases, and software engineering, culminating in a Flask-based ML image classification system as the final year project.',
  },
];

export const servicesData = [
  { title: 'Frontend Development', description: 'Fast, accessible interfaces built with React, Vite, and Tailwind CSS.' },
  { title: 'Backend Development', description: 'Reliable Node.js and Express services with clean, documented architecture.' },
  { title: 'REST API Design', description: 'Well-structured, versioned APIs with validation and proper error handling.' },
  { title: 'Database Design', description: 'Schema design across MongoDB and PostgreSQL, tuned for real query patterns.' },
  { title: 'Responsive Websites', description: 'Mobile-first builds that hold up from a 360px screen to a 4K display.' },
  { title: 'UI Implementation', description: 'Turning designs into pixel-accurate, animated, production-ready UI.' },
];

export const statsData = [
  { label: 'Projects Shipped', value: 12 },
  { label: 'Technologies', value: 20 },
  { label: 'Years Building', value: 3 },
  { label: 'Deployments', value: 8 },
];

export const testimonialsData = [
  {
    name: 'Ayesha Khan',
    role: 'Project Lead, Internship Cohort',
    quote: 'Delivered the task manager ahead of schedule with clean, well-documented code and a genuinely polished UI.',
  },
  {
    name: 'Hamza Tariq',
    role: 'Fellow Developer',
    quote: 'Solid grasp of the full MERN stack and always thinking about the deployment story, not just the code.',
  },
  {
    name: 'Sara Ahmed',
    role: 'Automation Client',
    quote: 'Built out a reliable WhatsApp automation flow and explained every decision clearly along the way.',
  },
];

// Used only if the API is unreachable during local development
export const fallbackProjects = [
  {
    _id: 'local-1',
    title: 'Team Task Manager',
    description: 'Production task management app with role-based auth, cross-domain sessions, and full CRUD.',
    image: '',
    github: 'https://github.com/sulemanraza193',
    live: '',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Passport.js'],
    category: 'Full Stack',
    featured: true,
  },
  {
    _id: 'local-2',
    title: 'WhatsApp Automation Bot',
    description: 'End-to-end message routing and automation built on n8n Cloud and the Meta WhatsApp Cloud API.',
    image: '',
    github: 'https://github.com/sulemanraza193',
    live: '',
    techStack: ['n8n', 'WhatsApp Cloud API', 'Webhooks'],
    category: 'Automation',
    featured: false,
  },
  {
    _id: 'local-3',
    title: 'ML Image Classifier',
    description: 'Flask web app using a pre-trained ResNet50 model with full user authentication on Neon PostgreSQL.',
    image: '',
    github: 'https://github.com/sulemanraza193',
    live: '',
    techStack: ['Flask', 'PyTorch', 'ResNet50', 'PostgreSQL'],
    category: 'Machine Learning',
    featured: true,
  },
];

export const codingProfiles = [
  { name: 'GitHub', url: 'https://github.com/sulemanraza193' },
  { name: 'LeetCode', url: 'https://leetcode.com' },
  { name: 'Codeforces', url: 'https://codeforces.com' },
  { name: 'HackerRank', url: 'https://hackerrank.com' },
  { name: 'LinkedIn', url: 'https://linkedin.com' },
];
