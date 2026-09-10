/**
 * Rule-based delay risk prediction for SIH prototype.
 * Transparent, explainable — not ML-based.
 */
export const predictDelay = ({
  progressPercentage = 0,
  expectedProgress = 0,
  overdueTasks = 0,
  blockedTasks = 0,
  budgetUtilization = 0,
  daysRemaining = 0,
  delayedMilestones = 0,
}) => {
  let riskScore = 0;
  const reasons = [];

  const progressGap = expectedProgress - progressPercentage;
  if (progressGap > 15) {
    riskScore += 30;
    reasons.push(`Progress (${progressPercentage}%) is below expected level (${expectedProgress}%)`);
  } else if (progressGap > 5) {
    riskScore += 15;
    reasons.push('Progress slightly behind schedule');
  }

  if (overdueTasks >= 10) {
    riskScore += 25;
    reasons.push(`${overdueTasks} overdue tasks detected`);
  } else if (overdueTasks >= 3) {
    riskScore += 15;
    reasons.push(`${overdueTasks} overdue tasks`);
  } else if (overdueTasks > 0) {
    riskScore += 5;
    reasons.push(`${overdueTasks} overdue task(s)`);
  }

  if (blockedTasks >= 3) {
    riskScore += 15;
    reasons.push(`${blockedTasks} blocked tasks causing bottlenecks`);
  } else if (blockedTasks > 0) {
    riskScore += 8;
    reasons.push(`${blockedTasks} blocked task(s)`);
  }

  if (budgetUtilization > progressPercentage + 15) {
    riskScore += 20;
    reasons.push(`High budget utilization (${budgetUtilization}%) vs progress (${progressPercentage}%)`);
  }

  if (delayedMilestones >= 2) {
    riskScore += 15;
    reasons.push(`${delayedMilestones} milestones delayed`);
  } else if (delayedMilestones === 1) {
    riskScore += 8;
    reasons.push('1 milestone delayed');
  }

  if (daysRemaining < 30 && progressPercentage < 80) {
    riskScore += 10;
    reasons.push(`Only ${daysRemaining} days remaining with ${progressPercentage}% progress`);
  }

  let prediction = 'LOW DELAY RISK';
  if (riskScore >= 60) prediction = 'HIGH DELAY RISK';
  else if (riskScore >= 35) prediction = 'MEDIUM DELAY RISK';

  const estimatedDelay = Math.round((riskScore / 100) * Math.max(daysRemaining * 0.3, 7));

  return {
    prediction,
    riskScore: Math.min(riskScore, 100),
    estimatedDelayDays: estimatedDelay,
    reasons: reasons.length ? reasons : ['Project is progressing within acceptable parameters'],
  };
};
