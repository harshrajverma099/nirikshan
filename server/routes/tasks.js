import express from 'express';
import Task from '../models/Task.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const filter = {};
  const { project, status, priority, search, assignedTo } = req.query;

  if (project) filter.project = project;
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignedTo) filter.assignedTo = assignedTo;
  if (search) filter.name = new RegExp(search, 'i');

  if (req.user.role === 'team_member') filter.assignedTo = req.user._id;
  if (req.user.role === 'project_manager') {
    const Project = (await import('../models/Project.js')).default;
    const managed = await Project.find({ projectManager: req.user._id }).select('_id');
    filter.project = { $in: managed.map((p) => p._id) };
  }

  const tasks = await Task.find(filter)
    .populate('assignedTo', 'name email')
    .populate('project', 'name projectId status')
    .sort('-createdAt');
  res.json(tasks);
});

router.post('/', protect, authorize('super_admin', 'department_officer', 'project_manager'), async (req, res) => {
  const task = await Task.create(req.body);
  const populated = await Task.findById(task._id)
    .populate('assignedTo', 'name email')
    .populate('project', 'name projectId');
  res.status(201).json(populated);
});

router.put('/:id', protect, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  const canEdit =
    ['super_admin', 'department_officer', 'project_manager'].includes(req.user.role) ||
    task.assignedTo.toString() === req.user._id.toString();
  if (!canEdit) return res.status(403).json({ message: 'Not authorized to edit this task' });

  Object.assign(task, req.body);
  if (task.dueDate < new Date() && task.status !== 'Completed') task.status = 'Overdue';
  await task.save();

  const populated = await Task.findById(task._id)
    .populate('assignedTo', 'name email')
    .populate('project', 'name projectId');
  res.json(populated);
});

router.post('/:id/comments', protect, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  task.comments.push({ user: req.user._id, text: req.body.text });
  await task.save();
  const populated = await Task.findById(task._id)
    .populate('assignedTo', 'name email')
    .populate('project', 'name projectId')
    .populate('comments.user', 'name email');
  res.json(populated);
});

router.delete('/:id', protect, authorize('super_admin', 'department_officer', 'project_manager'), async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task deleted' });
});

export default router;
