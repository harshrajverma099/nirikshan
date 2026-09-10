export const MOCK_DEPARTMENTS = [
  { _id: 'dept1', name: 'Public Works Department', code: 'PWD', description: 'Infrastructure & Construction', isActive: true },
  { _id: 'dept2', name: 'Water Resources Department', code: 'WRD', description: 'Irrigation & Water Supply', isActive: true },
  { _id: 'dept3', name: 'Urban Development', code: 'UDD', description: 'Smart Cities & Planning', isActive: true },
  { _id: 'dept4', name: 'Transport & Highways', code: 'THD', description: 'Road & Transport', isActive: true },
  { _id: 'dept5', name: 'Renewable Energy Department', code: 'RED', description: 'Solar & Wind Energy', isActive: true }
];

export const MOCK_USERS = [
  { _id: '6aa301d0497df46e3ec21784', name: 'Super Admin', email: 'admin@nirikshan.demo', role: 'super_admin', department: MOCK_DEPARTMENTS[0], isActive: true, isDemo: true },
  { _id: '6aa301d0497df46e3ec21785', name: 'Dept Officer', email: 'officer@nirikshan.demo', role: 'department_officer', department: MOCK_DEPARTMENTS[0], isActive: true, isDemo: true },
  { _id: '6aa301d0497df46e3ec21786', name: 'Project Manager', email: 'manager@nirikshan.demo', role: 'project_manager', department: MOCK_DEPARTMENTS[0], isActive: true, isDemo: true },
  { _id: '6aa301d0497df46e3ec21787', name: 'Team Member', email: 'member@nirikshan.demo', role: 'team_member', department: MOCK_DEPARTMENTS[0], isActive: true, isDemo: true }
];

export const MOCK_PROJECTS = [
  {
    _id: 'proj1',
    projectId: 'PRJ-2026-001',
    name: 'Metro Rail Extension Phase II',
    description: 'Extension of Metro Line 3 connecting North & South Corridors',
    location: 'Delhi NCR',
    coordinates: { lat: 28.6139, lng: 77.209 },
    department: MOCK_DEPARTMENTS[0],
    projectManager: MOCK_USERS[2],
    teamMembers: [MOCK_USERS[3]],
    totalBudget: 450000000,
    utilizedBudget: 306000000,
    startDate: '2025-01-15T00:00:00.000Z',
    endDate: '2027-06-30T00:00:00.000Z',
    status: 'Active',
    priority: 'High',
    riskLevel: 'Medium',
    progressPercentage: 68,
    createdAt: '2025-01-15T00:00:00.000Z'
  },
  {
    _id: 'proj2',
    projectId: 'PRJ-2026-002',
    name: 'Smart City Wi-Fi Network',
    description: 'Citywide fiber optic deployment and public wireless access',
    location: 'Bengaluru',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    department: MOCK_DEPARTMENTS[2],
    projectManager: MOCK_USERS[2],
    teamMembers: [MOCK_USERS[3]],
    totalBudget: 85000000,
    utilizedBudget: 69700000,
    startDate: '2025-03-01T00:00:00.000Z',
    endDate: '2026-11-30T00:00:00.000Z',
    status: 'Active',
    priority: 'Medium',
    riskLevel: 'Low',
    progressPercentage: 82,
    createdAt: '2025-03-01T00:00:00.000Z'
  },
  {
    _id: 'proj3',
    projectId: 'PRJ-2026-003',
    name: 'National Highway Widening NH-44',
    description: '4-lane to 6-lane expansion with automated toll collection',
    location: 'Hyderabad',
    coordinates: { lat: 17.385, lng: 78.4867 },
    department: MOCK_DEPARTMENTS[3],
    projectManager: MOCK_USERS[2],
    teamMembers: [MOCK_USERS[3]],
    totalBudget: 320000000,
    utilizedBudget: 144000000,
    startDate: '2024-09-01T00:00:00.000Z',
    endDate: '2026-08-15T00:00:00.000Z',
    status: 'Delayed',
    priority: 'Critical',
    riskLevel: 'High',
    progressPercentage: 45,
    createdAt: '2024-09-01T00:00:00.000Z'
  },
  {
    _id: 'proj4',
    projectId: 'PRJ-2026-004',
    name: 'Solar Park Development',
    description: '500MW Ultra Mega Solar Power Park with grid synchronization',
    location: 'Jaipur',
    coordinates: { lat: 26.9124, lng: 75.7873 },
    department: MOCK_DEPARTMENTS[4],
    projectManager: MOCK_USERS[2],
    teamMembers: [MOCK_USERS[3]],
    totalBudget: 180000000,
    utilizedBudget: 99000000,
    startDate: '2025-02-10T00:00:00.000Z',
    endDate: '2026-12-20T00:00:00.000Z',
    status: 'Active',
    priority: 'High',
    riskLevel: 'Medium',
    progressPercentage: 55,
    createdAt: '2025-02-10T00:00:00.000Z'
  }
];

export const MOCK_TASKS = [
  { _id: 'task1', title: 'Site survey and assessment', project: MOCK_PROJECTS[0], assignedTo: MOCK_USERS[3], status: 'Completed', priority: 'High', dueDate: '2025-04-10' },
  { _id: 'task2', title: 'Environmental clearance', project: MOCK_PROJECTS[0], assignedTo: MOCK_USERS[3], status: 'Completed', priority: 'Critical', dueDate: '2025-06-15' },
  { _id: 'task3', title: 'Structural framework construction', project: MOCK_PROJECTS[0], assignedTo: MOCK_USERS[3], status: 'In Progress', priority: 'High', dueDate: '2026-10-30' },
  { _id: 'task4', title: 'Land acquisition clearance', project: MOCK_PROJECTS[2], assignedTo: MOCK_USERS[3], status: 'Blocked', priority: 'Critical', dueDate: '2025-11-20' },
  { _id: 'task5', title: 'Asphalt paving NH-44 Section B', project: MOCK_PROJECTS[2], assignedTo: MOCK_USERS[3], status: 'Overdue', priority: 'High', dueDate: '2026-01-15' }
];

export const MOCK_RISKS = [
  { _id: 'risk1', title: 'Monsoon delay on structural curing', project: MOCK_PROJECTS[0], severity: 'Medium', probability: 'High', impact: 'Medium', status: 'Mitigated' },
  { _id: 'risk2', title: 'Right of Way (RoW) legal disputes', project: MOCK_PROJECTS[2], severity: 'Critical', probability: 'High', impact: 'High', status: 'Open' }
];
