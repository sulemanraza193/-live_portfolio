import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

// JWTs are stateless, so logout is handled by the client discarding the
// token. This endpoint exists for a consistent API surface.
export function logout(req, res) {
  res.json({ success: true, message: 'Logged out' });
}

export async function getMe(req, res) {
  res.json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role,
  });
}
