/**
 * Prototype Project Health Algorithm
 * NOT an official government formula — for SIH demo purposes only.
 */
export const calculateHealthScore = ({
  progressPercentage = 0,
  startDate,
  expectedCompletionDate,
  totalBudget = 1,
  utilizedBudget = 0,
  milestoneCompletionRate = 0,
  overdueTaskCount = 0,
  totalTasks = 1,
  riskLevel = 'Low',
}) => {
  const progressScore = progressPercentage / 100;

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(expectedCompletionDate);
  const totalDuration = Math.max(end - start, 1);
  const elapsed = Math.min(Math.max(now - start, 0), totalDuration);
  const expectedProgress = (elapsed / totalDuration) * 100;
  const timelineRatio = expectedProgress > 0 ? Math.min(progressPercentage / expectedProgress, 1) : 1;
  const timelineScore = timelineRatio;

  const budgetUtil = totalBudget > 0 ? (utilizedBudget / totalBudget) * 100 : 0;
  const budgetRatio = progressPercentage > 0 ? Math.min(progressPercentage / Math.max(budgetUtil, 1), 1) : 1;
  const budgetScore = budgetRatio;

  const milestoneScore = milestoneCompletionRate / 100;

  const overdueRatio = totalTasks > 0 ? overdueTaskCount / totalTasks : 0;
  const overduePenalty = 1 - Math.min(overdueRatio * 0.5, 0.4);

  const riskPenalties = { Low: 1, Medium: 0.9, High: 0.75, Critical: 0.55 };
  const riskPenalty = riskPenalties[riskLevel] || 0.9;

  const raw =
    progressScore * 0.25 +
    timelineScore * 0.25 +
    budgetScore * 0.2 +
    milestoneScore * 0.2 +
    overduePenalty * 0.1;

  const score = Math.round(Math.min(Math.max(raw * riskPenalty * 100, 0), 100));

  let label = 'Critical';
  if (score >= 90) label = 'Excellent';
  else if (score >= 75) label = 'Good';
  else if (score >= 50) label = 'At Risk';

  return { score, label, expectedProgress: Math.round(expectedProgress) };
};

export const getHealthLabel = (score) => {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 50) return 'At Risk';
  return 'Critical';
};
