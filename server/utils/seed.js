import 'dotenv/config';
import connectDB from '../config/db.js';
import Project from '../models/Project.js';

const projects = [
  {
    title: 'Team Task Manager',
    description:
      'Production task management app with role-based auth, cross-domain sessions, and full CRUD, deployed on Railway and Vercel.',
    image: '',
    github: 'https://github.com/sulemanraza193',
    live: '',
    techStack: ['React', 'Vite', 'Node.js', 'Express', 'PostgreSQL', 'Passport.js'],
    category: 'Full Stack',
    featured: true,
  },
  {
    title: 'WhatsApp Automation Bot',
    description:
      'End-to-end message routing and automation built on n8n Cloud and the Meta WhatsApp Cloud API, with permanent system user tokens.',
    image: '',
    github: 'https://github.com/sulemanraza193',
    live: '',
    techStack: ['n8n', 'WhatsApp Cloud API', 'Webhooks'],
    category: 'Automation',
    featured: false,
  },
  {
    title: 'ML Image Classifier',
    description:
      'Flask web app using a pre-trained ResNet50 model with full user authentication backed by Neon PostgreSQL via SQLAlchemy.',
    image: '',
    github: 'https://github.com/sulemanraza193',
    live: '',
    techStack: ['Flask', 'PyTorch', 'ResNet50', 'PostgreSQL'],
    category: 'Machine Learning',
    featured: true,
  },
];

async function seed() {
  await connectDB();
  await Project.deleteMany({});
  await Project.insertMany(projects);
  console.log(`Seeded ${projects.length} projects.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
