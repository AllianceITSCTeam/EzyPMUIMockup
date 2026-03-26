"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useStore } from "@/store/useStore";
import { Search, Filter, Plus, User as UserIcon, AlertCircle, LayoutList, KanbanSquare, Clock, Settings2, Eye, EyeOff, ArrowUp, ArrowDown, ListTodo, FolderKanban, Users as UsersIcon, CheckCircle2, Activity } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Task, TaskStatus, TaskPriority } from "@/types";
import { formatDate } from "@/lib/utils";
import { DateProgressBar } from "@/components/ui/DateProgressBar";
import { CreateTaskModal } from "@/components/ui/CreateTaskModal";

function TasksListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProject = searchParams.get("project") || "All";
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const { tasks, projects, users, updateTaskStatus, addTask, logActivity, addToast, currentUser, taskStatuses, taskPriorities } = useStore();
  const [kanbanColumns, setKanbanColumns] = useState<TaskStatus[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<TaskStatus[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const savedCols = localStorage.getItem("ezypm_kanban_cols");
    const savedHidden = localStorage.getItem("ezypm_kanban_hidden");
    const dbStatuses = taskStatuses.map(s => s.name);
    
    if (savedCols) {
      const parsed = JSON.parse(savedCols);
      // keep only ones still in db, append new ones
      const valid = parsed.filter((s: string) => dbStatuses.includes(s));
      const newlyAdded = dbStatuses.filter((s: string) => !parsed.includes(s));
      setKanbanColumns([...valid, ...newlyAdded]);
    } else {
      setKanbanColumns(dbStatuses);
    }
    
    if (savedHidden) setHiddenColumns(JSON.parse(savedHidden));
  }, [taskStatuses]);

  const saveColumnConfig = (cols: TaskStatus[], hidden: TaskStatus[]) => {
    setKanbanColumns(cols);
    setHiddenColumns(hidden);
    localStorage.setItem("ezypm_kanban_cols", JSON.stringify(cols));
    localStorage.setItem("ezypm_kanban_hidden", JSON.stringify(hidden));
  };
  
  const toggleColumnVisibility = (col: TaskStatus) => {
    const newHidden = hiddenColumns.includes(col) ? hiddenColumns.filter(c => c !== col) : [...hiddenColumns, col];
    saveColumnConfig(kanbanColumns, newHidden);
  };

  const moveColumn = (index: number, direction: 'up' | 'down') => {
    const newCols = [...kanbanColumns];
    if (direction === 'up' && index > 0) {
      [newCols[index - 1], newCols[index]] = [newCols[index], newCols[index - 1]];
    } else if (direction === 'down' && index < newCols.length - 1) {
      [newCols[index + 1], newCols[index]] = [newCols[index], newCols[index + 1]];
    }
    saveColumnConfig(newCols, hiddenColumns);
  };
  
  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState(initialProject);
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  
  const getPriorityColor = (p: string) => {
    return taskPriorities.find(tp => tp.name === p)?.color || "#6b7280";
  };

  const projectOptions = [
    { value: "All", label: "Project: All", icon: <FolderKanban className="w-4 h-4 text-text-secondary" /> },
    ...projects.map(p => ({
      value: p.id,
      label: p.name,
      icon: p.avatarUrl ? (
        <img src={p.avatarUrl} alt={p.name} className="w-4 h-4 rounded object-contain p-px" style={{ backgroundColor: p.themeColor || '#1e293b' }} />
      ) : (
        <span className="text-xs">📁</span>
      )
    }))
  ];

  const assigneeOptions = [
    { value: "All", label: "Assignee: All", icon: <UsersIcon className="w-4 h-4 text-text-secondary" /> },
    { value: "Unassigned", label: "Unassigned", icon: <UserIcon className="w-4 h-4 text-text-secondary" /> },
    ...users.map(u => ({
      value: u.id,
      label: u.name,
      icon: <UserAvatar user={u} size="sm" className="w-4 h-4 text-[8px]" />
    }))
  ];

  const priorityOptions = [
    { value: "All", label: "Priority: All", icon: <AlertCircle className="w-4 h-4 text-text-secondary" /> },
    ...taskPriorities.map(p => ({
      value: p.name,
      label: p.name,
      icon: <span className="text-lg leading-none" style={{ color: p.color }}>●</span>
    }))
  ];

  const getStatusIcon = (s: string) => {
    if (s === "Completed" || s === "Closed") return <CheckCircle2 className="w-4 h-4 text-success" />;
    if (s === "In Progress") return <Activity className="w-4 h-4 text-primary" />;
    if (s === "Pending" || s === "On Hold") return <Clock className="w-4 h-4 text-warning" />;
    if (s === "No Specs") return <AlertCircle className="w-4 h-4 text-danger" />;
    return <ListTodo className="w-4 h-4 text-text-secondary" />;
  };

  const statusOptions = [
    { value: "All", label: "Status: All", icon: <KanbanSquare className="w-4 h-4 text-text-secondary" /> },
    ...taskStatuses.map(s => ({ value: s.name, label: s.name, icon: getStatusIcon(s.name) }))
  ];

  const handleMyTasks = () => {
    setAssigneeFilter(currentUser?.id || "u1");
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    const matchesProject = projectFilter === "All" || t.projectId === projectFilter;
    const matchesAssignee = assigneeFilter === "All" || 
                            (assigneeFilter === "Unassigned" ? !t.assigneeId : t.assigneeId === assigneeFilter);
    const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesProject && matchesAssignee && matchesPriority;
  });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId as TaskStatus;
    const sourceStatus = result.source.droppableId;
    
    if (newStatus !== sourceStatus) {
      updateTaskStatus(taskId, newStatus);
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        logActivity(`Moved task "${task.title}" to ${newStatus}`);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <div className="flex justify-between items-center shrink-0 mb-2">
        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <ListTodo className="w-6 h-6 text-primary" />
          Tasks
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-surface px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-4 shrink-0 justify-between mb-4">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-surface shadow-sm rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow text-text-primary"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
             <CustomSelect 
               value={statusFilter}
               onChange={setStatusFilter}
               options={statusOptions}
               className="min-w-[120px]"
             />

             <CustomSelect 
               value={projectFilter}
               onChange={setProjectFilter}
               options={projectOptions}
               className="min-w-[140px] max-w-[180px]"
             />

             <CustomSelect 
               value={assigneeFilter}
               onChange={setAssigneeFilter}
               options={assigneeOptions}
               className="min-w-[140px] max-w-[180px]"
             />

             <CustomSelect 
               value={priorityFilter}
               onChange={setPriorityFilter}
               options={priorityOptions}
               className="min-w-[120px]"
             />

             <button 
               onClick={handleMyTasks}
               className="ml-auto lg:ml-2 px-3 py-1.5 rounded-md text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1.5"
             >
               <UserIcon className="w-3.5 h-3.5" /> My Tasks
             </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-page-bg rounded-md p-1 shrink-0">
          <button 
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === "table" ? "bg-surface shadow-sm text-primary" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <LayoutList className="w-4 h-4" /> Table
          </button>
          <button 
            onClick={() => setViewMode("kanban")}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === "kanban" ? "bg-surface shadow-sm text-primary" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <KanbanSquare className="w-4 h-4" /> Kanban
          </button>
          {viewMode === "kanban" && (
            <button 
              onClick={() => setIsConfigModalOpen(true)}
              className="ml-2 p-1.5 bg-page-bg text-text-secondary hover:text-primary hover:bg-surface shadow-sm rounded-md transition-colors border border-border-color/50"
              title="Configure Board"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* CONTENT AREA */}
      {viewMode === "table" ? (
        <Card className="flex flex-col flex-1 overflow-hidden min-h-[400px]">
          <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10 bg-page-bg text-text-secondary text-xs uppercase shadow-sm">
                <tr>
                  <th className="px-6 py-3 font-medium">Task Name</th>
                  <th className="px-6 py-3 font-medium">Project</th>
                  <th className="px-6 py-3 font-medium">Assignee</th>
                  <th className="px-6 py-3 font-medium">Priority</th>
                  <th className="px-6 py-3 font-medium">Est / Act</th>
                  <th className="px-6 py-3 font-medium">Due Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredTasks.map((task) => {
                  const project = projects.find(p => p.id === task.projectId);
                  const assignee = users.find(u => u.id === task.assigneeId);
                  
                  return (
                    <tr 
                      key={task.id} 
                      onClick={() => router.push(`/tasks/${task.id}`)}
                      className="hover:bg-page-bg/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <StatusBadge status={task.status} />
                          <div className="flex flex-col">
                            <span className="font-medium text-text-primary group-hover:text-primary transition-colors">
                              {task.title}
                            </span>
                            {task.parentId && <span className="text-xs text-text-secondary flex items-center gap-1">↳ Subtask</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-text-secondary">{project?.name}</td>
                      <td className="px-6 py-3">
                        {assignee ? (
                          <div className="flex items-center gap-2">
                            <UserAvatar user={assignee} size="sm" />
                            <span className="text-text-primary text-sm truncate max-w-[120px]">{assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-text-secondary text-sm italic">— Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg leading-none" style={{ color: getPriorityColor(task.priority) }}>●</span>
                          <span className="text-text-secondary">{task.priority}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex flex-col text-xs">
                          <span className="text-text-secondary">Est: <span className="text-text-primary font-medium">{task.estimateHours}h</span></span>
                          <span className="text-text-secondary">Act: <span className="text-text-primary font-medium">{task.actualHours}h</span></span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <DateProgressBar startDate={task.startDate} dueDate={task.dueDate} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="flex-1 overflow-x-auto pb-4">
          {isMounted && (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex h-full gap-4 min-w-max items-start">
                {kanbanColumns.filter(c => !hiddenColumns.includes(c)).map((statusColumn) => {
                  const columnTasks = filteredTasks.filter(t => t.status === statusColumn);
                  return (
                    <div key={statusColumn} className="w-80 flex flex-col h-full bg-surface/40 shrink-0 rounded-xl p-1.5 transition-colors">
                      <div className="p-2.5 flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm text-text-primary uppercase tracking-wider">{statusColumn}</span>
                        <span className="bg-surface text-text-secondary text-xs px-2.5 py-0.5 rounded-full shadow-[0_1px_2px_rgb(0,0,0,0.03)] font-medium">{columnTasks.length}</span>
                      </div>
                      
                      <Droppable droppableId={statusColumn}>
                        {(provided, snapshot) => (
                          <div 
                            {...provided.droppableProps} 
                            ref={provided.innerRef}
                            className={`flex-1 overflow-y-auto flex flex-col gap-2.5 min-h-[150px] transition-colors rounded-lg ${snapshot.isDraggingOver ? "bg-page-bg ring-2 ring-primary/20 ring-inset" : ""}`}
                          >
                            {columnTasks.map((task, index) => {
                              const assignee = users.find(u => u.id === task.assigneeId);
                              return (
                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="bg-surface p-4 rounded-xl shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgb(0,0,0,0.08)] transition-all group cursor-grab active:cursor-grabbing border-none"
                                      style={{
                                        ...provided.draggableProps.style,
                                        boxShadow: snapshot.isDragging ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" : undefined,
                                        zIndex: snapshot.isDragging ? 50 : undefined,
                                      }}
                                    >
                                      <div 
                                        onClick={() => router.push(`/tasks/${task.id}`)}
                                        className="flex justify-between items-start mb-2"
                                      >
                                        <h4 className="font-medium text-text-primary text-sm leading-tight group-hover:text-primary transition-colors">{task.title}</h4>
                                      </div>
                                      <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-[10px] font-bold" style={{ color: getPriorityColor(task.priority) }}>● {task.priority}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs text-text-secondary font-medium">{task.estimateHours}h</span>
                                          {assignee ? (
                                              <UserAvatar user={assignee} size="sm" title={assignee.name} />
                                            ) : (
                                              <div className="w-6 h-6 rounded-full border border-dashed border-border-color flex items-center justify-center text-text-secondary" title="Unassigned">?</div>
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      
                      <div className="p-1 mt-2">
                        <button className="w-full py-2 flex items-center justify-center gap-2 text-text-secondary hover:text-primary hover:bg-surface rounded-lg transition-colors text-sm font-medium shadow-[0_1px_2px_rgb(0,0,0,0.02)]">
                          <Plus className="w-4 h-4" /> Add Task
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DragDropContext>
          )}
        </div>
      )}

      {/* CREATE TASK MODAL */}
      <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* CONFIGURE BOARD MODAL */}
      <Modal isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)} title="Configure Kanban Board">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-text-secondary mb-4">Reorder columns or toggle their visibility on the board. Changes are auto-saved locally.</p>
          {kanbanColumns.map((col, idx) => (
            <div key={col} className="flex items-center justify-between p-3 bg-surface border border-border-color rounded-md shadow-sm">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleColumnVisibility(col)}
                  className={`p-1.5 rounded transition-colors ${hiddenColumns.includes(col) ? "text-text-secondary hover:bg-page-bg" : "text-primary hover:bg-primary/10"}`}
                >
                  {hiddenColumns.includes(col) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <span className={`text-sm font-medium ${hiddenColumns.includes(col) ? "text-text-secondary line-through opacity-70" : "text-text-primary"}`}>{col}</span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => moveColumn(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 rounded text-text-secondary hover:bg-page-bg hover:text-primary disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => moveColumn(idx, 'down')}
                  disabled={idx === kanbanColumns.length - 1}
                  className="p-1 rounded text-text-secondary hover:bg-page-bg hover:text-primary disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <div className="mt-6 flex justify-end pt-4 border-t border-border-color">
            <button onClick={() => setIsConfigModalOpen(false)} className="px-4 py-2 bg-primary text-surface rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-12 text-text-secondary">Loading tasks...</div>}>
      <TasksListContent />
    </Suspense>
  );
}
