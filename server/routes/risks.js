import express from 'express';
import Risk from '../models/Risk.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  const filter = {};
  if (req.query.project) filter.project = req.query.project;
  if (req.query.severity) filter.severity = req.query.severity;
  const risks = await Risk.find(filter)
    .populate('project', 'name projectId')
    .populate('owner', 'name email')
    .sort('-riskScore');
  res.json(risks);
});

router.post('/', protect, authorize('super_admin', 'department_officer', 'project_manager'), async (req, res) => {
  const count = await Risk.countDocuments();
  const riskId = req.body.riskId || `RSK-${String(count + 1).padStart(4, '0')}`;
  const risk = await Risk.create({ ...req.body, riskId });
  const populated = await Risk.findById(risk._id)
    .populate('project', 'name projectId')
    .populate('owner', 'name email');
  res.status(201).json(populated);
});

router.put('/:id', protect, authorize('super_admin', 'department_officer', 'project_manager'), async (req, res) => {
  const risk = await Risk.findById(req.params.id);
  if (!risk) return res.status(404).json({ message: 'Risk not found' });
  Object.assign(risk, req.body);
  await risk.save();
  const populated = await Risk.findById(risk._id)
    .populate('project', 'name projectId')
    .populate('owner', 'name email');
  res.json(populated);
});

router.delete('/:id', protect, authorize('super_admin', 'department_officer', 'project_manager'), async (req, res) => {
  const risk = await Risk.findByIdAndDelete(req.params.id);
  if (!risk) return res.status(404).json({ message: 'Risk not found' });
  res.json({ message: 'Risk deleted' });
});

export default router;
