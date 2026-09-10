import express from 'express';
import Department from '../models/Department.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const departments = await Department.find({ isActive: true }).populate('head', 'name email').sort('name');
  res.json(departments);
});

router.post('/', protect, authorize('super_admin'), async (req, res) => {
  const dept = await Department.create(req.body);
  res.status(201).json(dept);
});

router.put('/:id', protect, authorize('super_admin'), async (req, res) => {
  const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!dept) return res.status(404).json({ message: 'Department not found' });
  res.json(dept);
});

router.delete('/:id', protect, authorize('super_admin'), async (req, res) => {
  const dept = await Department.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!dept) return res.status(404).json({ message: 'Department not found' });
  res.json({ message: 'Department deactivated' });
});

export default router;
