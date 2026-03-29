# EZY PM - System Architecture

## Architecture Overview (Frontend-Only)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    UI Layer (React)                      │  │
│  │  Pages (Dashboard, Projects, Tasks, Team, Reports...)   │  │
│  │  Components (Cards, Modals, Tables, Kanban, Charts)     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↑↓                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          State Management Layer (Zustand)               │  │
│  │  • Single store instance                                │  │
│  │  • 50+ actions (CRUD, logging, config)                 │  │
│  │  • localStorage persistence (currentUser + recentLinks)│  │
│  │  • Toast & activity logging                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            ↑↓                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Data Layer (Mock In-Memory)                │  │
│  │  • MOCK_USERS (26 users)                               │  │
│  │  • MOCK_PROJECTS (5 projects)                          │  │
│  │  • MOCK_TASKS (33 tasks with subtasks)                │  │
│  │  • MOCK_COMPANIES, MOCK_ACTIVITIES, MOCK_COMMENTS     │  │
│  │  • Task statuses & priorities (configurable)          │  │
│  │  • All data resets on page refresh                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

NO BACKEND / NO API / NO DATABASE
(This is by design — frontend prototype for UI iteration)
```

## Frontend-Only Architecture

### Why No Backend?
- **Goal**: Rapid UI iteration & stakeholder demos
- **Timeline**: Build UI without waiting for API
- **Data**: Realistic mock data for testing UI flow
- **Production**: Will add backend in Phase 2 (planned)

### Trade-offs
| Aspect | Trade-off |
|--------|-----------|
| Data Persistence | Lost on page refresh (localStorage only for currentUser) |
| Multi-session | No sync across browser tabs |
| Auth | Fuzzy email match + hardcoded password "123456" |
| Time Logs | Auto-generated at startup (hardcoded userId "u1") |
| Notifications | UI only (no backend push) |
| Real-time | No WebSocket or polling |

## State Management Architecture

### Zustand Store (Single Reducer)

```typescript
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Data Entities
      tasks: MOCK_TASKS,
      projects: MOCK_PROJECTS,
      users: MOCK_USERS,
      activities: MOCK_ACTIVITIES,
      comments: MOCK_COMMENTS,
      systemStakeholders: MOCK_SYSTEM_STAKEHOLDERS,
      stakeholderRoles: MOCK_STAKEHOLDER_ROLES,
      taskStatuses: MOCK_TASK_STATUSES,
      taskPriorities: MOCK_TASK_PRIORITIES,
      companies: MOCK_COMPANIES,

      // UI State
      toasts: [],
      isLoading: true,
      currentUser: null,
      recentLinks: [],

      // 50+ Actions (CRUD + helpers)
      addTask,
      updateTask,
      logHours,
      addProject,
      updateProject,
      // ... 44 more
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        recentLinks: state.recentLinks
      })
    }
  )
);
```

### localStorage Persistence
- **Persisted**: `currentUser` (logged-in user) + `recentLinks` (navigation history)
- **Not persisted**: tasks, projects, users (resets on refresh)
- **Why**: Lightweight storage; full data reset is intentional for demo

### State Update Flow
```
1. Component calls store action (e.g., addTask)
2. Action mutates state via set()
3. Component subscribes and re-renders
4. (Optional) logActivity() for audit trail
5. (Optional) addToast() for user feedback
```

## Component Hierarchy

```
Root (layout.tsx)
│
├── AppLayout
│   ├── Header
│   │   ├── Search bar
│   │   ├── Theme toggle
│   │   ├── Notifications
│   │   └── Profile dropdown
│   │
│   ├── Sidebar
│   │   ├── Dashboard link
│   │   ├── Projects link
│   │   ├── Tasks link
│   │   ├── Team link
│   │   ├── Reports link
│   │   ├── Activities link
│   │   ├── Profile link
│   │   └── Settings link
│   │
│   └── Main Content (page-specific)
│       ├── Dashboard page
│       ├── Projects list/detail
│       ├── Tasks kanban/table
│       ├── Team members
│       ├── Reports charts
│       ├── Activities log
│       ├── Profile edit
│       └── Settings
│
└── ToastContainer
    └── Toast notifications (3s auto-dismiss)
```

## Data Flow Diagram

### 1. App Initialization
```
Next.js loads layout.tsx
    ↓
useStore.initialize() called
    ↓
setTimeout(800ms) → simulates API delay
    ↓
Check localStorage for currentUser
    ↓
Fall back to MOCK_USERS[0] if empty
    ↓
Set isLoading = false
    ↓
Components render with Zustand data
```

### 2. Rendering a Page (e.g., Projects)
```
User navigates to /projects
    ↓
projects/page.tsx mounts
    ↓
const { projects, users } = useStore()  // Subscribe to store
    ↓
JSX renders: project cards, search, filters
    ↓
User interacts: search, sort, filter
    ↓
Filter logic runs (no store update)
    ↓
Component state (filtered list) updates
    ↓
JSX re-renders with filtered projects
```

### 3. Mutation (e.g., Create Task)
```
User clicks "Create Task"
    ↓
CreateTaskModal opens
    ↓
User fills form: title, assignee, estimate, etc.
    ↓
User clicks Save
    ↓
handleCreateTask() called
    ↓
addTask(newTask) → store.tasks.push(newTask)
    ↓
Component re-renders (via Zustand subscription)
    ↓
logActivity("Created task 'API Integration'")
    ↓
addToast('success', 'Task created')
    ↓
Toast shows for 3s, auto-dismisses
    ↓
Modal closes
```

## Theme System

### Implementation
- **next-themes**: Light/dark toggle
- **CSS custom properties**: Theme colors in `globals.css`

### Theme Colors
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
--success: #34D399
--warning: #FBBF24
--danger: #F87171
--text-primary: #F3F4F6 (light gray)
--text-secondary: #D1D5DB (medium gray)
--surface: #1F2937 (dark)
--page-bg: #111827 (darker)
```

### User Theme Color
Each user has a `themeColor` property (e.g., `#3B82F6`). Used for:
- Avatar background
- Project card accent
- Status badges
- Progress bars

## Toast/Notification System

### How It Works
```typescript
const { addToast } = useStore();

// Call anywhere in component
addToast('success', 'Task saved');
addToast('error', 'Email already exists');
addToast('info', 'Loading...');
addToast('warning', 'Confirm delete?');
```

### Store Action
```typescript
addToast: (type: ToastType, message: string) => set((state) => ({
  toasts: [
    ...state.toasts,
    { id: `toast-${Date.now()}`, type, message }
  ]
})),

removeToast: (id: string) => set((state) => ({
  toasts: state.toasts.filter(t => t.id !== id)
}))
```

### UI Component (ToastContainer)
```typescript
export function ToastContainer() {
  const { toasts, removeToast } = useStore();

  useEffect(() => {
    if (toasts.length === 0) return;

    const timer = setTimeout(() => {
      removeToast(toasts[0].id);
    }, 3000);  // Auto-dismiss after 3 seconds

    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}
```

## Activity Logging System

### Log Entry Structure
```typescript
interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
}
```

### Usage in Store
```typescript
logActivity: (action: string) => set((state) => ({
  activities: [
    {
      id: `activity-${Date.now()}`,
      userId: state.currentUser?.id || 'system',
      action,
      timestamp: new Date().toISOString()
    },
    ...state.activities
  ]
}))
```

### When to Log
```typescript
// Every mutation should log
addTask(task) → logActivity(`Created task "${task.title}"`)
updateTask(id, updates) → logActivity(`Updated task "${id}"`)
logHours(taskId, hours) → logActivity(`Logged ${hours}h`)
addProject(project) → logActivity(`Created project "${project.name}"`)
```

### Display
On `/activities` page, shows reverse-chronological list with filters by:
- User
- Action type
- Date range

## Performance Considerations

### Current (Demo)
- No optimization needed (small dataset: 26 users, 33 tasks)
- All operations are O(n) in-memory
- No network latency

### Future (Production)
- Pagination for large lists
- Lazy loading for images
- React.memo for expensive components
- Zustand selectors for granular subscriptions
- Query caching (SWR, React Query)
- Code splitting per route

## Security Considerations (Demo Only)

### Current Limitations
- No authentication backend
- No authorization/permissions
- No input validation/sanitization
- No HTTPS enforcement (dev only)
- currentUser accessible in browser storage

### Production Roadmap
- OAuth 2.0 / OpenID Connect
- JWT tokens with refresh
- Role-based access control (RBAC)
- Data encryption at rest
- API rate limiting
- Input validation server-side
- HTTPS + HSTS
- CSP headers

## Deployment Architecture (Future)

```
┌─────────────────┐
│  Git Repository │
└────────┬────────┘
         │ Push
         ↓
┌─────────────────┐      ┌──────────────────┐
│   CI/CD Pipeline│─────→│  Build & Test    │
└────────┬────────┘      └──────────────────┘
         │ Artifact
         ↓
┌─────────────────────────────────────────────┐
│        Cloud Deployment (Vercel/AWS)        │
│  ┌────────────────────────────────────────┐ │
│  │      Next.js Frontend (CDN)            │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │    Node.js Backend (API Server)        │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │   PostgreSQL Database (Region Lock)    │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

(Not implemented in current demo.)
