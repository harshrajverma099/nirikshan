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
    const lowerEmail = email.toLowerCase();

    // Try MongoDB authentication if database is connected
    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({ email: lowerEmail }).populate('department', 'name code');
        if (user && (await user.comparePassword(password))) {
          if (!user.isActive) return res.status(403).json({ message: 'Account is inactive' });
          return res.json({
            token: generateToken(user._id),
            user: { ...user.toJSON(), department: user.department },
          });
        }
      } catch (err) {
        console.error('MongoDB login error, using demo fallback:', err.message);
      }
    }

    // Fallback demo accounts for instant online demo functionality
    const DEMO_USERS = {
      'admin@nirikshan.demo': {
        _id: '6aa301d0497df46e3ec21784',
        name: 'Super Admin',
        email: 'admin@nirikshan.demo',
        role: 'super_admin',
        department: { _id: 'dept1', name: 'Public Works Department', code: 'PWD' },
        isActive: true,
        isDemo: true
      },
      'officer@nirikshan.demo': {
        _id: '6aa301d0497df46e3ec21785',
        name: 'Dept Officer',
        email: 'officer@nirikshan.demo',
        role: 'department_officer',
        department: { _id: 'dept1', name: 'Public Works Department', code: 'PWD' },
        isActive: true,
        isDemo: true
      },
      'manager@nirikshan.demo': {
        _id: '6aa301d0497df46e3ec21786',
        name: 'Project Manager',
        email: 'manager@nirikshan.demo',
        role: 'project_manager',
        department: { _id: 'dept1', name: 'Public Works Department', code: 'PWD' },
        isActive: true,
        isDemo: true
      },
      'member@nirikshan.demo': {
        _id: '6aa301d0497df46e3ec21787',
        name: 'Team Member',
        email: 'member@nirikshan.demo',
        role: 'team_member',
        department: { _id: 'dept1', name: 'Public Works Department', code: 'PWD' },
        isActive: true,
        isDemo: true
      }
    };

    const demoUser = DEMO_USERS[lowerEmail];
    if (demoUser && (password === 'Demo@123' || password === 'demo123' || password === 'Demo123')) {
      return res.json({
        token: generateToken(demoUser._id),
        user: demoUser,
      });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
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
