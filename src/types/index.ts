export type UserRole = "Admin" | "PM" | "Normal User";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  skills: string[];
  status: "Available" | "Busy" | "Overloaded";
  notes?: string;
  themeColor: string;
}

export type ProjectStatus = "Active" | "On Hold" | "Completed";
export type EstimateSource = "TASK" | "RESOURCE";

export interface ProjectStakeholder {
  id: string;
  name: string;
  role: string; // e.g. Client, Sponsor, IT Service
  isCustom?: boolean;
}
export interface ProjectResource {
  userId: string;
  role: string; // e.g. FE, BE, QC, BA, PM, Fullstack
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  estimateSource: EstimateSource;
  startDate: string;
  endDate: string;
  estimateHours: number;
  actualHours: number;
  remainingHours: number;
  progressPercentage: number;
  resourceCount: number;
  taskCount: number;
  userIds?: string[]; // @deprecated Use resources instead
  resources?: ProjectResource[];
  stakeholders?: ProjectStakeholder[];
  themeColor?: string;
  avatarUrl?: string;
}

export type TaskStatus = string; // Originally: "To Do" | "In Progress" | "Pending" | "On Hold" | "No Specs" | "Completed" | "Closed";
export type TaskPriority = string; // Originally: "Critical" | "High" | "Medium" | "Low";

export interface TaskStatusConfig {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface TaskPriorityConfig {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface TaskTimeLog {
  id: string;
  userId: string;
  date: string;
  hours: number;
  comment?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string | null;
  estimateHours: number;
  actualHours: number;
  startDate: string;
  dueDate: string;
  parentId?: string; // For subtasks
  timeLogs?: TaskTimeLog[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
}

export interface StakeholderRole {
  id: string;
  name: string;
  description?: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  timestamp: string;
}
