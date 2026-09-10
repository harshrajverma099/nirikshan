import express from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Risk from '../models/Risk.js';
import Department from '../models/Department.js';
import { protect } from '../middleware/auth.js';
import { computeProjectMetrics } from '../utils/projectMetrics.js';
import { MOCK_PROJECTS, MOCK_TASKS, MOCK_RISKS, MOCK_DEPARTMENTS } from '../utils/mockData.js';

const router = express.Router();

router.get('/dashboard', protect, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const totalProjects = MOCK_PROJECTS.length;
    const activeProjects = MOCK_PROJECTS.filter((p) => p.status === 'Active').length;
    const completedProjects = MOCK_PROJECTS.filter((p) => p.status === 'Completed').length;
    const delayedProjects = MOCK_PROJECTS.filter((p) => p.status === 'Delayed').length;
    const totalBudget = MOCK_PROJECTS.reduce((s, p) => s + p.totalBudget, 0);
    const utilizedBudget = MOCK_PROJECTS.reduce((s, p) => s + p.utilizedBudget, 0);
    const highRiskProjects = MOCK_PROJECTS.filter((p) => ['High', 'Critical'].includes(p.riskLevel)).length;

    return res.json({
      totalProjects,
      activeProjects,
      completedProjects,
      delayedProjects,
      totalBudget,
      utilizedBudget,
      highRiskProjects,
      budgetUtilizationPercent: totalBudget ? Math.round((utilizedBudget / totalBudget) * 100) : 0,
    });
  }

  const [projects, tasks, risks] = await Promise.all([
    Project.find(),
    Task.find(),
    Risk.find(),
  ]);

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'Active').length;
  const completedProjects = projects.filter((p) => p.status === 'Completed').length;
  const delayedProjects = projects.filter((p) => p.status === 'Delayed').length;
  const totalBudget = projects.reduce((s, p) => s + p.totalBudget, 0);
  const utilizedBudget = projects.reduce((s, p) => s + p.utilizedBudget, 0);
  const highRiskProjects = projects.filter((p) => ['High', 'Critical'].includes(p.riskLevel)).length;

  res.json({
    totalProjects,
    activeProjects,
    completedProjects,
    delayedProjects,
    totalBudget,
    utilizedBudget,
    highRiskProjects,
    budgetUtilizationPercent: totalBudget ? Math.round((utilizedBudget / totalBudget) * 100) : 0,
  });
});

router.get('/executive', protect, async (req, res) => {
  const projects = await Project.find().populate('department', 'name code');
  const tasks = await Task.find({ status: { $in: ['Overdue', 'Blocked'] } }).populate('project', 'name projectId');

  const enriched = await Promise.all(
    projects.map(async (p) => ({ project: p, metrics: await computeProjectMetrics(p) }))
  );

  const critical = enriched.filter(
    (e) => e.metrics.healthScore < 50 || e.project.riskLevel === 'Critical' || e.project.status === 'Delayed'
  );
  const warning = enriched.filter(
    (e) =>
      e.metrics.delayPrediction.prediction !== 'LOW DELAY RISK' &&
      !critical.find((c) => c.project._id.toString() === e.project._id.toString())
  );
  const onTrack = enriched.filter(
    (e) =>
      !critical.find((c) => c.project._id.toString() === e.project._id.toString()) &&
      !warning.find((w) => w.project._id.toString() === e.project._id.toString())
  );

  const deptProblems = {};
  for (const e of [...critical, ...warning]) {
    const deptName = e.project.department?.name || 'Unknown';
    deptProblems[deptName] = (deptProblems[deptName] || 0) + 1;
  }

  res.json({
    activeProjects: projects.filter((p) => p.status === 'Active').length,
    delayedProjects: projects.filter((p) => p.status === 'Delayed').map((p) => ({
      _id: p._id,
      name: p.name,
      projectId: p.projectId,
      progress: p.progressPercentage,
    })),
    highRiskProjects: projects
      .filter((p) => ['High', 'Critical'].includes(p.riskLevel))
      .map((p) => ({ _id: p._id, name: p.name, projectId: p.projectId, riskLevel: p.riskLevel })),
    budgetByDepartment: await getBudgetByDepartment(),
    departmentProblems: deptProblems,
    overdueTasks: tasks.filter((t) => t.status === 'Overdue'),
    blockedTasks: tasks.filter((t) => t.status === 'Blocked'),
    actionRequired: {
      critical: critical.length,
      warning: warning.length,
      onTrack: onTrack.length,
    },
    criticalProjects: critical.map((e) => ({
      ...e.project.toObject(),
      metrics: e.metrics,
    })),
    warningProjects: warning.map((e) => ({
      ...e.project.toObject(),
      metrics: e.metrics,
    })),
  });
});

router.get('/charts', protect, async (req, res) => {
  const [projects, tasks, risks, departments] = await Promise.all([
    Project.find().populate('department', 'name'),
    Task.find(),
    Risk.find(),
    Department.find({ isActive: true }),
  ]);

  const projectsByStatus = ['Planning', 'Active', 'On Hold', 'Delayed', 'Completed', 'Cancelled'].map(
    (status) => ({ status, count: projects.filter((p) => p.status === status).length })
  );

  const budgetData = projects.map((p) => ({
    name: p.name.substring(0, 20),
    approved: p.totalBudget,
    utilized: p.utilizedBudget,
    remaining: p.totalBudget - p.utilizedBudget,
  }));

  const deptProjects = departments.map((d) => ({
    department: d.name,
    count: projects.filter((p) => p.department?._id?.toString() === d._id.toString()).length,
  }));

  const riskDistribution = ['Low', 'Medium', 'High', 'Critical'].map((severity) => ({
    severity,
    count: risks.filter((r) => r.severity === severity).length,
  }));

  const taskCompletion = ['To Do', 'In Progress', 'Completed', 'Blocked', 'Overdue'].map((status) => ({
    status,
    count: tasks.filter((t) => t.status === status).length,
  }));

  const monthlyProgress = generateMonthlyProgress(projects);

  const performanceData = await Promise.all(
    projects.slice(0, 10).map(async (p) => {
      const metrics = await computeProjectMetrics(p);
      return { name: p.name.substring(0, 15), health: metrics.healthScore, progress: p.progressPercentage };
    })
  );

  res.json({
    projectsByStatus,
    budgetData,
    deptProjects,
    riskDistribution,
    taskCompletion,
    monthlyProgress,
    performanceData,
    delayedProjects: projects.filter((p) => p.status === 'Delayed').length,
  });
});

async function getBudgetByDepartment() {
  const projects = await Project.find().populate('department', 'name');
  const map = {};
  for (const p of projects) {
    const name = p.department?.name || 'Unknown';
    if (!map[name]) map[name] = { utilized: 0, total: 0 };
    map[name].utilized += p.utilizedBudget;
    map[name].total += p.totalBudget;
  }
  return Object.entries(map).map(([department, data]) => ({ department, ...data }));
}

function generateMonthlyProgress(projects) {
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  return months.map((month, i) => ({
    month,
    avgProgress: Math.round(
      projects.reduce((s, p) => s + Math.min(p.progressPercentage, (i + 1) * 18), 0) / Math.max(projects.length, 1)
    ),
  }));
}

export default router;
