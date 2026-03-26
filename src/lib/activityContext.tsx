import { 
  CheckSquare, 
  Layout as LayoutIcon, 
  Users, 
  Activity, 
  MessageSquare, 
  Clock, 
  ArrowRightLeft, 
  FileEdit, 
  PlusCircle, 
  Trash2 
} from "lucide-react";

export const getActionContext = (action: string) => {
  const lower = action.toLowerCase();
  
  // Specific Actions
  if (lower.includes("comment")) return { type: "task", icon: <MessageSquare className="w-3.5 h-3.5 text-blue-500" />, bg: "bg-blue-500/10", label: "Comment" };
  if (lower.includes("log") || lower.includes("hour")) return { type: "task", icon: <Clock className="w-3.5 h-3.5 text-indigo-500" />, bg: "bg-indigo-500/10", label: "Time Log" };
  if (lower.includes("status")) return { type: "task", icon: <ArrowRightLeft className="w-3.5 h-3.5 text-pink-500" />, bg: "bg-pink-500/10", label: "Status" };
  
  if (lower.includes("create") || lower.includes("new") || lower.includes("added")) {
    if (lower.includes("project")) return { type: "project", icon: <PlusCircle className="w-3.5 h-3.5 text-warning" />, bg: "bg-warning/10", label: "New Project" };
    if (lower.includes("task")) return { type: "task", icon: <PlusCircle className="w-3.5 h-3.5 text-primary" />, bg: "bg-primary/10", label: "New Task" };
    if (lower.includes("resource") || lower.includes("user")) return { type: "resource", icon: <Users className="w-3.5 h-3.5 text-success" />, bg: "bg-success/10", label: "New Member" };
    return { type: "system", icon: <PlusCircle className="w-3.5 h-3.5 text-success" />, bg: "bg-success/10", label: "Created" };
  }
  
  if (lower.includes("delete") || lower.includes("remove")) {
    return { type: "system", icon: <Trash2 className="w-3.5 h-3.5 text-danger" />, bg: "bg-danger/10", label: "Removed" };
  }

  if (lower.includes("edit") || lower.includes("update") || lower.includes("changed")) {
    if (lower.includes("project")) return { type: "project", icon: <FileEdit className="w-3.5 h-3.5 text-warning" />, bg: "bg-warning/10", label: "Project Edit" };
    if (lower.includes("task")) return { type: "task", icon: <FileEdit className="w-3.5 h-3.5 text-primary" />, bg: "bg-primary/10", label: "Task Edit" };
    return { type: "system", icon: <FileEdit className="w-3.5 h-3.5 text-text-secondary" />, bg: "bg-page-bg/80", label: "Updated" };
  }

  // Generic Object Fallbacks
  if (lower.includes("task")) return { type: "task", icon: <CheckSquare className="w-3.5 h-3.5 text-primary" />, bg: "bg-primary/10", label: "Task" };
  if (lower.includes("project")) return { type: "project", icon: <LayoutIcon className="w-3.5 h-3.5 text-warning" />, bg: "bg-warning/10", label: "Project" };
  if (lower.includes("resource") || lower.includes("assigned")) return { type: "resource", icon: <Users className="w-3.5 h-3.5 text-success" />, bg: "bg-success/10", label: "Assigned" };
  
  // Ultimate Fallback
  return { type: "system", icon: <Activity className="w-3.5 h-3.5 text-text-secondary" />, bg: "bg-page-bg/50", label: "System" };
};
