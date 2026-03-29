# EZY PM - Project Management SaaS Demo

**EZY PM** is a frontend-only Next.js 16 + React 19 prototype/demo of a project management SaaS platform. All data is mock with no backend or database. Built for rapid UI iteration and stakeholder demos.

## Quick Start

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+

### Installation & Running

```bash
# Clone & install
git clone <repo-url>
cd "Demo"
npm install

# Start dev server (runs on 192.168.0.14 LAN by default)
npm run dev

# Build for production
npm build
npm start
```

Server will start at: `http://192.168.0.14:3000` (LAN access) or `http://localhost:3000`

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Framework** | Next.js 16.2.1, React 19.2.4, TypeScript 5 |
| **Styling** | Tailwind CSS v4, CSS custom properties |
| **UI Components** | Lucide React (icons), custom components |
| **State** | Zustand 5 (localStorage persistence) |
| **Interactions** | @hello-pangea/dnd (drag-drop), Recharts (charts) |
| **Testing/Screenshots** | Playwright 1.58 |
| **Themes** | next-themes (light/dark) |

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── login/             # Authentication
│   ├── projects/          # Project list & detail
│   ├── tasks/             # Task board & detail
│   ├── team/              # Team members
│   ├── reports/           # Analytics
│   ├── activities/        # Audit log
│   ├── profile/           # User profile
│   ├── settings/          # System config
│   └── layout.tsx         # App wrapper
├── components/
│   ├── layout/            # AppLayout, Header, Sidebar
│   └── ui/                # Reusable UI components
├── store/
│   └── useStore.ts        # Zustand store (state + actions)
├── lib/
│   ├── mockData.ts        # Mock users, projects, tasks
│   └── utils.ts           # Date & format helpers
├── types/
│   └── index.ts           # TypeScript definitions
└── app/
    └── globals.css        # Design system (CSS vars, themes)
docs/                 # Developer documentation
```

## Routes & Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Dashboard with stats, projects, tasks, activity |
| `/login` | `app/login/page.tsx` | Fuzzy email login (pwd: "123456") |
| `/projects` | `app/projects/page.tsx` | Projects list, search, filter, create |
| `/projects/[id]` | `app/projects/[id]/page.tsx` | Project detail: Gantt, Tasks, Resources, Stakeholders |
| `/tasks` | `app/tasks/page.tsx` | All tasks: table/kanban views, filters |
| `/tasks/[id]` | `app/tasks/[id]/page.tsx` | Task detail: logs, comments, subtasks, checklist |
| `/team` | `app/team/page.tsx` | Team members: list/card views |
| `/team/[id]` | `app/team/[id]/page.tsx` | Member profile: stats, projects, tasks |
| `/reports` | `app/reports/page.tsx` | Analytics: progress & utilization charts |
| `/activities` | `app/activities/page.tsx` | System audit log with filters |
| `/profile` | `app/profile/page.tsx` | Current user profile edit |
| `/settings` | `app/settings/page.tsx` | Config: stakeholders, roles, statuses, priorities |

## Key Features

- **Drag-and-drop kanban** for tasks
- **Time logging** & effort tracking
- **Subtasks & task hierarchy** via parentId
- **Project resources & stakeholders** management
- **Analytics charts** (project progress, team utilization)
- **Search & advanced filters** across entities
- **Theme customization** (light/dark + user colors)
- **Mock notifications** & activity logs
- **Responsive design** (desktop-first, mobile-friendly)
- **No authentication backend** — fuzzy email match + hardcoded password

## Mock Data

- **26 users** (23 devs + 3 admins, with avatars & skills)
- **5 projects** (SoEzy, DEB SMSF, ValDB Portal, Mobile App, Dashboard Redesign)
- **33 tasks** (with subtask hierarchy)
- **4 companies** (ABN, contact info)
- **7 task statuses** (To Do, In Progress, Pending, On Hold, No Specs, Completed, Closed)
- **4 priorities** (Critical, High, Medium, Low)
- Auto-generated time logs for users u1–u6

## Data Model Highlights

- **User**: id, name, email, role (Admin/PM/Normal User), skills[], status, themeColor
- **Project**: id, name, status, estimateSource (TASK/RESOURCE), hours, progress%, resources[], stakeholders[]
- **Task**: id, projectId, title, status, priority, assigneeId, hours, timeLogs[], parentId (subtask)
- **TaskTimeLog**: userId, date, hours, comment
- **Comment**: taskId, userId, content, timestamp
- **Stakeholder**: name, email, phone, organization
- **Company**: name, ABN, address, email, phone, website

## State Management

- **Single Zustand store** in `src/store/useStore.ts`
- **Persistent storage**: Only `currentUser` + `recentLinks` saved to localStorage
- **50+ actions**: CRUD for tasks, projects, users, comments, hours, etc.
- **Auto-initialized** from MOCK_* data arrays
- **Toast notifications** (3s auto-dismiss) for user feedback
- **Activity logging** on all mutations

## Design System

- **CSS custom properties** for theming: `--primary`, `--success`, `--warning`, `--danger`, `--text-primary`, `--text-secondary`, `--surface`, `--page-bg`
- **Light theme**: primary=#4F46E5 (indigo), surface=white
- **Dark theme**: primary=#818CF8, surface=dark
- **Glass morphism** (backdrop-blur) on cards
- **Borderless design**: use `bg-surface/50` + shadow instead of borders
- **Flex-based layouts** with Tailwind

## Development Conventions

- **Components**: PascalCase (e.g., `UserAvatar.tsx`)
- **Hooks**: camelCase (e.g., `useStore()`)
- **Hydration**: Always use `isMounted` state + `useEffect` for dynamic content
- **No `new Date()` in JSX** to prevent hydration mismatches
- **ID generation**: `entity-${Date.now()}`
- **CustomSelect** mandatory — never use native `<select>`
- **Path alias**: `@/*` → `./src/*`

## Documentation

Complete developer docs in `./docs/`:
- `project-overview-pdr.md` — Product vision & roadmap
- `codebase-summary.md` — Repo structure & data flow
- `code-standards.md` — Coding standards & conventions
- `system-architecture.md` — Architecture & state management
- `project-roadmap.md` — Development phases & roadmap
- `ui-guidelines.md` — UI/UX rules (Vietnamese)

## Known Limitations (Demo/Prototype)

- **No real authentication backend** — hardcoded password "123456" for all users
- **No API/database** — all data is mock and resets on page refresh
- **Mock time logging** — auto-generated for demo purposes
- **No real-time sync** — data changes not synced across sessions
- **Hardcoded user "u1"** in time log creation (technical debt)

## Running Tests

```bash
# Screenshots with Playwright
npx playwright codegen
```

## Deploy

Build for production:
```bash
npm run build
npm start
```

Vercel deployment ready via `vercel deploy` or git push to auto-deploy.

## License

Internal use only.
