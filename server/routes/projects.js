import express from 'express';
import Project from '../models/Project.js';
import Budget from '../models/Budget.js';
import Task from '../models/Task.js';
import Milestone from '../models/Milestone.js';
import Risk from '../models/Risk.js';
import ProjectUpdate from '../models/ProjectUpdate.js';
import Document from '../models/Document.js';
import { protect, authorize } from '../middleware/auth.js';
import { computeProjectMetrics } from '../utils/projectMetrics.js';

const router = express.Router();

const populateProject = (query) =>
  query
    .populate('department', 'name code')
    .populate('projectManager', 'name email role')
    .populate('teamMembers', 'name email role');

const buildProjectFilter = (req) => {
  const filter = {};
  const { department, status, risk, priority, location, search } = req.query;

  if (req.user.role === 'department_officer' && req.user.department) {
    filter.department = req.user.department._id;
  }
  if (req.user.role === 'project_manager') {
    filter.projectManager = req.user._id;
  }
  if (req.user.role === 'team_member') {
    filter.teamMembers = req.user._id;
  }
  if (department) filter.department = department;
  if (status) filter.status = status;
  if (risk) filter.riskLevel = risk;
  if (priority) filter.priority = priority;
  if (location) filter.location = new RegExp(location, 'i');
  if (search) filter.name = new RegExp(search, 'i');
  return filter;
};

router.get('/', protect, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const filter = buildProjectFilter(req);

  const [projects, total] = await Promise.all([
    populateProject(Project.find(filter).sort('-createdAt').skip((page - 1) * limit).limit(limit)),
    Project.countDocuments(filter),
  ]);

  const enriched = await Promise.all(
    projects.map(async (p) => {
      const metrics = await computeProjectMetrics(p);
      return { ...p.toObject(), metrics };
    })
  );

  res.json({ projects: enriched, total, page, pages: Math.ceil(total / limit) });
});

router.get('/map', protect, async (req, res) => {
  const filter = buildProjectFilter(req);
  const projects = await Project.find(filter).select(
    'name location coordinates progressPercentage totalBudget utilizedBudget riskLevel status projectId'
  );
  res.json(projects);
});

router.get('/:id', protect, async (req, res) => {
  const project = await populateProject(Project.findById(req.params.id));
  if (!project) return res.status(404).json({ message: 'Project not found' });

  const [tasks, milestones, risks, updates, documents, budget, metrics] = await Promise.all([
    Task.find({ project: project._id }).populate('assignedTo', 'name email').sort('-createdAt'),
    Milestone.find({ project: project._id }).sort('order'),
    Risk.find({ project: project._id }).populate('owner', 'name email'),
    ProjectUpdate.find({ project: project._id }).populate('author', 'name email').sort('-createdAt'),
    Document.find({ project: project._id }).populate('uploadedBy', 'name email').sort('-createdAt'),
    Budget.findOne({ project: project._id }),
    computeProjectMetrics(project),
  ]);

  res.json({ project, tasks, milestones, risks, updates, documents, budget, metrics });
});

router.get('/:id/report', protect, async (req, res) => {
  const project = await populateProject(Project.findById(req.params.id));
  if (!project) return res.status(404).json({ message: 'Project not found' });

  const [tasks, milestones, risks, updates, metrics] = await Promise.all([
    Task.find({ project: project._id }).populate('assignedTo', 'name email'),
    Milestone.find({ project: project._id }).sort('order'),
    Risk.find({ project: project._id }),
    ProjectUpdate.find({ project: project._id }).populate('author', 'name email').sort('-createdAt').limit(5),
    computeProjectMetrics(project),
  ]);

  res.json({ project, tasks, milestones, risks, updates, metrics, generatedAt: new Date() });
});

router.post('/', protect, authorize('super_admin', 'department_officer'), async (req, res) => {
  const count = await Project.countDocuments();
  const projectId = req.body.projectId || `PRJ-${String(count + 1).padStart(4, '0')}`;

  const project = await Project.create({ ...req.body, projectId });
  await Budget.create({
    project: project._id,
    approvedBudget: project.totalBudget,
    allocatedBudget: project.totalBudget,
    utilizedBudget: project.utilizedBudget || 0,
    remainingBudget: project.totalBudget - (project.utilizedBudget || 0),
    utilizationPercentage: project.totalBudget
      ? Math.round(((project.utilizedBudget || 0) / project.totalBudget) * 100)
      : 0,
  });

  const populated = await populateProject(Project.findById(project._id));
  res.status(201).json(populated);
});

router.put('/:id', protect, authorize('super_admin', 'department_officer', 'project_manager'), async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!project) return res.status(404).json({ message: 'Project not found' });

  if (req.body.utilizedBudget !== undefined) {
    await Budget.findOneAndUpdate(
      { project: project._id },
      {
        utilizedBudget: project.utilizedBudget,
        remainingBudget: project.totalBudget - project.utilizedBudget,
        utilizationPercentage: Math.round((project.utilizedBudget / project.totalBudget) * 100),
      }
    );
  }

  const metrics = await computeProjectMetrics(project);
  project.healthScore = metrics.healthScore;
  await project.save();

  const populated = await populateProject(Project.findById(project._id));
  res.json({ ...populated.toObject(), metrics });
});

router.delete('/:id', protect, authorize('super_admin', 'department_officer'), async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  await Promise.all([
    Task.deleteMany({ project: project._id }),
    Milestone.deleteMany({ project: project._id }),
    Risk.deleteMany({ project: project._id }),
    Budget.deleteOne({ project: project._id }),
  ]);
  res.json({ message: 'Project deleted' });
});

export default router;
