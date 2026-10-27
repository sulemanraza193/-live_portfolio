import Experience from '../models/Experience.js';

export async function getExperience(req, res, next) {
  try {
    const experience = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.json(experience);
  } catch (err) {
    next(err);
  }
}

export async function createExperience(req, res, next) {
  try {
    const item = await Experience.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function updateExperience(req, res, next) {
  try {
    const item = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      res.status(404);
      throw new Error('Experience entry not found');
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function deleteExperience(req, res, next) {
  try {
    const item = await Experience.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Experience entry not found');
    }
    res.json({ success: true, message: 'Experience entry deleted' });
  } catch (err) {
    next(err);
  }
}
