import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task, Project, User, ActivityLog, TaskStatus, Comment, Stakeholder, StakeholderRole, TaskStatusConfig, TaskPriorityConfig } from "../types";
import { MOCK_TASKS, MOCK_PROJECTS, MOCK_USERS, MOCK_ACTIVITIES, MOCK_COMMENTS, MOCK_SYSTEM_STAKEHOLDERS, MOCK_STAKEHOLDER_ROLES, MOCK_TASK_STATUSES, MOCK_TASK_PRIORITIES } from "../lib/mockData";

export type ToastType = "success" | "error" | "info" | "warning";
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export interface RecentLink {
  url: string;
  name: string;
  iconType?: 'project' | 'task' | 'page' | 'member';
  avatarUrl?: string;
  themeColor?: string;
}

interface AppState {
  tasks: Task[];
  projects: Project[];
  users: User[];
  activities: ActivityLog[];
  comments: Comment[];
  toasts: Toast[];
  isLoading: boolean;
  currentUser: User | null;
  recentLinks: RecentLink[];
  systemStakeholders: Stakeholder[];
  stakeholderRoles: StakeholderRole[];
  taskStatuses: TaskStatusConfig[];
  taskPriorities: TaskPriorityConfig[];
  
  // Actions
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  logHours: (taskId: string, hours: number, comment?: string, date?: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addTask: (task: Task) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  logActivity: (action: string) => void;
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
  addComment: (comment: Comment) => void;
  initialize: () => Promise<void>;
  setCurrentUser: (user: import('../types').User | null) => void;
  addRecentLink: (link: RecentLink) => void;
  addStakeholder: (projectId: string, stakeholder: import('../types').ProjectStakeholder) => void;
  removeStakeholder: (projectId: string, stakeholderId: string) => void;
  addSystemStakeholder: (sh: Stakeholder) => void;
  updateSystemStakeholder: (id: string, updates: Partial<Stakeholder>) => void;
  deleteSystemStakeholder: (id: string) => void;
  addStakeholderRole: (role: StakeholderRole) => void;
  updateStakeholderRole: (id: string, updates: Partial<StakeholderRole>) => void;
  deleteStakeholderRole: (id: string) => void;
  addTaskStatus: (status: TaskStatusConfig) => void;
  updateTaskStatusConfig: (id: string, updates: Partial<TaskStatusConfig>) => void;
  deleteTaskStatus: (id: string) => void;
  addTaskPriority: (priority: TaskPriorityConfig) => void;
  updateTaskPriority: (id: string, updates: Partial<TaskPriorityConfig>) => void;
  deleteTaskPriority: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: MOCK_TASKS,
      projects: MOCK_PROJECTS,
      users: MOCK_USERS,
      activities: MOCK_ACTIVITIES,
      comments: MOCK_COMMENTS,
      systemStakeholders: MOCK_SYSTEM_STAKEHOLDERS,
      stakeholderRoles: MOCK_STAKEHOLDER_ROLES,
      taskStatuses: MOCK_TASK_STATUSES,
      taskPriorities: MOCK_TASK_PRIORITIES,
      toasts: [],
      isLoading: true, // Start loading
      currentUser: null, // Will be hydrated from localStorage or fallback
      recentLinks: [],

      setCurrentUser: (user) => set({ currentUser: user }),

      addRecentLink: (link) => set((state) => {
        // Remove if already exists to move it to front
        const filtered = state.recentLinks.filter(l => l.url !== link.url);
        return { recentLinks: [link, ...filtered].slice(0, 3) };
      }),

      initialize: async () => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        // Fallback to MOCK_USERS[0] if no user was loaded from storage
        set((state) => ({ 
          isLoading: false,
          currentUser: state.currentUser || MOCK_USERS[0]
        }));
      },

      updateTaskStatus: (taskId, newStatus) => set((state) => {
        const updatedTasks = state.tasks.map((t) => 
          t.id === taskId ? { ...t, status: newStatus } : t
        );
        return { tasks: updatedTasks };
      }),

      logHours: (taskId, hours, comment, date) => set((state) => {
        const updatedTasks = state.tasks.map((t) => {
          if (t.id === taskId) {
            const newLog = { 
              id: `tl-${Date.now()}`, 
              userId: "u1", 
              date: date || new Date().toISOString().split("T")[0], 
              hours, 
              comment 
            };
            return { 
              ...t, 
              actualHours: t.actualHours + hours,
              timeLogs: [newLog, ...(t.timeLogs || [])]
            };
          }
          return t;
        });
        return { tasks: updatedTasks };
      }),

      updateTask: (taskId, updates) => set((state) => {
        const updatedTasks = state.tasks.map((t) => 
          t.id === taskId ? { ...t, ...updates } : t
        );
        return { tasks: updatedTasks };
      }),

      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, task]
      })),

      addProject: (project) => set((state) => ({
        projects: [...state.projects, project]
      })),

      updateProject: (projectId, updates) => set((state) => ({
        projects: state.projects.map(p => p.id === projectId ? { ...p, ...updates } : p)
      })),

      addStakeholder: (projectId, stakeholder) => set((state) => ({
        projects: state.projects.map(p => 
          p.id === projectId 
            ? { ...p, stakeholders: [...(p.stakeholders || []), stakeholder] } 
            : p
        )
      })),

      removeStakeholder: (projectId, stakeholderId) => set((state) => ({
        projects: state.projects.map(p => 
          p.id === projectId 
            ? { ...p, stakeholders: (p.stakeholders || []).filter(s => s.id !== stakeholderId) } 
            : p
        )
      })),

      addSystemStakeholder: (sh) => set((state) => ({
        systemStakeholders: [...state.systemStakeholders, sh]
      })),

      updateSystemStakeholder: (id, updates) => set((state) => ({
        systemStakeholders: state.systemStakeholders.map(s => s.id === id ? { ...s, ...updates } : s)
      })),

      deleteSystemStakeholder: (id) => set((state) => ({
        systemStakeholders: state.systemStakeholders.filter(s => s.id !== id)
      })),

      addStakeholderRole: (role) => set((state) => ({
        stakeholderRoles: [...state.stakeholderRoles, role]
      })),

      updateStakeholderRole: (id, updates) => set((state) => ({
        stakeholderRoles: state.stakeholderRoles.map(r => r.id === id ? { ...r, ...updates } : r)
      })),

      deleteStakeholderRole: (id) => set((state) => ({
        stakeholderRoles: state.stakeholderRoles.filter(r => r.id !== id)
      })),

      addTaskStatus: (status) => set((state) => ({
        taskStatuses: [...state.taskStatuses, status]
      })),

      updateTaskStatusConfig: (id, updates) => set((state) => ({
        taskStatuses: state.taskStatuses.map(s => s.id === id ? { ...s, ...updates } : s)
      })),

      deleteTaskStatus: (id) => set((state) => ({
        taskStatuses: state.taskStatuses.filter(s => s.id !== id)
      })),

      addTaskPriority: (priority) => set((state) => ({
        taskPriorities: [...state.taskPriorities, priority]
      })),

      updateTaskPriority: (id, updates) => set((state) => ({
        taskPriorities: state.taskPriorities.map(p => p.id === id ? { ...p, ...updates } : p)
      })),

      deleteTaskPriority: (id) => set((state) => ({
        taskPriorities: state.taskPriorities.filter(p => p.id !== id)
      })),

      addUser: (user) => set((state) => ({
        users: [...state.users, user]
      })),

      updateUser: (userId, updates) => set((state) => ({
        users: state.users.map(u => u.id === userId ? { ...u, ...updates } : u)
      })),

      logActivity: (action) => set((state) => ({
        activities: [
          { id: `log-${Date.now()}`, userId: "u1", action, timestamp: "Just now" },
          ...state.activities
        ]
      })),

      addToast: (type, message) => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        set((state) => ({
          toasts: [...state.toasts, { id, type, message }]
        }));
        // Auto remove after 3 seconds
        setTimeout(() => {
          get().removeToast(id);
        }, 3000);
      },

      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
      })),

      addComment: (comment) => set((state) => ({
        comments: [comment, ...state.comments]
      }))
    }),
    {
      name: 'ezypm-storage', // unique name for localStorage
      partialize: (state) => ({ 
        currentUser: state.currentUser,
        recentLinks: state.recentLinks,
      }),
    }
  )
);
