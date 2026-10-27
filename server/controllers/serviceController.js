import Service from '../models/Service.js';

export async function getServices(req, res, next) {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    res.json(services);
  } catch (err) {
    next(err);
  }
}

export async function createService(req, res, next) {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
}

export async function updateService(req, res, next) {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }
    res.json(service);
  } catch (err) {
    next(err);
  }
}

export async function deleteService(req, res, next) {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      res.status(404);
      throw new Error('Service not found');
    }
    res.json({ success: true, message: 'Service deleted' });
  } catch (err) {
    next(err);
  }
}
