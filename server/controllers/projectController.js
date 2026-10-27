import Project from '../models/Project.js';

export async function getProjects(req, res, next) {
  try {
    const { category, featured, search } = req.query;
    const filter = { hidden: { $ne: true } };

    if (category && category !== 'All') filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search) filter.$text = { $search: search };

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

export async function getProjectById(req, res, next) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
}

export async function createProject(req, res, next) {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req, res, next) {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req, res, next) {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
}
