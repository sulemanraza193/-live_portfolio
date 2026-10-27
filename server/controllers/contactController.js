import Contact from '../models/Contact.js';

export async function submitContact(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;
    const entry = await Contact.create({ name, email, subject, message });
    res.status(201).json({
      success: true,
      message: "Message sent — I'll get back to you soon.",
      id: entry._id,
    });
  } catch (err) {
    next(err);
  }
}

export async function getMessages(req, res, next) {
  try {
    const { search, read } = req.query;
    const filter = {};
    if (read === 'true') filter.read = true;
    if (read === 'false') filter.read = false;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }
    const messages = await Contact.find(filter).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    next(err);
  }
}

export async function markMessageRead(req, res, next) {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }
    res.json(message);
  } catch (err) {
    next(err);
  }
}

export async function deleteMessage(req, res, next) {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) {
      res.status(404);
      throw new Error('Message not found');
    }
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    next(err);
  }
}
