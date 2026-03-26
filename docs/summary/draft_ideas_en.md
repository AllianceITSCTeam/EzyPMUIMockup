# SCREEN & FEATURE SPECIFICATION – EzyPM

> This document describes the screens and business logic of the EzyPM Project Management System.
>
> Last updated: 2026-03-25
>
> Author: Nhung Trần Thị Hồng

---

## SYSTEM OVERVIEW

- **Platform:** Web application with responsive support for mobile / tablet
- **Scale:** ~100 staff members, ~20 active projects simultaneously
- **Multi-language:** Vietnamese / English
- **Theme:** Light Mode / Dark Mode (user-switchable)
- **Notifications:** Built-in — users receive alerts when assigned a task, when a deadline is approaching, when a new comment is posted, etc.

---

## ROLES & PERMISSIONS

The system has **3 fixed roles** used to control access to features and screens:

| Role | Description |
|------|-------------|
| **Admin** | Full system access; can view all data across the system |
| **PM** (Project Manager) | Manages assigned projects |
| **Normal User** | Standard staff; can only view data relevant to themselves |

> **Note:** System roles are separate from project roles. A staff member can be a Backend Developer on Project A and a QC on Project B — project roles are declared individually during resource allocation.

---

## 1. GLOBAL HEADER

The header is present on all screens after login.

### 1.1. Components
- Logged-in user's name
- Account menu
- **Create New Project** button _(visible to Admin / PM only)_
- Notification icon

### 1.2. Account Menu
- **My Profile** — Update personal information
- **Change Password** — Update password
- **Switch Theme** — Toggle Light / Dark Mode
- **Log out**

### 1.3. Create New Project Permission
- Only **Admin** and **PM** can create new projects
- Normal Users do not see or cannot interact with this button

---

## 2. DASHBOARD (Personal Overview)

A personal overview screen shown immediately after login. All data is scoped to the currently logged-in user.

### 2.1. Purpose
Allows staff to quickly check their current workload, task statuses, activity history, and total hours worked.

### 2.2. Main Components

#### Task Navigation Tabs
Three horizontal tabs on the same Dashboard page:
- **Current Tasks** — tasks with status = `In Progress`
- **Pending Tasks** — tasks with status = `Pending`
- **Past Tasks** — tasks with status = `Completed`

Each tab shows a freely scrollable table with no row limit.

#### Progress Overview by Project
Displays each project as an individual **mini-card** (not aggregated). Each card shows:
- Project name
- Progress bar: `Progress (%) = Actual Hours / Estimate Hours × 100`
- Total Estimate / Actual / Remaining Hours
- If Actual > Estimate (> 100%): shows the **actual percentage** along with a **warning icon** ⚠️

#### Activities Log
- Automatically recorded by the system, including events such as:
  - Assigned a new task
  - New comment on a task
  - Task completed
  - Task status changed
  - Hours logged
- **Display:** Top 10 most recent notifications; click "View all" to see full history

---

## 3. PROJECTS MODULE

Features for managing projects and their tasks.

### 3.1. Project List

**Visibility by role:**
- **Admin:** All projects in the system
- **PM:** Projects they manage
- **Normal User:** Projects they are allocated to

**Layout:** Card grid, infinite scroll when more than 20 projects exist.

**Information displayed on each card:**
- Project name
- Short description
- Status
- Start date / End date
- EstimateSource (TASK or RESOURCE)
- Number of team members
- Total number of tasks
- Overall progress (Progress %)

### 3.2. Create / Edit Project

Only **Admin / PM** can create or edit projects. Opens as a **modal**.

**Fields:**
- Project name _(required)_
- Description
- Status _(required)_
- Start date / End date _(required)_
- **EstimateSource** — select the official estimation method: `TASK` or `RESOURCE` _(required)_
- Notes

> When editing EstimateSource: a warning message is shown, as this affects Progress and Remaining Hours.

### 3.3. Project-Level Estimate Hours Logic

Each project has a single active **EstimateSource** at any given time:

| EstimateSource | How Project Estimate is Calculated |
|---|---|
| **TASK** | Sum of Estimate Hours of all tasks in the project |
| **RESOURCE** | Sum of Estimate Hours from resource allocations (e.g. BE 30h + FE 20h + QC 10h + BA 4h) |

- **Actual Hours** are always calculated from the total of all logged hours by staff
- **Remaining Hours** = Official Estimate − Actual
- **Progress %** = Actual / Official Estimate × 100

### 3.4. Project Detail

Detail screen for each project. Internal navigation uses **horizontal tabs**.

**Overview section (always visible above tabs):**
- Name, description, status, dates, EstimateSource
- 4 summary cards: Estimate Hours / Actual Hours / Remaining Hours / Progress %

**Tabs:**
1. **Resources** — list of staff allocated to the project
2. **Tasks** — task list
3. **Stakeholders** — stakeholder list for the project

### 3.5. Resource Allocation

Manages assignment of staff to a project. Only **Admin / PM** can add or remove staff.

**Fields:**
- Select staff member
- Select project role _(flexible per project — free-text combobox with suggested values: Backend, Frontend, QC, BA, etc.)_
- Participation period (start / end date)
- **Estimate Hours per resource** _(only shown when EstimateSource = RESOURCE)_

**When a staff member is removed from a project:**
- Their assigned tasks **remain unchanged** (not automatically unassigned)
- The removed staff member **can no longer view** those tasks
- Other project members can manually re-assign tasks as needed

### 3.6. Stakeholder Management

Each project maintains its own stakeholder list, with each stakeholder assigned a role for that project.

**System catalogs:**
- **Stakeholders** — master list of people / organizations (name, contact info, etc.)
- **Stakeholder Roles** — role catalog (e.g. Client, Vendor, Business Owner, Sponsor, etc.)

**Per project:**
- Select stakeholders from the system catalog
- Assign a role to each stakeholder within that project
- The same stakeholder can have different roles across different projects

**Permissions:** Only **Admin / PM** can add, edit, or remove stakeholders in a project.

### 3.7. Task List

Displays all tasks in a project. Users can toggle between **two views**:

#### Table / List View
- Flat list, not grouped by status
- Filters: Status, Assignee, Priority, Date range
- Subtasks appear as regular tasks in the table (no indentation)

#### Kanban Board View
- 7 columns corresponding to each status: To Do / In Progress / Pending / On Hold / No Specs / Completed / Closed
- Task cards can be dragged and dropped between columns to change status
- No additional grouping needed — each column represents one status

**Columns displayed per task (Table view):**
Task name, Assignee, Status, Priority, Estimate, Actual, Remaining, Start/End Date

### 3.8. Create / Edit Task

Opens as a **modal**. All project members can create tasks for projects they belong to.

**Fields:**
- Task name _(required)_
- Description
- Project _(Normal Users can only select projects they belong to)_
- Assignee _(one person only; staff can self-assign, or PM assigns)_
- Status _(default: `To Do`)_
- Priority _(required)_
- Estimate Hours
- Start Date / End Date
- Subtasks & Task Links (Blocks / Blocked by / Duplicates / Duplicated by)

> Actual Hours are **not entered here** — they are accumulated through the Log Hours mechanism.
> Remaining Hours is auto-calculated = Estimate − Actual.

**Task Status — Lifecycle:**

| Status | Meaning |
|--------|---------|
| `To Do` | Created, not yet started |
| `In Progress` | Currently being worked on |
| `Pending` | Waiting — for processing or for a response |
| `On Hold` | Temporarily paused |
| `No Specs` | Waiting for clear documentation / requirements |
| `Completed` | Done |
| `Closed` | Closed — no further tracking needed |

> Any project member can change a task's status to any value — there is no locked workflow.

### 3.9. Task Detail

**2-column layout**: left column for main content, right column as an information sidebar.

**Left Column — Main Content:**
- Task name, status badge, priority badge
- Description
- **Subtasks:** List of child tasks with completion checkboxes; add new subtasks inline
- **Task Links:** Blocks / Blocked by / Duplicates / Duplicated by
- **File Attachments:** Attach files via upload or drag-and-drop
- **Comment Section:** Rich text editor + chronological comment thread
- **Status History:** Automatically logged by the system
- **Log Time History:** Full history of all logged hours

**Right Column — Sidebar:**
- Assignee (with "Claim task" button if unassigned)
- Project
- Start Date / End Date
- Estimate Hours / Actual Hours / Remaining Hours
- Progress bar (with ⚠️ warning if > 100%)
- **"Change Status"** dropdown (7 statuses)
- **"Log Hours"** button

### 3.10. Log Hours Mechanism

Clicking **"Log Hours"** on the Task Detail opens a modal with:
- **Time (h:mm)** _(required)_
- **Date** _(defaults to today)_
- **Comment / Note** for this log entry

**Logic:**
- Task Actual Hours = **cumulative sum of all log entries**
- Any project member can log hours for any task in the project
- Each log entry is saved to the task's Log Time History (with logger, timestamp, and comment)

### 3.11. Comments

The comment editor supports:
- **Rich text:** Bold, Italic, Bullet list, text color, hyperlink
- **Mentions:** `@username` to tag project members
- **File / image attachments** (upload or paste directly)
- **Edit / Delete** your own comments

### 3.12. Subtasks & Task Links

Tasks support:
- **Subtasks:** Child tasks under a parent task. Subtasks appear as regular tasks in the task list; the parent-child relationship is only visible inside the Task Detail screen
- **Task Links:** Relationships between tasks
  - `Blocks` / `Blocked by`
  - `Duplicates` / `Duplicated by`

---

## 4. TEAM MODULE (Staff Management)

> **Permission:** Only **Admin** can access the Team module.

### 4.1. Staff List

Displays all staff members in the system.

**Information displayed:**
- Full name + Avatar (initials by default, or uploaded photo)
- System role (Admin / PM / Normal User)
- Skills
- Number of active projects
- Number of active tasks (In Progress + Pending)
- Total hours in charge (sum of Remaining Hours across active tasks)
- **Work status** _(auto-calculated — see logic below)_

**Work Status Logic (auto-calculated):**

| Status | Condition | Badge Color |
|--------|-----------|-------------|
| `Available` | No tasks in `In Progress` or `Pending` status | 🟢 Green |
| `Busy` | At least 1 task is `In Progress` or `Pending` | 🟡 Yellow |
| `Overloaded` | Current month Utilization > 100% | 🔴 Red |

> Status is recalculated in real time whenever task data changes.

**Quick filter on the staff list:**
- Filter by Work Status: `Available` / `Busy` / `Overloaded`
- Admins can use the `Available` filter to instantly identify who has capacity

**Actions available:**
- Create new staff member
- Update staff information
- View projects each staff member belongs to

### 4.2. Staff Detail

Shows the full profile of an individual staff member.

**Personal Information:**
- Full name, email, phone number
- Avatar: defaults to initials with a fixed random background color; Admin or the staff member can upload a photo
- System role
- Skills (tag-based)

**Performance Statistics** _(displayed as individual metrics — no single composite score)_:
- Total Assigned Tasks
- Completed Tasks
- On-time Completion Rate (%)
- Total Estimate Hours
- Total Actual Hours
- Actual / Estimate Ratio
- Overdue Tasks
- Overrun Tasks

**List of active projects** (with project role per project)

**List of current tasks** (In Progress / Pending status)

### 4.3. Staff Workload View

An aggregated view for Admin to see:
- Which projects each staff member is involved in
- Which tasks they are responsible for (broken down by In Progress / Pending / Completed)
- Current workload per person
- Supports informed resource balancing before assigning new tasks

---

## 5. REPORTS MODULE

Reporting and analytics features. **View only — no file export supported.**

**Common time filter (both options available simultaneously):**
- Quick-select dropdown: This Week / This Month / This Quarter / This Year
- Date range picker: custom start and end date

**Report visibility by role:**

| Role | Scope |
|------|-------|
| **Admin** | All staff, all projects |
| **PM** | Staff and projects they manage |
| **Normal User** | Their own data only |

### 5.1. Project Report

**Chart:** Bar chart comparing Estimate vs Actual per project

**Data table:**
- Project name, status, EstimateSource
- Total Estimate Hours / Actual Hours / Remaining Hours
- Progress (%)
- List of team members
- Task count: Completed / Incomplete / Overdue

### 5.2. Staff Report

**Chart:** Bar chart showing Utilization (%) per staff member

**Data table:**
- Staff name, system role
- Number of projects
- Number of active tasks
- Total Estimate Hours / Actual Hours / Remaining Hours
- **Utilization (%)** = Actual Hours / Standard Working Hours × 100
  - Standard: **8h/day · 5 days/week · 20 days/month**

### 5.3. Estimate vs. Actual Report

**Chart:** Line chart showing trends of Estimate vs Actual over time

**Data table** (filterable by: Project / Task / Staff):
- Estimate Hours
- Actual Hours
- Variance (Actual − Estimate): red ⚠️ if positive (over), green if negative (under)
- Variance percentage (%)

### 5.4. Overdue / Overrun Report

**Layout:** Color-highlighted table (no chart needed).

**Content (4 tabs):**
- **Overdue Tasks** — End Date < today, not yet Completed — highlighted red
- **Overdue Projects** — highlighted red
- **Overrun Tasks / Projects** — Actual > Estimate — highlighted orange
- **Overloaded Staff** — Utilization > 100% — highlighted orange

---

## 6. SYSTEM CONFIGURATION

System-wide catalogs managed by Admin, used as data sources across all modules.

### 6.1. Stakeholder Catalog
- Manages the master list of stakeholders across the system
- Fields: Name, email, phone number, organization

### 6.2. Stakeholder Role Catalog
- Manages stakeholder role types (Client, Vendor, Business Owner, Sponsor, etc.)
- Admin can add, edit, or delete roles

---

*Last updated: 2026-03-25 | Author: Nhung Trần Thị Hồng*
