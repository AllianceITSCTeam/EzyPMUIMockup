# EZY PM - Project Overview & PDR

## Product Vision

EZY PM is a **web-based project management SaaS platform** designed to streamline workflows for software development teams. It enables PMs and teams to plan, track, execute, and report on projects with intuitive drag-and-drop interfaces, real-time collaboration, and comprehensive analytics.

**Current Status**: Frontend prototype/demo with mock data. No backend. For UI iteration and stakeholder demos.

## Target Users & Roles

### 1. Project Managers (PM)
- Plan & schedule projects
- Allocate resources
- Track progress & budgets
- Generate reports for stakeholders
- Manage risks & dependencies

### 2. Developers & Team Members
- View assigned tasks
- Log time & update progress
- Collaborate via comments
- Request help from peers
- Check skill/availability of teammates

### 3. Stakeholders & Executives
- High-level project dashboards
- Progress tracking
- Budget overruns alerts
- Team utilization insights
- Resource forecasting

## Core Modules (Features)

### 1. Project Management
- Create & manage projects with SMSF, accounting, mobile workflows
- Set estimate source (TASK-based or RESOURCE-based)
- Track hours vs. estimates, budget overruns
- Multi-stage projects (Active, On Hold, Completed)
- Assign resources by role (FE, BE, QC, BA, PM)
- Stakeholder mapping (Client, Sponsor, IT Service)
- Spec file uploads & linking
- Company/ABN tracking

### 2. Task Management
- Create tasks with hierarchies (subtasks via parentId)
- Status workflow (To Do → In Progress → Pending → Completed)
- Priority levels (Critical, High, Medium, Low)
- Time estimation & actual logging
- Kanban board with drag-and-drop
- Task table view with advanced filters
- Comments & activity feed

### 3. Time & Resource Tracking
- Hourly time logging with dates & comments
- Actual vs. estimated hours comparison
- Resource capacity (Available/Busy/Overloaded)
- Utilization charts by person/project
- Skill-based resource allocation
- Overtime & under-utilization detection

### 4. Team & Skills Management
- User profiles with skills (React, Node, QA, etc.)
- Role assignments (Admin, PM, Normal User)
- Team utilization dashboard
- Member search & filtering
- Skills matrix

### 5. Reporting & Analytics
- Project progress charts (est. vs actual)
- Team utilization & capacity heatmaps
- Burndown trends
- Budget vs. spend tracking
- Activity audit logs
- Export reports (future)

### 6. System Configuration
- Custom task statuses & priority levels
- Stakeholder roles & types
- Company/ABN master data
- User roles & permissions (future)
- Workflow rules (future)

## Business Rules

### Estimate & Progress Calculation
- **EstimateSource = TASK**: Project estimate = SUM of all task estimates
- **EstimateSource = RESOURCE**: Project estimate = manually entered resource hours
- **Progress %** = (actualHours / estimateHours) × 100
- **Remaining** = estimateHours − actualHours
- **Overrun** = actualHours > estimateHours (flagged in red)

### Time Logging
- Only assigned users can log time on tasks
- Logs include: userId, date, hours, optional comment
- Logs appear in reverse chronological order on task detail
- Actual hours on task auto-update when logs are added

### Task Hierarchy
- Tasks can have subtasks via `parentId` field
- Subtask hours roll up to parent for progress
- Parent tasks can't have both own hours and subtasks (either/or)
- 3-level depth supported (task → subtask → sub-subtask)

### Work Status
- **Available**: Ready for new work
- **Busy**: Moderate workload
- **Overloaded**: Over capacity, needs relief
- Set manually by user or auto-calculated from task assignments (future)

## Current Implementation Status

### ✅ Completed (Demo/Prototype Phase)
- All 12 pages fully functional UI
- Zustand-based state management with localStorage persistence
- Mock data: 26 users, 5 projects, 33 tasks, 4 companies
- Drag-and-drop kanban for tasks
- Time logging & activity feed
- Search & advanced filters
- Theme switching (light/dark)
- Custom task statuses & priorities
- Responsive design

### ⏳ Planned (Not in Demo)
- Real authentication backend (Auth0, Supabase, etc.)
- PostgreSQL or Firebase database
- REST/GraphQL API layer
- Real-time collaboration (WebSockets)
- Email notifications
- PDF report export
- Mobile app (React Native)
- Integrations (Jira, Slack, Teams)
- Advanced permissions & workflows

### 🚫 Known Limitations (Demo)
- No persistent backend — data resets on refresh
- Hardcoded password "123456" for all users
- Time logs auto-generated for demo (hardcoded user "u1")
- No real authentication
- No email or push notifications

## Key Screens

### Dashboard (`/`)
- Stats cards: active projects, tasks, team capacity
- Project progress cards with visual bars
- Task tabs (My Tasks, Today, This Week, Overdue)
- Activity feed (recent changes)

### Projects (`/projects`)
- List view: search, filter by status, sort by date
- Create project modal
- Project detail (`/projects/[id]`): Gantt chart, tasks tab, resources tab, stakeholders tab

### Tasks (`/tasks`)
- Table view: sort/filter by status, priority, assignee
- Kanban view: drag-and-drop across columns
- Advanced filters: date range, assignee, skills, etc.
- Task detail (`/tasks/[id]`): time logs, comments, subtasks, checklist

### Team (`/team`)
- List view: search by name/email/skills
- Card view: utilization & status at a glance
- Member profile (`/team/[id]`): stats, assigned projects, tasks

### Reports (`/reports`)
- Project progress chart (actual vs estimated)
- Team utilization heatmap
- Burndown trend (if data available)

### Settings (`/settings`)
- Custom task statuses
- Custom priorities
- Stakeholder role definitions
- Company master data

## Data Entities Overview

| Entity | Fields | Relationships |
|--------|--------|---------------|
| User | id, name, email, role, skills[], status, themeColor | Resources in projects, task assignees, commenters |
| Project | id, name, status, estimateSource, hours, resources[], stakeholders[] | Contains tasks, related to companies & users |
| Task | id, projectId, title, status, priority, assigneeId, hours, timeLogs[] | Parent-child (subtasks), comments, time logs |
| Company | id, name, ABN, address, phone, email | Referenced by projects |
| Stakeholder (System) | id, name, email, phone, organization | Assigned to projects |
| TaskStatusConfig | id, name, color | Used in task workflow |
| TaskPriorityConfig | id, name, color | Used for task prioritization |

## Success Metrics (Proposed for Production)

- **Adoption**: >80% team usage within 3 months
- **Efficiency**: 20% reduction in PM admin time
- **Accuracy**: <5% variance between estimate & actual
- **Satisfaction**: NPS >40, 4/5 star avg rating
- **Uptime**: 99.9% SLA
- **Performance**: <2s page load, <100ms interactions

## Next Steps for Production

1. **Backend Architecture**: Design API & database schema
2. **Authentication**: Implement OAuth/SSO
3. **Real Data Sync**: Replace mock data with API calls
4. **Performance**: Optimize queries, add caching
5. **Security**: Add role-based access, encryption
6. **Testing**: Full QA cycle, automation
7. **Deployment**: Set up CI/CD, monitoring
8. **Training**: Onboard users, create help docs
