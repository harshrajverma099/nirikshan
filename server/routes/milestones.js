import express from 'express';
import Milestone from '../models/Milestone.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const filter = {};
  if (req.query.project) filter.project = req.query.project;
  const milestones = await Milestone.find(filter)
    .populate('project', 'name projectId')
    .sort('order');
  res.json(milestones);
});

router.post('/', protect, authorize('super_admin', 'department_officer', 'project_manager'), async (req, res) => {
  const milestone = await Milestone.create(req.body);
  const populated = await Milestone.findById(milestone._id).populate('project', 'name projectId');
  res.status(201).json(populated);
});

router.put('/:id', protect, authorize('super_admin', 'department_officer', 'project_manager'), async (req, res) => {
  const milestone = await Milestone.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .populate('project', 'name projectId');
  if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
  res.json(milestone);
});

router.delete('/:id', protect, authorize('super_admin', 'department_officer', 'project_manager'), async (req, res) => {
  const milestone = await Milestone.findByIdAndDelete(req.params.id);
  if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
  res.json({ message: 'Milestone deleted' });
});

export default router;
