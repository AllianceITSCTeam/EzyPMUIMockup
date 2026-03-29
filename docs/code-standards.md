# EZY PM - Code Standards & Conventions

Merge this with existing `ui-guidelines.md`. Covers file structure, naming, hydration, component patterns, and state updates.

## File & Naming Conventions

### Component Files
```typescript
// PascalCase for React components (always)
✅ UserAvatar.tsx, CreateTaskModal.tsx, StatusBadge.tsx
❌ user-avatar.tsx, createTaskModal.tsx

// One component per file (unless micro-components like Badge internal variant)
// File = Component name
```

### Hook & Function Files
```typescript
// camelCase for hooks, utilities, stores
✅ useStore.ts, utils.ts, mockData.ts, getActionContext.ts
❌ UseStore.ts, GetActionContext.ts

// Export named functions or default, not both
export const formatDate = (d: string) => { ... }  // ✅
export default formatDate;  // ✅ Pick one
```

### Type Files
```typescript
// types/index.ts groups all interfaces
export interface User { ... }
export type UserRole = "Admin" | "PM" | "Normal User";
export type ProjectStatus = "Active" | "On Hold" | "Completed";

// Flexible string types for extensibility (no hard-coded unions)
export type TaskStatus = string;  // Not: "To Do" | "In Progress" | ...
export type TaskPriority = string;  // Loaded from TaskPriorityConfig
```

### Folder Structure
```
src/
├── app/               # Pages only (no logic)
├── components/        # Reusable UI components
│   ├── layout/       # Layout wrappers
│   └── ui/           # Stateless UI elements
├── store/            # Zustand store
├── lib/              # Utilities & mock data
├── types/            # TypeScript definitions
└── (No /hooks, /utils; use lib/ instead)
```

## Hydration & Client-Side Rendering

### ⚠️ The Hydration Problem
Server renders HTML with `new Date()` at time T. Browser renders same with time T+X (milliseconds differ). React detects mismatch → console error "Hydration failed".

### ✅ Solution: isMounted Pattern
```typescript
import { useEffect, useState } from 'react';

export default function Component() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Server-side render nothing

  return <div>{new Date().toISOString()}</div>; // Client-only render
}
```

### ❌ Never Do This
```typescript
export default function Component() {
  // WRONG: Renders on server + client → hydration mismatch
  const now = new Date();
  return <div>{now.toISOString()}</div>;
}
```

### ✅ Or Use useEffect for Dynamic Content
```typescript
export default function Component() {
  const [time, setTime] = useState('');

  useEffect(() => {
    // Runs only on client
    setTime(new Date().toISOString());
  }, []);

  return <div>{time}</div>;
}
```

## Component Reuse & Duplicates

### Existing Components — Always Reuse
Before writing new code, check `src/components/ui/`:

| Need | Component | Use |
|------|-----------|-----|
| Modal | `Modal.tsx` | Wrap custom content, handle backdrop/close |
| Badge/Status | `Badge.tsx` | Color-coded labels (status, role, priority) |
| Avatar | `UserAvatar.tsx` | User pics with initials fallback (6 sizes) |
| Dropdown | `CustomSelect.tsx` | MANDATORY (no native `<select>`) |
| Progress | `ProgressBar.tsx` | Linear progress + overrun detection |
| Time Progress | `DateProgressBar.tsx` | Elapsed time between start & due |
| Skill Tag | `SkillTag.tsx` | #React, #Node with color coding |
| Skill Input | `SkillInput.tsx` | Tag input + autocomplete |
| App Tag | `ApplicationInput.tsx` | Tag input for tools/apps |
| Card | `Card.tsx` | Glass-morphism container |
| File Upload | `FileUploader.tsx` | Drag-and-drop file input |
| Comment Box | `CommentInput.tsx` | Rich comment with @mentions |
| Toast | `useStore.addToast()` | Use store action (auto-dismisses 3s) |
| Task Form | `CreateTaskModal.tsx` | Copy pattern for edit/create forms |

### Do NOT Duplicate
```typescript
// ❌ Never create a new Button component
export function MyButton() { ... }

// ✅ Use Tailwind classes directly
<button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
  Save
</button>
```

## CustomSelect Mandate

### ❌ Never Use Native `<select>`
```typescript
// FORBIDDEN in this codebase
<select>
  <option>Option 1</option>
</select>
```

### ✅ Always Use CustomSelect
```typescript
import { CustomSelect } from '@/components/ui/CustomSelect';

<CustomSelect
  options={[
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' }
  ]}
  value={selected}
  onChange={setSelected}
  placeholder="Pick one..."
/>
```

### Why
- Better styling control (Tailwind, themes)
- Keyboard accessible
- Custom filtering/search
- Matches design system (borderless)

## Borderless Design Rules

### CSS Pattern
```css
/* Inputs, dropdowns, cards */
background: var(--surface-50);  /* Light surface */
box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.02);  /* Subtle depth */
border: none;  /* No hard borders */

/* On hover/focus */
background: var(--page-bg);
```

### Tailwind Equivalent
```typescript
<input
  className="bg-surface/50 shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]
             rounded-lg focus:bg-page-bg focus:outline-none
             placeholder-text-secondary/50 px-3 py-2"
/>
```

### Don't Do
```typescript
// ❌ Hard borders (old-school)
className="border border-gray-300 rounded-md"

// ❌ Bright backgrounds
className="bg-yellow-100"

// ✅ Light surfaces + subtle shadow
className="bg-surface/50 shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]"
```

## State Update Patterns

### Using Zustand Store

#### Pattern 1: Mutation with Toast + Activity
```typescript
const handleCreateTask = (task: Task) => {
  const { addTask, addToast, logActivity } = useStore();

  // 1. Mutate state
  addTask(task);

  // 2. Notify user
  addToast('success', `Task "${task.title}" created`);

  // 3. Log for audit
  logActivity(`Created task "${task.title}"`);
};
```

#### Pattern 2: Update with Validation
```typescript
const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
  const { updateTask, addToast } = useStore();

  // Validate before updating
  if (!updates.title || updates.title.trim() === '') {
    addToast('error', 'Title cannot be empty');
    return;
  }

  updateTask(taskId, updates);
  addToast('success', 'Task updated');
};
```

#### Pattern 3: Chained Mutations
```typescript
const handleLogHours = (taskId: string, hours: number, comment: string) => {
  const { logHours, logActivity, addToast } = useStore();

  // All mutations happen together
  logHours(taskId, hours, comment);
  logActivity(`Logged ${hours}h on task ${taskId}`);
  addToast('success', `${hours} hours logged`);
};
```

### localStorage Persistence
```typescript
// Only currentUser + recentLinks are persisted
// Set manually via setCurrentUser()
const { setCurrentUser } = useStore();
setCurrentUser(user);  // Auto-saves to localStorage

// On app load, persisted data is hydrated automatically
// Falls back to MOCK_USERS[0] if empty
```

### No API Calls (Mock Only)
```typescript
// In this demo, all "API" is store actions
// Example: don't do HTTP requests
const fetchUsers = async () => {
  // ❌ No: const res = await fetch('/api/users');

  // ✅ Yes: Get from Zustand store
  const { users } = useStore();
  return users;
};
```

## TypeScript Patterns

### Flexible String Types
```typescript
// ✅ Extensible (allows custom statuses via config)
export type TaskStatus = string;
export type TaskPriority = string;

// ❌ Hard-coded (breaks when adding new statuses)
export type TaskStatus = "To Do" | "In Progress" | "Completed";
```

### Use Strict Typing Where It Matters
```typescript
// ✅ Type-safe
export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatus;  // String type = extensible
  priority: TaskPriority;
  assigneeId: string | null;
  estimateHours: number;
  actualHours: number;
  timeLogs?: TaskTimeLog[];
}

// ❌ Overly loose
export interface Task {
  [key: string]: any;  // Avoid
}
```

### ID Generation Convention
```typescript
// Format: entity-${Date.now()}
const newTaskId = `task-${Date.now()}`;
const newCommentId = `comment-${Date.now()}`;
const newTimeLogId = `tl-${Date.now()}`;  // tl = timeLog prefix
const newProjectId = `project-${Date.now()}`;
```

### Optional Fields
```typescript
// Use optional (?) for truly optional fields
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;  // May not exist
  avatarUrl?: string;  // May not exist
}

// Don't use null union for optional
// ❌ phone: string | null;
// ✅ phone?: string;
```

## Path Alias Usage

### Configured in tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Always Use Alias Imports
```typescript
// ✅ Clean & auto-completable
import { useStore } from '@/store/useStore';
import { formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { User } from '@/types/index';

// ❌ Relative paths (brittle, hard to refactor)
import { useStore } from '../../../store/useStore';
import { formatDate } from '../../lib/utils';
```

## React 19 & Next.js 16 Specifics

### Use React 19 Features
```typescript
// ✅ React 19: useActionState (new)
import { useActionState } from 'react';

// ✅ Next.js 16 App Router
import { useRouter } from 'next/navigation';  // NOT 'next/router'

// ✅ Next.js 16 Image optimization
import Image from 'next/image';
```

### Avoid Deprecated Patterns
```typescript
// ❌ Old: next/router (pages router)
import { useRouter } from 'next/router';

// ✅ New: next/navigation (app router)
import { useRouter } from 'next/navigation';
```

## Code Organization Checklist

- [ ] Components in PascalCase files
- [ ] Utilities/hooks in camelCase files
- [ ] No `isMounted` needed for static content
- [ ] Use `isMounted` pattern for `new Date()` in JSX
- [ ] No native `<select>` — use CustomSelect
- [ ] No hardcoded borders — use `bg-surface/50` + inset shadow
- [ ] Reuse existing UI components (don't duplicate)
- [ ] ID generation: `entity-${Date.now()}`
- [ ] Use `@/*` path aliases everywhere
- [ ] All mutations: addToast() + logActivity()
- [ ] localStorage only for currentUser & recentLinks
- [ ] Type-safe with flexible string unions for config
- [ ] Comments for complex logic (not obvious code)
- [ ] 80-char line max in functions (readability)

## Linting & Formatting

```bash
# Check ESLint
npm run lint

# (Formatting auto via editor plugins, not manual prettier)
```

Config in `eslint.config.mjs`.
