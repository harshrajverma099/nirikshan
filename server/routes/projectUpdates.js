import express from 'express';
import ProjectUpdate from '../models/ProjectUpdate.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const filter = {};
  if (req.query.project) filter.project = req.query.project;
  const updates = await ProjectUpdate.find(filter)
    .populate('author', 'name email')
    .populate('project', 'name projectId')
    .sort('-createdAt');
  res.json(updates);
});

router.post('/', protect, authorize('super_admin', 'department_officer', 'project_manager'), async (req, res) => {
  const update = await ProjectUpdate.create({ ...req.body, author: req.user._id });
  const populated = await ProjectUpdate.findById(update._id)
    .populate('author', 'name email')
    .populate('project', 'name projectId');
  res.status(201).json(populated);
});

router.post('/:id/comments', protect, async (req, res) => {
  const update = await ProjectUpdate.findById(req.params.id);
  if (!update) return res.status(404).json({ message: 'Update not found' });
  update.comments.push({ user: req.user._id, text: req.body.text });
  await update.save();
  const populated = await ProjectUpdate.findById(update._id)
    .populate('author', 'name email')
    .populate('comments.user', 'name email');
  res.json(populated);
});

export default router;
