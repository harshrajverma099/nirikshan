import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'nirikshan_sih2026_demo_secret_change_in_production';

const DEMO_USERS_BY_ID = {
  '6aa301d0497df46e3ec21784': {
    _id: '6aa301d0497df46e3ec21784',
    name: 'Super Admin',
    email: 'admin@nirikshan.demo',
    role: 'super_admin',
    department: { _id: 'dept1', name: 'Public Works Department', code: 'PWD' },
    isActive: true,
    isDemo: true
  },
  '6aa301d0497df46e3ec21785': {
    _id: '6aa301d0497df46e3ec21785',
    name: 'Dept Officer',
    email: 'officer@nirikshan.demo',
    role: 'department_officer',
    department: { _id: 'dept1', name: 'Public Works Department', code: 'PWD' },
    isActive: true,
    isDemo: true
  },
  '6aa301d0497df46e3ec21786': {
    _id: '6aa301d0497df46e3ec21786',
    name: 'Project Manager',
    email: 'manager@nirikshan.demo',
    role: 'project_manager',
    department: { _id: 'dept1', name: 'Public Works Department', code: 'PWD' },
    isActive: true,
    isDemo: true
  },
  '6aa301d0497df46e3ec21787': {
    _id: '6aa301d0497df46e3ec21787',
    name: 'Team Member',
    email: 'member@nirikshan.demo',
    role: 'team_member',
    department: { _id: 'dept1', name: 'Public Works Department', code: 'PWD' },
    isActive: true,
    isDemo: true
  }
};

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findById(decoded.id).select('-password').populate('department', 'name code');
        if (user && user.isActive) {
          req.user = user;
          return next();
        }
      } catch (err) {
        console.error('DB fetch user error, using demo fallback:', err.message);
      }
    }

    const demoUser = DEMO_USERS_BY_ID[decoded.id] || DEMO_USERS_BY_ID['6aa301d0497df46e3ec21784'];
    req.user = demoUser;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied for your role' });
  }
  next();
};

export const generateToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
