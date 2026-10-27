import fs from 'fs';
import path from 'path';
import Resume from '../models/Resume.js';

// GET /api/resume — public, returns latest resume metadata
export async function getResume(req, res, next) {
  try {
    const resume = await Resume.findOne().sort({ createdAt: -1 });
    if (!resume) {
      res.status(404);
      throw new Error('No resume uploaded yet');
    }
    res.json(resume);
  } catch (err) {
    next(err);
  }
}

// POST /api/resume — admin only, replaces the current resume
export async function uploadResume(req, res, next) {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    const previous = await Resume.find();
    for (const old of previous) {
      const filePath = path.join(process.cwd(), 'uploads', 'resume', old.filename);
      fs.unlink(filePath, () => {});
    }
    await Resume.deleteMany({});

    const resume = await Resume.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: `/uploads/resume/${req.file.filename}`,
    });

    res.status(201).json(resume);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/resume — admin only
export async function deleteResume(req, res, next) {
  try {
    const resume = await Resume.findOne().sort({ createdAt: -1 });
    if (!resume) {
      res.status(404);
      throw new Error('No resume to delete');
    }
    const filePath = path.join(process.cwd(), 'uploads', 'resume', resume.filename);
    fs.unlink(filePath, () => {});
    await Resume.deleteMany({});
    res.json({ success: true, message: 'Resume deleted' });
  } catch (err) {
    next(err);
  }
}
