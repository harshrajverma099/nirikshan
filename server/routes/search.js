import express from 'express';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import Department from '../models/Department.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const q = req.query.q?.trim();
  if (!q || q.length < 2) return res.json({ projects: [], tasks: [], users: [], departments: [] });

  const regex = new RegExp(q, 'i');
  const [projects, tasks, users, departments] = await Promise.all([
    Project.find({ $or: [{ name: regex }, { projectId: regex }, { location: regex }] })
      .select('name projectId status riskLevel progressPercentage')
      .limit(10),
    Task.find({ name: regex }).populate('project', 'name projectId').limit(10),
    User.find({ $or: [{ name: regex }, { email: regex }], isActive: true })
      .select('name email role')
      .limit(10),
    Department.find({ $or: [{ name: regex }, { code: regex }], isActive: true }).limit(10),
  ]);

  res.json({ projects, tasks, users, departments });
});

export default router;
