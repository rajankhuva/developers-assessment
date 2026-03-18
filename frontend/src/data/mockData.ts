export interface Freelancer {
  id: string
  name: string
  email: string
  hourlyRate: number
}

export interface TimeEntry {
  id: string
  worklogId: string
  description: string
  hours: number
  date: string
  amount: number
}

export interface Worklog {
  id: string
  taskId: string
  taskName: string
  project: string
  freelancer: Freelancer
  status: 'pending' | 'approved' | 'paid'
  timeEntries: TimeEntry[]
  totalHours: number
  totalAmount: number
  periodStart: string
  periodEnd: string
}

const freelancers: Freelancer[] = [
  { id: 'f1', name: 'Alice Johnson', email: 'alice@devcraft.io', hourlyRate: 85 },
  { id: 'f2', name: 'Bob Martinez', email: 'bob@pixelwork.dev', hourlyRate: 95 },
  { id: 'f3', name: 'Carol Chen', email: 'carol@codelab.co', hourlyRate: 75 },
  { id: 'f4', name: 'David Kim', email: 'david@stackpro.io', hourlyRate: 110 },
  { id: 'f5', name: 'Eva Müller', email: 'eva@designhub.eu', hourlyRate: 90 },
]

function buildWorklog(
  id: string,
  taskId: string,
  taskName: string,
  project: string,
  freelancer: Freelancer,
  status: Worklog['status'],
  entries: Array<{ date: string; description: string; hours: number }>,
): Worklog {
  const timeEntries: TimeEntry[] = entries.map((e, i) => ({
    id: `${id}-te${i + 1}`,
    worklogId: id,
    description: e.description,
    hours: e.hours,
    date: e.date,
    amount: parseFloat((e.hours * freelancer.hourlyRate).toFixed(2)),
  }))
  const totalHours = parseFloat(
    timeEntries.reduce((s, e) => s + e.hours, 0).toFixed(2),
  )
  const totalAmount = parseFloat(
    timeEntries.reduce((s, e) => s + e.amount, 0).toFixed(2),
  )
  const dates = entries.map((e) => e.date).sort()
  return {
    id,
    taskId,
    taskName,
    project,
    freelancer,
    status,
    timeEntries,
    totalHours,
    totalAmount,
    periodStart: dates[0],
    periodEnd: dates[dates.length - 1],
  }
}

export const mockWorklogs: Worklog[] = [
  buildWorklog(
    'wl-001',
    'TASK-101',
    'API Integration',
    'Platform v2',
    freelancers[0],
    'pending',
    [
      { date: '2024-01-08', description: 'Set up OAuth2 client', hours: 3 },
      {
        date: '2024-01-09',
        description: 'Implement token refresh logic',
        hours: 4,
      },
      { date: '2024-01-10', description: 'Write integration tests', hours: 2.5 },
      {
        date: '2024-01-11',
        description: 'Fix edge cases in token expiry',
        hours: 1.5,
      },
    ],
  ),
  buildWorklog(
    'wl-002',
    'TASK-102',
    'Dashboard UI',
    'Platform v2',
    freelancers[1],
    'pending',
    [
      {
        date: '2024-01-08',
        description: 'Design component architecture',
        hours: 2,
      },
      { date: '2024-01-10', description: 'Build KPI cards', hours: 5 },
      { date: '2024-01-12', description: 'Add chart components', hours: 4 },
      { date: '2024-01-15', description: 'Responsive layout polish', hours: 3 },
    ],
  ),
  buildWorklog(
    'wl-003',
    'TASK-103',
    'Database Schema Migration',
    'Platform v2',
    freelancers[2],
    'approved',
    [
      { date: '2024-01-15', description: 'Audit existing schema', hours: 2 },
      {
        date: '2024-01-16',
        description: 'Write migration scripts',
        hours: 6,
      },
      {
        date: '2024-01-17',
        description: 'Test rollback procedures',
        hours: 3,
      },
    ],
  ),
  buildWorklog(
    'wl-004',
    'TASK-104',
    'CI/CD Pipeline Setup',
    'DevOps',
    freelancers[3],
    'pending',
    [
      {
        date: '2024-01-22',
        description: 'Configure GitHub Actions workflows',
        hours: 4,
      },
      {
        date: '2024-01-23',
        description: 'Set up Docker build pipeline',
        hours: 3.5,
      },
      {
        date: '2024-01-24',
        description: 'Add staging deployment step',
        hours: 2.5,
      },
      {
        date: '2024-01-25',
        description: 'Write pipeline documentation',
        hours: 1.5,
      },
    ],
  ),
  buildWorklog(
    'wl-005',
    'TASK-105',
    'User Authentication Flow',
    'Mobile App',
    freelancers[4],
    'pending',
    [
      { date: '2024-01-29', description: 'Design auth screens', hours: 3 },
      {
        date: '2024-01-30',
        description: 'Implement sign-in / sign-up forms',
        hours: 5,
      },
      {
        date: '2024-01-31',
        description: 'Add biometric login support',
        hours: 4,
      },
    ],
  ),
  buildWorklog(
    'wl-006',
    'TASK-106',
    'Performance Optimisation',
    'Platform v2',
    freelancers[0],
    'paid',
    [
      { date: '2024-02-05', description: 'Profile slow queries', hours: 2 },
      { date: '2024-02-06', description: 'Add database indexes', hours: 3 },
      {
        date: '2024-02-07',
        description: 'Implement Redis caching layer',
        hours: 5,
      },
      {
        date: '2024-02-08',
        description: 'Load test and document results',
        hours: 2,
      },
    ],
  ),
  buildWorklog(
    'wl-007',
    'TASK-107',
    'Search Feature',
    'Platform v2',
    freelancers[1],
    'pending',
    [
      {
        date: '2024-02-12',
        description: 'Integrate Elasticsearch client',
        hours: 3,
      },
      { date: '2024-02-13', description: 'Build index mapping', hours: 4 },
      {
        date: '2024-02-14',
        description: 'Implement search API endpoint',
        hours: 3.5,
      },
      {
        date: '2024-02-15',
        description: 'Add autocomplete suggestions',
        hours: 2.5,
      },
    ],
  ),
  buildWorklog(
    'wl-008',
    'TASK-108',
    'Email Notification System',
    'Platform v2',
    freelancers[2],
    'pending',
    [
      {
        date: '2024-02-19',
        description: 'Set up SendGrid integration',
        hours: 2,
      },
      { date: '2024-02-20', description: 'Design email templates', hours: 3 },
      {
        date: '2024-02-21',
        description: 'Implement notification queue',
        hours: 4,
      },
      {
        date: '2024-02-22',
        description: 'Add retry and dead-letter handling',
        hours: 2.5,
      },
    ],
  ),
  buildWorklog(
    'wl-009',
    'TASK-109',
    'Mobile Push Notifications',
    'Mobile App',
    freelancers[3],
    'approved',
    [
      {
        date: '2024-02-26',
        description: 'Set up Firebase Cloud Messaging',
        hours: 3,
      },
      {
        date: '2024-02-27',
        description: 'Implement device token management',
        hours: 3.5,
      },
      {
        date: '2024-02-28',
        description: 'Build notification payload builder',
        hours: 2,
      },
    ],
  ),
  buildWorklog(
    'wl-010',
    'TASK-110',
    'Payment Gateway Integration',
    'E-commerce',
    freelancers[4],
    'pending',
    [
      { date: '2024-02-26', description: 'Integrate Stripe SDK', hours: 4 },
      {
        date: '2024-02-27',
        description: 'Implement webhook handlers',
        hours: 3,
      },
      {
        date: '2024-02-28',
        description: 'Add subscription billing logic',
        hours: 4.5,
      },
      {
        date: '2024-02-29',
        description: 'Write payment flow tests',
        hours: 2.5,
      },
    ],
  ),
  buildWorklog(
    'wl-011',
    'TASK-111',
    'Admin Panel CRUD',
    'Platform v2',
    freelancers[0],
    'pending',
    [
      {
        date: '2024-03-04',
        description: 'Build data tables with pagination',
        hours: 5,
      },
      {
        date: '2024-03-05',
        description: 'Implement form validations',
        hours: 3,
      },
      { date: '2024-03-06', description: 'Add bulk action support', hours: 3.5 },
    ],
  ),
  buildWorklog(
    'wl-012',
    'TASK-112',
    'Analytics Dashboard',
    'E-commerce',
    freelancers[1],
    'pending',
    [
      { date: '2024-03-11', description: 'Set up event tracking', hours: 3 },
      {
        date: '2024-03-12',
        description: 'Build funnel visualisation',
        hours: 4.5,
      },
      {
        date: '2024-03-13',
        description: 'Add CSV export functionality',
        hours: 2,
      },
      {
        date: '2024-03-14',
        description: 'Write analytics documentation',
        hours: 1.5,
      },
    ],
  ),
  buildWorklog(
    'wl-013',
    'TASK-113',
    'Accessibility Audit & Fixes',
    'Platform v2',
    freelancers[2],
    'pending',
    [
      {
        date: '2024-03-18',
        description: 'Run automated a11y audit',
        hours: 2,
      },
      {
        date: '2024-03-19',
        description: 'Fix keyboard navigation issues',
        hours: 4,
      },
      {
        date: '2024-03-20',
        description: 'Add ARIA labels and roles',
        hours: 3.5,
      },
      {
        date: '2024-03-21',
        description: 'Screen reader compatibility testing',
        hours: 2,
      },
    ],
  ),
  buildWorklog(
    'wl-014',
    'TASK-114',
    'GraphQL API Layer',
    'Platform v2',
    freelancers[3],
    'pending',
    [
      { date: '2024-03-18', description: 'Define GraphQL schema', hours: 3 },
      { date: '2024-03-19', description: 'Implement resolvers', hours: 5 },
      {
        date: '2024-03-20',
        description: 'Add DataLoader for N+1 prevention',
        hours: 3,
      },
      {
        date: '2024-03-21',
        description: 'Write query/mutation tests',
        hours: 2.5,
      },
    ],
  ),
  buildWorklog(
    'wl-015',
    'TASK-115',
    'Onboarding Flow Redesign',
    'Mobile App',
    freelancers[4],
    'pending',
    [
      { date: '2024-03-25', description: 'User research synthesis', hours: 2.5 },
      { date: '2024-03-26', description: 'New screen wireframes', hours: 3 },
      {
        date: '2024-03-27',
        description: 'Implement animated transitions',
        hours: 5,
      },
      { date: '2024-03-28', description: 'User testing session', hours: 2 },
    ],
  ),
]

export const mockFreelancers = freelancers
