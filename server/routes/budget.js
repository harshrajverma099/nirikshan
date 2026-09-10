import express from 'express';
import Budget from '../models/Budget.js';
import Project from '../models/Project.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const filter = {};
  if (req.query.project) filter.project = req.query.project;
  const budgets = await Budget.find(filter).populate('project', 'name projectId progressPercentage status');
  res.json(budgets);
});

router.get('/:projectId', protect, async (req, res) => {
  const budget = await Budget.findOne({ project: req.params.projectId }).populate(
    'project',
    'name projectId progressPercentage totalBudget utilizedBudget'
  );
  if (!budget) return res.status(404).json({ message: 'Budget not found' });
  res.json(budget);
});

router.put('/:projectId', protect, authorize('super_admin', 'department_officer', 'project_manager'), async (req, res) => {
  const budget = await Budget.findOne({ project: req.params.projectId });
  if (!budget) return res.status(404).json({ message: 'Budget not found' });

  if (req.body.entry) {
    budget.entries.push(req.body.entry);
    budget.utilizedBudget += req.body.entry.amount;
  }
  if (req.body.utilizedBudget !== undefined) budget.utilizedBudget = req.body.utilizedBudget;
  budget.remainingBudget = budget.approvedBudget - budget.utilizedBudget;
  budget.utilizationPercentage = Math.round((budget.utilizedBudget / budget.approvedBudget) * 100);
  await budget.save();

  await Project.findByIdAndUpdate(req.params.projectId, { utilizedBudget: budget.utilizedBudget });

  const populated = await Budget.findById(budget._id).populate('project', 'name projectId progressPercentage');
  res.json(populated);
});

export default router;
