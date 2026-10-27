import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verifies the JWT signature/expiry and attaches the decoded payload to req.
export function verifyToken(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    res.status(401);
    return next(new Error('Not authorized — no token provided'));
  }

  const token = header.split(' ')[1];

  try {
    req.decoded = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401);
    next(new Error('Not authorized — invalid or expired token'));
  }
}

// Loads the authenticated user onto req.user. Use after verifyToken, or
// standalone as the combined "protect" guard for routes.
export async function authenticateUser(req, res, next) {
  try {
    if (!req.decoded) {
      return verifyToken(req, res, async (err) => {
        if (err) return next(err);
        await loadUser(req, res, next);
      });
    }
    await loadUser(req, res, next);
  } catch (err) {
    next(err);
  }
}

async function loadUser(req, res, next) {
  const user = await User.findById(req.decoded.id);
  if (!user) {
    res.status(401);
    return next(new Error('Not authorized — user no longer exists'));
  }
  req.user = user;
  next();
}
