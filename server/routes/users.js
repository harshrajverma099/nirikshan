import express from 'express';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('super_admin', 'department_officer'), async (req, res) => {
  const filter = {};
  if (req.user.role === 'department_officer' && req.user.department) {
    filter.department = req.user.department._id;
  }
  const users = await User.find(filter).populate('department', 'name code').sort('name');
  res.json(users);
});

router.get('/:id', protect, async (req, res) => {
  const user = await User.findById(req.params.id).populate('department', 'name code');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

router.put('/:id', protect, authorize('super_admin'), async (req, res) => {
  const { password, ...updates } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  Object.assign(user, updates);
  if (password) user.password = password;
  await user.save();
  res.json(user);
});

router.delete('/:id', protect, authorize('super_admin'), async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deactivated' });
});

export default router;
