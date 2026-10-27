import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import projectRoutes from './routes/projects.js';
import contactRoutes from './routes/contact.js';
import authRoutes from './routes/auth.js';
import skillRoutes from './routes/skills.js';
import experienceRoutes from './routes/experience.js';
import serviceRoutes from './routes/services.js';
import resumeRoutes from './routes/resume.js';
import uploadRoutes from './routes/upload.js';
import dashboardRoutes from './routes/dashboard.js';
import blogRoutes from './routes/blog.js';
import githubRoutes from './routes/github.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { sanitizeBody } from './middleware/sanitize.js';

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

await connectDB();

// --- Security & core middleware ---
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(',') || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(sanitizeBody);

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', apiLimiter);

// --- Static file serving for uploaded images/resume ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Routes ---
app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', contactRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/github', githubRoutes);

// --- Error handling ---
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
