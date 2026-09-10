import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Department from '../models/Department.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Milestone from '../models/Milestone.js';
import Budget from '../models/Budget.js';
import Risk from '../models/Risk.js';
import ProjectUpdate from '../models/ProjectUpdate.js';
import Notification from '../models/Notification.js';

dotenv.config();

const DEMO_PASSWORD = 'Demo@123';

const departments = [
  { name: 'Public Works Department', code: 'PWD', description: 'Infrastructure and construction projects' },
  { name: 'Water Resources', code: 'WRD', description: 'Irrigation and water supply projects' },
  { name: 'Urban Development', code: 'UDD', description: 'Smart city and urban planning' },
  { name: 'Transport & Highways', code: 'THD', description: 'Road and transport infrastructure' },
  { name: 'Renewable Energy', code: 'RED', description: 'Solar and renewable energy initiatives' },
];

const projectTemplates = [
  { name: 'Metro Rail Extension Phase II', location: 'Delhi NCR', lat: 28.6139, lng: 77.209, budget: 450, dept: 0, status: 'Active', progress: 68, risk: 'Medium', priority: 'High' },
  { name: 'Smart City Wi-Fi Network', location: 'Bengaluru', lat: 12.9716, lng: 77.5946, budget: 85, dept: 2, status: 'Active', progress: 82, risk: 'Low', priority: 'Medium' },
  { name: 'National Highway Widening NH-44', location: 'Hyderabad', lat: 17.385, lng: 78.4867, budget: 320, dept: 3, status: 'Delayed', progress: 45, risk: 'High', priority: 'Critical' },
  { name: 'Solar Park Development', location: 'Jaipur', lat: 26.9124, lng: 75.7873, budget: 180, dept: 4, status: 'Active', progress: 55, risk: 'Medium', priority: 'High' },
  { name: 'Canal Modernization Project', location: 'Lucknow', lat: 26.8467, lng: 80.9462, budget: 95, dept: 1, status: 'Active', progress: 72, risk: 'Low', priority: 'Medium' },
  { name: 'Affordable Housing Complex', location: 'Mumbai', lat: 19.076, lng: 72.8777, budget: 210, dept: 2, status: 'Active', progress: 38, risk: 'High', priority: 'High' },
  { name: 'Rural Road Connectivity', location: 'Patna', lat: 25.5941, lng: 85.1376, budget: 65, dept: 3, status: 'Planning', progress: 12, risk: 'Low', priority: 'Medium' },
  { name: 'Water Treatment Plant Upgrade', location: 'Chennai', lat: 13.0827, lng: 80.2707, budget: 140, dept: 1, status: 'Active', progress: 61, risk: 'Medium', priority: 'High' },
  { name: 'Bridge Reconstruction Project', location: 'Kolkata', lat: 22.5726, lng: 88.3639, budget: 75, dept: 0, status: 'Delayed', progress: 52, risk: 'Critical', priority: 'Critical' },
  { name: 'Wind Energy Farm Setup', location: 'Ahmedabad', lat: 23.0225, lng: 72.5714, budget: 200, dept: 4, status: 'Active', progress: 78, risk: 'Low', priority: 'Medium' },
  { name: 'Drainage System Overhaul', location: 'Pune', lat: 18.5204, lng: 73.8567, budget: 55, dept: 0, status: 'On Hold', progress: 25, risk: 'Medium', priority: 'Medium' },
  { name: 'Public Transit Hub', location: 'Chandigarh', lat: 30.7333, lng: 76.7794, budget: 110, dept: 3, status: 'Active', progress: 44, risk: 'High', priority: 'High' },
  { name: 'Irrigation Pipeline Network', location: 'Bhopal', lat: 23.2599, lng: 77.4126, budget: 90, dept: 1, status: 'Completed', progress: 100, risk: 'Low', priority: 'Medium' },
  { name: 'Heritage Site Restoration', location: 'Varanasi', lat: 25.3176, lng: 82.9739, budget: 40, dept: 2, status: 'Active', progress: 58, risk: 'Medium', priority: 'Low' },
  { name: 'E-Governance Portal Upgrade', location: 'New Delhi', lat: 28.7041, lng: 77.1025, budget: 25, dept: 2, status: 'Completed', progress: 100, risk: 'Low', priority: 'Medium' },
];

const milestoneNames = ['Planning', 'Design', 'Procurement', 'Construction', 'Testing', 'Deployment'];

const taskNames = [
  'Site survey and assessment', 'Environmental clearance', 'Tender document preparation',
  'Contractor selection', 'Foundation work', 'Structural framework', 'Electrical installation',
  'Quality inspection', 'Safety audit', 'Progress documentation', 'Stakeholder meeting',
  'Material procurement', 'Equipment installation', 'Testing and commissioning', 'Final handover',
];

async function seed() {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}), Department.deleteMany({}), Project.deleteMany({}),
    Task.deleteMany({}), Milestone.deleteMany({}), Budget.deleteMany({}),
    Risk.deleteMany({}), ProjectUpdate.deleteMany({}), Notification.deleteMany({}),
  ]);

  console.log('Creating departments...');
  const deptDocs = await Department.insertMany(departments);

  console.log('Creating users...');
  const admin = await User.create({ name: 'Super Admin', email: 'admin@nirikshan.demo', password: DEMO_PASSWORD, role: 'super_admin', isDemo: true });
  const officer = await User.create({ name: 'Dept Officer', email: 'officer@nirikshan.demo', password: DEMO_PASSWORD, role: 'department_officer', department: deptDocs[0]._id, isDemo: true });
  const manager = await User.create({ name: 'Project Manager', email: 'manager@nirikshan.demo', password: DEMO_PASSWORD, role: 'project_manager', department: deptDocs[0]._id, isDemo: true });
  const member = await User.create({ name: 'Team Member', email: 'member@nirikshan.demo', password: DEMO_PASSWORD, role: 'team_member', department: deptDocs[0]._id, isDemo: true });

  const extraUsers = await User.insertMany([
    { name: 'Rajesh Kumar', email: 'rajesh@nirikshan.demo', password: DEMO_PASSWORD, role: 'project_manager', department: deptDocs[1]._id, isDemo: true },
    { name: 'Priya Sharma', email: 'priya@nirikshan.demo', password: DEMO_PASSWORD, role: 'team_member', department: deptDocs[2]._id, isDemo: true },
    { name: 'Amit Patel', email: 'amit@nirikshan.demo', password: DEMO_PASSWORD, role: 'team_member', department: deptDocs[3]._id, isDemo: true },
    { name: 'Sneha Reddy', email: 'sneha@nirikshan.demo', password: DEMO_PASSWORD, role: 'department_officer', department: deptDocs[1]._id, isDemo: true },
  ]);

  const allUsers = [admin, officer, manager, member, ...extraUsers];
  const managers = allUsers.filter((u) => u.role === 'project_manager');
  const members = allUsers.filter((u) => u.role === 'team_member');

  await Department.findByIdAndUpdate(deptDocs[0]._id, { head: officer._id });

  console.log('Creating projects...');
  const projects = [];
  for (let i = 0; i < projectTemplates.length; i++) {
    const t = projectTemplates[i];
    const startDate = new Date('2025-04-01');
    const endDate = new Date('2026-12-31');
    const utilized = Math.min(
      t.budget,
      Math.round(t.budget * (t.progress / 100) * (0.8 + Math.random() * 0.4) * 10) / 10
    );

    const project = await Project.create({
      projectId: `PRJ-${String(i + 1).padStart(4, '0')}`,
      name: t.name,
      department: deptDocs[t.dept]._id,
      projectManager: managers[i % managers.length]._id,
      teamMembers: [members[i % members.length]._id, members[(i + 1) % members.length]._id],
      location: t.location,
      coordinates: { lat: t.lat, lng: t.lng },
      description: `[DEMO] Fictional project for SIH 2026 prototype demonstration. ${t.name} in ${t.location}.`,
      startDate,
      expectedCompletionDate: endDate,
      actualCompletionDate: t.status === 'Completed' ? new Date('2026-08-01') : null,
      totalBudget: t.budget * 10000000,
      utilizedBudget: utilized * 10000000,
      status: t.status,
      priority: t.priority,
      progressPercentage: t.progress,
      riskLevel: t.risk,
      isDemo: true,
    });
    projects.push(project);

    await Budget.create({
      project: project._id,
      approvedBudget: project.totalBudget,
      allocatedBudget: project.totalBudget,
      utilizedBudget: project.utilizedBudget,
      remainingBudget: project.totalBudget - project.utilizedBudget,
      utilizationPercentage: Math.round((project.utilizedBudget / project.totalBudget) * 100),
    });
  }

  console.log('Creating milestones...');
  for (const project of projects) {
    for (let j = 0; j < milestoneNames.length; j++) {
      const progress = project.progressPercentage;
      const milestoneProgress = Math.max(0, Math.min(100, progress - j * 18 + 18));
      let status = 'Pending';
      if (milestoneProgress >= 100) status = 'Completed';
      else if (milestoneProgress > 0) status = 'In Progress';
      if (project.status === 'Delayed' && j >= 3 && milestoneProgress < 100) status = 'Delayed';

      await Milestone.create({
        project: project._id,
        name: milestoneNames[j],
        targetDate: new Date(2025, 3 + j * 2, 15),
        progress: Math.min(milestoneProgress, 100),
        status,
        order: j,
        completedDate: status === 'Completed' ? new Date(2025, 3 + j * 2, 20) : null,
      });
    }
  }

  console.log('Creating tasks...');
  const taskStatuses = ['To Do', 'In Progress', 'Completed', 'Blocked', 'Overdue'];
  let taskCount = 0;
  for (const project of projects) {
    const numTasks = 3 + Math.floor(Math.random() * 4);
    for (let k = 0; k < numTasks; k++) {
      const status = taskStatuses[Math.floor(Math.random() * taskStatuses.length)];
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (status === 'Overdue' ? -5 : 15 + k * 7));
      await Task.create({
        name: taskNames[taskCount % taskNames.length],
        description: `[DEMO] Task for ${project.name}`,
        assignedTo: members[taskCount % members.length]._id,
        project: project._id,
        priority: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
        startDate: new Date('2025-06-01'),
        dueDate,
        status: status === 'Overdue' || (dueDate < new Date() && status !== 'Completed') ? 'Overdue' : status,
        progress: status === 'Completed' ? 100 : Math.floor(Math.random() * 80),
      });
      taskCount++;
    }
  }

  console.log('Creating risks...');
  const riskTitles = [
    'Budget overrun risk', 'Supply chain disruption', 'Regulatory approval delay',
    'Labor shortage', 'Weather impact on construction', 'Technical design changes',
    'Land acquisition delay', 'Contractor performance issues', 'Environmental compliance',
    'Material cost escalation',
  ];
  for (let r = 0; r < 10; r++) {
    const project = projects[r % projects.length];
    const prob = 1 + Math.floor(Math.random() * 5);
    const impact = 1 + Math.floor(Math.random() * 5);
    await Risk.create({
      riskId: `RSK-${String(r + 1).padStart(4, '0')}`,
      project: project._id,
      title: riskTitles[r],
      description: `[DEMO] Risk assessment for ${project.name}`,
      probability: prob,
      impact,
      mitigationPlan: 'Regular monitoring, contingency planning, and stakeholder escalation.',
      owner: managers[r % managers.length]._id,
      status: ['Open', 'Monitoring', 'Mitigated'][Math.floor(Math.random() * 3)],
    });
  }

  console.log('Creating project updates...');
  for (const project of projects.slice(0, 8)) {
    await ProjectUpdate.create({
      project: project._id,
      author: managers[0]._id,
      update: `[DEMO] Progress update for ${project.name}. Work proceeding as planned.`,
      progressChange: 5 + Math.floor(Math.random() * 10),
      status: project.status === 'Delayed' ? 'Delayed' : 'On Track',
    });
  }

  console.log('Creating notifications...');
  const notifications = [
    { type: 'risk', title: 'High Risk Alert', message: 'Bridge Reconstruction Project is at critical risk level.', severity: 'critical', relatedProject: projects[8]._id, isGlobal: true },
    { type: 'task', title: 'Overdue Task', message: 'Task "Foundation work" is overdue on NH-44 project.', severity: 'warning', relatedProject: projects[2]._id, isGlobal: true },
    { type: 'milestone', title: 'Milestone Completed', message: 'Design milestone completed for Smart City Wi-Fi Network.', severity: 'success', relatedProject: projects[1]._id, isGlobal: true },
    { type: 'budget', title: 'Budget Warning', message: 'Budget utilization crossed expected threshold for Affordable Housing Complex.', severity: 'warning', relatedProject: projects[5]._id, isGlobal: true },
    { type: 'project', title: 'Project Delayed', message: 'National Highway Widening NH-44 marked as delayed.', severity: 'critical', relatedProject: projects[2]._id, isGlobal: true },
  ];
  await Notification.insertMany(notifications);

  console.log('\n✅ Seed completed successfully!');
  console.log('\n📋 DEMO ACCOUNTS (Password: Demo@123):');
  console.log('  Admin:   admin@nirikshan.demo');
  console.log('  Officer: officer@nirikshan.demo');
  console.log('  Manager: manager@nirikshan.demo');
  console.log('  Member:  member@nirikshan.demo');
  console.log('\n⚠️  All data is fictional DEMO data for SIH 2026 prototype.\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
