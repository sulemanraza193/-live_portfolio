import Skill from '../models/Skill.js';

export async function getSkills(req, res, next) {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1 });
    res.json(skills);
  } catch (err) {
    next(err);
  }
}

export async function createSkill(req, res, next) {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (err) {
    next(err);
  }
}

export async function updateSkill(req, res, next) {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!skill) {
      res.status(404);
      throw new Error('Skill not found');
    }
    res.json(skill);
  } catch (err) {
    next(err);
  }
}

export async function deleteSkill(req, res, next) {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      res.status(404);
      throw new Error('Skill not found');
    }
    res.json({ success: true, message: 'Skill deleted' });
  } catch (err) {
    next(err);
  }
}
