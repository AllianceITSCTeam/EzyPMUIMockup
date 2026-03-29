# EZY PM - Codebase Summary

## Repository Structure

```
EZY PM/Demo/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── page.tsx                  # Dashboard (main landing)
│   │   ├── layout.tsx                # Root layout wrapper
│   │   ├── globals.css               # Design system (CSS vars, themes)
│   │   ├── login/page.tsx            # Login page (fuzzy email match)
│   │   ├── projects/
│   │   │   ├── page.tsx              # Projects list (search, filter, create)
│   │   │   └── [id]/page.tsx         # Project detail (Gantt, Tasks, Resources, Stakeholders)
│   │   ├── tasks/
│   │   │   ├── page.tsx              # All tasks (table/kanban views)
│   │   │   └── [id]/page.tsx         # Task detail (logs, comments, subtasks)
│   │   ├── team/
│   │   │   ├── page.tsx              # Team list (search, filters)
│   │   │   └── [id]/page.tsx         # Member profile (stats, projects, tasks)
│   │   ├── reports/page.tsx          # Analytics (charts, utilization)
│   │   ├── activities/page.tsx       # Audit log with filters
│   │   ├── profile/page.tsx          # Current user profile edit
│   │   └── settings/page.tsx         # System config (statuses, priorities, companies)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx         # Main layout wrapper (sidebar + content)
│   │   │   ├── Header.tsx            # Top nav (search, notifications, profile dropdown)
│   │   │   └── Sidebar.tsx           # Left navigation (6 main links)
│   │   └── ui/
│   │       ├── Modal.tsx             # Base modal with backdrop
│   │       ├── Card.tsx              # Glass-morphism container
│   │       ├── Badge.tsx             # Status/role badge (StatusBadge alias)
│   │       ├── ProgressBar.tsx       # Linear progress bar with overrun detection
│   │       ├── DateProgressBar.tsx   # Time-elapsed progress (start → due)
│   │       ├── UserAvatar.tsx        # Avatar with initials fallback (6 sizes)
│   │       ├── CustomSelect.tsx      # MUST USE instead of <select>
│   │       ├── SkillInput.tsx        # Tag input for skills with autocomplete
│   │       ├── SkillTag.tsx          # Colored skill badge (#React, etc.)
│   │       ├── ApplicationInput.tsx  # Tag input for apps/tools
│   │       ├── CreateTaskModal.tsx   # Full task creation form
│   │       ├── CommentInput.tsx      # Rich comment with @mentions, file attach
│   │       ├── FileUploader.tsx      # Drag-and-drop file upload
│   │       ├── Toast.tsx             # Notification toast (3s auto-dismiss)
│   │       └── ToastContainer.tsx    # Toast manager
│   │
│   ├── store/
│   │   └── useStore.ts               # Zustand store (~300 LOC)
│   │       • Single store instance
│   │       • 50+ actions (CRUD, logging, config)
│   │       • localStorage persistence (currentUser + recentLinks)
│   │       • Toast & activity logging helpers
│   │
│   ├── lib/
│   │   ├── mockData.ts               # Mock data arrays (~1000 LOC)
│   │   │   • 26 MOCK_USERS (23 devs + 3 admins)
│   │   │   • 5 MOCK_PROJECTS
│   │   │   • 33 MOCK_TASKS (with subtask hierarchy)
│   │   │   • 4 MOCK_COMPANIES
│   │   │   • 7 task statuses, 4 priorities
│   │   │   • System stakeholders & roles
│   │   │   • Auto-generated time logs for u1–u6
│   │   │
│   │   └── utils.ts                  # Helper functions (~150 LOC)
│   │       • formatDate, formatTime
│   │       • getActionContext (for activity logging)
│   │       • Color utilities
│   │
│   └── types/
│       └── index.ts                  # TypeScript definitions (~142 LOC)
│           • User, Project, Task, TaskTimeLog
│           • Comment, Stakeholder, Company
│           • TaskStatusConfig, TaskPriorityConfig
│           • ActivityLog, ProjectResource
│
├── public/
│   └── uploads/portraits/            # User avatars & project images
│
├── docs/
│   ├── project-overview-pdr.md       # Product vision & roadmap
│   ├── codebase-summary.md           # This file
│   ├── code-standards.md             # Coding standards
│   ├── system-architecture.md        # Architecture overview
│   ├── project-roadmap.md            # Development roadmap
│   ├── ui-guidelines.md              # UI rules (Vietnamese)
│   ├── requirements/                 # Product spec docs
│   ├── summary/                      # Draft ideas & notes
│   ├── ai-collaboration/             # AI coding guidelines
│   └── images/screenshots/           # Dashboard screenshots
│
├── scripts/                          # Playwright scripts for screenshots
├── .next/                            # Build output
├── node_modules/                     # Dependencies
├── README.md                         # Project overview (quick start)
├── CLAUDE.md                         # Claude Code instructions (points to AGENTS.md)
├── AGENTS.md                         # Project-specific AI agent rules
├── tsconfig.json                     # TypeScript config
├── next.config.ts                    # Next.js config
├── postcss.config.mjs                # PostCSS config (Tailwind)
├── tailwind.config.ts                # Tailwind CSS config
├── eslint.config.mjs                 # ESLint rules
├── package.json                      # Dependencies & scripts
└── package-lock.json                 # Lock file

Total: ~3,500 LOC (excluding node_modules, .next, build)
```

## Key Files & Line Counts

| File | LOC | Purpose |
|------|-----|---------|
| `src/app/page.tsx` | 250+ | Dashboard stats, charts, tasks tabs |
| `src/app/tasks/page.tsx` | 300+ | Kanban/table views, filters |
| `src/app/projects/[id]/page.tsx` | 350+ | Gantt, tasks, resources, stakeholders tabs |
| `src/store/useStore.ts` | 300+ | Zustand store + 50+ actions |
| `src/lib/mockData.ts` | 1000+ | All mock data, users, projects, tasks |
| `src/components/ui/Modal.tsx` | 80+ | Base modal component |
| `src/components/ui/CustomSelect.tsx` | 150+ | Custom dropdown (no native select) |
| `src/components/ui/CreateTaskModal.tsx` | 200+ | Task creation form |
| `src/types/index.ts` | 142 | All TypeScript interfaces |
| `src/lib/utils.ts` | 150+ | Helpers, formatters |

## Data Flow

### 1. Initialization
```
App loads → useStore.initialize() → MOCK_* arrays → Zustand store
    ↓
localStorage check for currentUser → fall back to MOCK_USERS[0]
    ↓
Page renders with populated data
```

### 2. State Management
```
Component renders → useStore() → Access state (tasks, projects, users, etc.)
    ↓
User action (create, update, delete) → Call store action (addTask, updateTask, etc.)
    ↓
Action mutates state → Component re-renders
    ↓
(Optional) logActivity() + addToast() for user feedback
    ↓
(Optional) localStorage.setItem() for currentUser persistence
```

### 3. Example: Creating a Task
```
CreateTaskModal.tsx
    ↓ User fills form, clicks Save
    ↓
useStore.addTask(newTask) triggered
    ↓
Store action: set({ tasks: [...tasks, newTask] })
    ↓
Store action: logActivity(`Created task "${title}"`)
    ↓
Store action: addToast('success', 'Task created')
    ↓
Modal closes, component re-renders
    ↓
Toast shows for 3 seconds, auto-dismisses
```

## Routing Table

| Route | Component | Purpose | Mock Data |
|-------|-----------|---------|-----------|
| `/` | `app/page.tsx` | Dashboard | tasks, projects, activities |
| `/login` | `app/login/page.tsx` | Authentication (fuzzy email) | users |
| `/projects` | `app/projects/page.tsx` | Project list & create | projects |
| `/projects/[id]` | `app/projects/[id]/page.tsx` | Project detail (Gantt, tasks, resources) | projects, tasks |
| `/tasks` | `app/tasks/page.tsx` | Task kanban/table | tasks, users |
| `/tasks/[id]` | `app/tasks/[id]/page.tsx` | Task detail (logs, comments, subtasks) | tasks, comments, time logs |
| `/team` | `app/team/page.tsx` | Team list | users, projects, tasks |
| `/team/[id]` | `app/team/[id]/page.tsx` | Member profile | users, projects, tasks |
| `/reports` | `app/reports/page.tsx` | Analytics charts | projects, users, tasks |
| `/activities` | `app/activities/page.tsx` | Audit log | activities |
| `/profile` | `app/profile/page.tsx` | User profile edit | currentUser |
| `/settings` | `app/settings/page.tsx` | System config | statuses, priorities, stakeholders, companies |

## State Management Patterns

### Core Store Structure
```typescript
interface AppState {
  // Data entities
  tasks: Task[];
  projects: Project[];
  users: User[];
  activities: ActivityLog[];
  comments: Comment[];

  // Config/UI
  taskStatuses: TaskStatusConfig[];
  taskPriorities: TaskPriorityConfig[];
  toasts: Toast[];
  isLoading: boolean;
  currentUser: User | null;
  recentLinks: RecentLink[];

  // 50+ Actions
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  logHours: (taskId: string, hours: number, comment?: string, date?: string) => void;
  // ... 47 more actions
}
```

### localStorage Persistence
```typescript
persist(
  (set, get) => ({ ... }),
  {
    name: 'app-store',
    partialize: (state) => ({
      currentUser: state.currentUser,
      recentLinks: state.recentLinks
    })
  }
)
```

Only `currentUser` + `recentLinks` are persisted. All other data resets on refresh.

## Important Utilities

### formatDate (in utils.ts)
```typescript
formatDate(date: string | Date): string
// Returns: "29 Mar 2026" or "29 Mar" if current year
```

### getActionContext (in utils.ts)
```typescript
getActionContext(action: string, entityType: string, entityName: string): string
// For activity logging: "Created task 'API Integration'"
```

### SkillTag Color Logic (in components/ui/SkillTag.tsx)
```
- React → #3B82F6 (blue)
- Node → #10B981 (green)
- QA → #F59E0B (amber)
- Design → #EC4899 (pink)
- # prefix on every skill tag label
```

### CustomSelect (in components/ui/CustomSelect.tsx)
```
- Mandatory everywhere (no native <select>)
- Supports searchable option filtering
- Keyboard accessible (arrow keys, Enter, Esc)
- Close on blur or Escape
```

## Component Reuse Checklist

Before creating a new component, check these existing ones:

- **Modals**: Use `Modal.tsx` base + custom content
- **Badges**: Use `Badge.tsx` for status/role colors
- **Avatars**: Use `UserAvatar.tsx` (all 6 sizes available)
- **Dropdowns**: Use `CustomSelect.tsx` (NOT native `<select>`)
- **Progress**: Use `ProgressBar.tsx` or `DateProgressBar.tsx`
- **Skills**: Use `SkillTag.tsx` + `SkillInput.tsx` (with autocomplete)
- **Apps**: Use `ApplicationInput.tsx` (tag input)
- **Cards**: Use `Card.tsx` (glass morphism)
- **Notifications**: Use `useStore().addToast()` (auto-dismisses)
- **File Upload**: Use `FileUploader.tsx` (drag-drop)
- **Comments**: Use `CommentInput.tsx` (with @mentions)
- **Create/Edit Forms**: Copy `CreateTaskModal.tsx` pattern

## Design System (globals.css)

### CSS Custom Properties
```css
/* Light Mode */
--primary: #4F46E5 (indigo)
--success: #10B981 (green)
--warning: #F59E0B (amber)
--danger: #EF4444 (red)
--text-primary: #1F2937 (dark gray)
--text-secondary: #6B7280 (medium gray)
--surface: #FFFFFF (white)
--page-bg: #F9FAFB (light gray)

/* Dark Mode (auto-switched) */
--primary: #818CF8
--surface: #1F2937
--page-bg: #111827
```

### Borderless Design
```
Instead of:  border border-gray-300 rounded-md
Use:         bg-surface/50 shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] rounded-md
For hover:   hover:bg-page-bg
```

## Testing & Deployment

### Screenshots (Playwright)
```bash
npx playwright codegen
```

### Build & Deploy
```bash
npm run build     # Next.js build
npm start         # Production server
```

Deployed on Vercel or self-hosted.

## Technical Debt & Notes

1. **Deprecated userIds field** in Project (use `resources[]` instead)
2. **Hardcoded "u1"** in time log creation (should use currentUser.id)
3. **No real auth backend** — fuzzy email matching only
4. **Mock time logs** auto-generated at startup
5. **No API calls** — all mutations are in-memory
