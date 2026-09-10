import Task from '../models/Task.js';
import Milestone from '../models/Milestone.js';
import { calculateHealthScore } from './healthScore.js';
import { predictDelay } from './delayPrediction.js';

export const computeProjectMetrics = async (project) => {
  const tasks = await Task.find({ project: project._id });
  const milestones = await Milestone.find({ project: project._id }).sort('order');

  const totalTasks = tasks.length || 1;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const overdueTasks = tasks.filter((t) => t.status === 'Overdue' || (t.dueDate < new Date() && t.status !== 'Completed')).length;
  const blockedTasks = tasks.filter((t) => t.status === 'Blocked').length;
  const taskCompletionRate = Math.round((completedTasks / totalTasks) * 100);

  const totalMilestones = milestones.length || 1;
  const completedMilestones = milestones.filter((m) => m.status === 'Completed').length;
  const delayedMilestones = milestones.filter((m) => m.status === 'Delayed').length;
  const milestoneCompletionRate = Math.round((completedMilestones / totalMilestones) * 100);

  const budgetUtil = project.totalBudget > 0
    ? Math.round((project.utilizedBudget / project.totalBudget) * 100)
    : 0;

  const health = calculateHealthScore({
    progressPercentage: project.progressPercentage,
    startDate: project.startDate,
    expectedCompletionDate: project.expectedCompletionDate,
    totalBudget: project.totalBudget,
    utilizedBudget: project.utilizedBudget,
    milestoneCompletionRate,
    overdueTaskCount: overdueTasks,
    totalTasks,
    riskLevel: project.riskLevel,
  });

  const now = new Date();
  const daysRemaining = Math.max(
    Math.ceil((new Date(project.expectedCompletionDate) - now) / (1000 * 60 * 60 * 24)),
    0
  );

  const delay = predictDelay({
    progressPercentage: project.progressPercentage,
    expectedProgress: health.expectedProgress,
    overdueTasks,
    blockedTasks,
    budgetUtilization: budgetUtil,
    daysRemaining,
    delayedMilestones,
  });

  const budgetWarning =
    budgetUtil > project.progressPercentage + 10
      ? `Budget utilization is ${budgetUtil}%, while project progress is only ${project.progressPercentage}%.`
      : null;

  return {
    healthScore: health.score,
    healthLabel: health.label,
    expectedProgress: health.expectedProgress,
    taskCompletionRate,
    milestoneCompletionRate,
    overdueTasks,
    blockedTasks,
    completedTasks,
    totalTasks,
    completedMilestones,
    totalMilestones,
    budgetUtilization: budgetUtil,
    daysRemaining,
    delayPrediction: delay,
    budgetWarning,
  };
};
