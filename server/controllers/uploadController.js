// POST /api/upload/image — admin only, returns a URL to embed in a project/blog record
export function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }
    res.status(201).json({ url: `/uploads/images/${req.file.filename}` });
  } catch (err) {
    next(err);
  }
}
