import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateToken, protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).populate('department', 'name code');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.isActive) return res.status(403).json({ message: 'Account is inactive' });

    res.json({
      token: generateToken(user._id),
      user: { ...user.toJSON(), department: user.department },
    });
  }
);

router.post(
  '/register',
  protect,
  authorize('super_admin', 'department_officer'),
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['super_admin', 'department_officer', 'project_manager', 'team_member']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const existing = await User.findOne({ email: req.body.email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create(req.body);
    res.status(201).json(user);
  }
);

router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

router.post('/forgot-password', async (req, res) => {
  res.json({
    message: 'Demo environment: use demo accounts with password Demo@123. Password reset is simulated.',
  });
});

export default router;
