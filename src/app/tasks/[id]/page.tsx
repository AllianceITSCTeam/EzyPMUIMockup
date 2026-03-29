"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Modal } from "@/components/ui/Modal";
import { FileUploader } from "@/components/ui/FileUploader";
import { CommentInput } from "@/components/ui/CommentInput";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { DateProgressBar } from "@/components/ui/DateProgressBar";
import { formatDate } from "@/lib/utils";
import { ChevronRight, ArrowLeft, Pencil, Clock, Paperclip, Link as LinkIcon, Send, Clock3, ChevronDown, CheckCircle2 } from "lucide-react";
import { TaskStatus, TaskPriority } from "@/types";

function CustomSelect({ value, options, onChange, renderOption, placeholder }: any) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)} 
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="w-full flex items-center justify-between px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm text-text-primary outline-none"
      >
        <span className="truncate">{value ? renderOption(value) : (placeholder || "Select...")}</span>
        <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-200 shrink-0 ml-2 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute top-10 left-0 w-full bg-surface border border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-xl py-1.5 z-50 max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((opt: any) => (
            <button
              key={opt.value}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); onChange(opt.value); setIsOpen(false); }}
              className={`w-full text-left px-3 py-2 transition-all flex items-center gap-2 ${value === opt.value ? "bg-primary/5 text-primary" : "text-text-primary hover:bg-page-bg"}`}
            >
              {renderOption(opt.value, opt.label)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function getBusinessDays(startDateStr: string, endDateStr: string): number {
  if (!startDateStr || !endDateStr) return 0;
  let start = new Date(startDateStr);
  let end = new Date(endDateStr);
  if (start > end) return 0;
  
  let count = 0;
  let cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) {
      count++;
    }
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export default function TaskDetails() {
  const router = useRouter();
  const params = useParams();
  const taskId = params?.id as string;
  const { tasks, projects, users, taskStatuses, taskPriorities, logHours, logActivity, addToast, updateTask, updateTaskStatus, comments, addComment, addRecentLink } = useStore();
  const task = tasks.find(t => t.id === taskId);

  useEffect(() => {
    if (task) {
      const parentProject = projects.find(p => p.id === task.projectId);
      addRecentLink({
        url: `/tasks/${task.id}`,
        name: task.title,
        iconType: 'task',
        themeColor: parentProject?.themeColor
      });
    }
  }, [task?.id]);

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logHoursInput, setLogHoursInput] = useState("");
  const [logDate, setLogDate] = useState(new Date().toISOString().split("T")[0]);
  const [logComment, setLogComment] = useState("");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [checklists, setChecklists] = useState([
    { id: 1, title: "Design wireframes", isDone: true },
    { id: 2, title: "Implement React components", isDone: false }
  ]);
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  
  // Real Subtask Create Modal State
  const [isCreateSubtaskModalOpen, setIsCreateSubtaskModalOpen] = useState(false);
  const [subtaskForm, setSubtaskForm] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    assigneeId: "",
    estimateHours: 0,
    startDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  });

  const handleAddChecklist = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newChecklistTitle.trim()) {
      e.preventDefault();
      setChecklists([...checklists, { id: Date.now(), title: newChecklistTitle.trim(), isDone: false }]);
      setNewChecklistTitle("");
      setIsAddingChecklist(false);
    } else if (e.key === "Escape") {
      setIsAddingChecklist(false);
      setNewChecklistTitle("");
    }
  };

  const toggleChecklist = (id: number) => {
    setChecklists(checklists.map(c => c.id === id ? { ...c, isDone: !c.isDone } : c));
  };
  

  const [links, setLinks] = useState([
    { id: 1, type: "Blocks", title: "Task Beta", url: "#" }
  ]);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkType, setNewLinkType] = useState("Relates to");
  const [linkSelectedIndex, setLinkSelectedIndex] = useState(0);

  const filteredTasks = tasks
    .filter(t => t.id !== taskId && (t.title.toLowerCase().includes(newLinkTitle.toLowerCase()) || t.id.toLowerCase().includes(newLinkTitle.toLowerCase())))
    .slice(0, 5); // display up to 5 suggestions

  const handleAddLink = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const selectedTask = filteredTasks[linkSelectedIndex];
      if (selectedTask && newLinkTitle) {
        setLinks([...links, { id: Date.now(), type: newLinkType, title: selectedTask.title, url: `/tasks/${selectedTask.id}` }]);
        setNewLinkTitle("");
        setIsAddingLink(false);
      } else if (newLinkTitle.trim()) {
        setLinks([...links, { id: Date.now(), type: newLinkType, title: newLinkTitle.trim(), url: "#" }]);
        setNewLinkTitle("");
        setIsAddingLink(false);
      }
    } else if (e.key === "Escape") {
      setIsAddingLink(false);
      setNewLinkTitle("");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setLinkSelectedIndex(prev => Math.min(prev + 1, Math.max(0, filteredTasks.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setLinkSelectedIndex(prev => Math.max(prev - 1, 0));
    }
  };
  const [editForm, setEditForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "To Do",
    priority: task?.priority || "Medium",
    assigneeId: task?.assigneeId || "",
    estimateHours: task?.estimateHours || 0,
    startDate: task?.startDate || "",
    dueDate: task?.dueDate || "",
    oneDeskId: task?.oneDeskId || ""
  });
  
  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-text-secondary">
        <p className="text-lg">Task not found</p>
        <button onClick={() => router.push("/tasks")} className="text-primary hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Tasks
        </button>
      </div>
    );
  }

  const handleCreateSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subtaskForm.title) return;
    
    useStore.getState().addTask({
      id: `t-${Date.now()}`,
      projectId: task.projectId,
      parentId: task.id,
      title: subtaskForm.title,
      description: subtaskForm.description,
      status: subtaskForm.status as TaskStatus,
      priority: subtaskForm.priority as TaskPriority,
      assigneeId: subtaskForm.assigneeId || null,
      estimateHours: subtaskForm.estimateHours,
      actualHours: 0,
      startDate: subtaskForm.startDate,
      dueDate: subtaskForm.dueDate
    });
    
    logActivity(`Created subtask: ${subtaskForm.title} for ${task.title}`);
    addToast("success", "Subtask created successfully");
    setIsCreateSubtaskModalOpen(false);
    setSubtaskForm({ 
      title: "", 
      description: "", 
      status: "To Do", 
      priority: task.priority, 
      assigneeId: "", 
      estimateHours: 0,
      startDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    });
  };
  
  const childSubtasks = tasks.filter(t => t.parentId === task.id);

  const project = projects.find(p => p.id === task.projectId);
  const assignee = users.find(u => u.id === task.assigneeId);
  const isOverrun = task.actualHours > task.estimateHours;
  const progressPercent = task.estimateHours > 0 ? (task.actualHours / task.estimateHours) * 100 : 0;
  
  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hrs = Number(logHoursInput);
    if (!hrs || hrs <= 0) return;
    
    logHours(taskId, hrs, logComment, logDate);
    logActivity(`Logged ${hrs}h on task: ${task.title}`);
    addToast("success", `Logged ${hrs} hours successfully`);
    
    setIsLogModalOpen(false);
    setLogHoursInput("");
    setLogComment("");
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    
    const changes = [];
    if (task.title !== editForm.title) changes.push("title");
    if (task.description !== editForm.description) changes.push("description");
    if (task.status !== editForm.status) changes.push(`status to ${editForm.status}`);
    if (task.priority !== editForm.priority) changes.push(`priority to ${editForm.priority}`);
    if (task.estimateHours !== Number(editForm.estimateHours)) changes.push(`estimate to ${editForm.estimateHours}h`);
    if (task.startDate !== editForm.startDate) changes.push("start date");
    if (task.dueDate !== editForm.dueDate) changes.push("due date");
    if ((task.assigneeId || "") !== editForm.assigneeId) {
      if (!editForm.assigneeId) changes.push("unassigned");
      else {
        const newAssignee = users.find(u => u.id === editForm.assigneeId);
        changes.push(`assigned to ${newAssignee?.name || 'someone'}`);
      }
    }

    if ((task.oneDeskId || "") !== editForm.oneDeskId) changes.push(`One Desk # to ${editForm.oneDeskId || "empty"}`);

    updateTask(task.id, {
      ...editForm,
      estimateHours: Number(editForm.estimateHours),
      assigneeId: editForm.assigneeId || null,
      oneDeskId: editForm.oneDeskId ? editForm.oneDeskId : undefined
    });
    addToast("success", "Task updated successfully");
    
    let activityText = `Updated task: ${editForm.title}`;
    if (changes.length > 0) {
      activityText += ` (Changed: ${changes.join(", ")})`;
    }
    logActivity(activityText);
    
    setIsEditModalOpen(false);
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "text-danger";
      case "High": return "text-warning";
      case "Medium": return "text-primary";
      case "Low": return "text-success";
      default: return "text-text-secondary";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full overflow-y-auto pb-10">
      {/* BREADCRUMB & HEADER */}
      <div className="flex flex-col gap-2 shrink-0">
        <div className="flex items-center gap-2 text-sm text-text-secondary font-medium flex-wrap">
          <Link href="/projects" className="hover:text-primary transition-colors">Projects</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          {project ? (
            <Link href={`/projects/${project.id}`} className="hover:text-primary transition-colors">{project.name}</Link>
          ) : <span>Unknown Project</span>}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-text-primary">{task.title}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-text-primary">{task.title}</h2>
          </div>
          <button 
            onClick={() => {
              setEditForm({
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                assigneeId: task.assigneeId || "",
                estimateHours: task.estimateHours,
                startDate: task.startDate,
                dueDate: task.dueDate,
                oneDeskId: task.oneDeskId || ""
              });
              setIsEditModalOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-surface shadow-sm rounded-md text-sm font-medium text-text-primary hover:shadow-md transition-shadow"
          >
            <Pencil className="w-4 h-4" /> Edit
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT COLUMN - CONTENT */}
        <div className="flex-1 flex flex-col gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6 relative">
              <div className="relative">
                <button 
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsStatusDropdownOpen(false), 200)}
                  className="flex items-center gap-1.5 hover:opacity-80 transition-opacity bg-transparent border-none p-0 outline-none"
                >
                  <StatusBadge status={task.status} />
                  <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${isStatusDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {isStatusDropdownOpen && (
                  <div className="absolute top-10 left-0 w-44 bg-surface border border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                     {taskStatuses.map(s => (
                       <button
                         key={s.id}
                         onClick={() => {
                           updateTaskStatus(task.id, s.name);
                           setIsStatusDropdownOpen(false);
                           addToast("success", `Status changed to ${s.name}`);
                           logActivity(`Changed status of task ${task.title} to: ${s.name}`);
                         }}
                         className={`w-full text-left px-3 py-2 transition-all flex items-center justify-between ${
                           task.status === s.name 
                             ? "bg-primary/5" 
                             : "hover:bg-page-bg/80"
                         }`}
                       >
                         <StatusBadge status={s.name} />
                         {task.status === s.name && <CheckCircle2 className="w-4 h-4 text-primary opacity-80" />}
                       </button>
                     ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 bg-surface shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] border border-transparent px-2.5 py-1 rounded text-sm text-text-primary font-medium">
                <span className={`text-[10px] ${getPriorityColor(task.priority)}`}>●</span>
                {task.priority} Priority
              </div>
              {task.oneDeskId ? (
                <div className="flex items-center gap-1.5 bg-surface shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] border border-transparent px-2.5 py-1 rounded text-sm text-text-primary font-medium">
                  <span className="text-text-secondary">One Desk #:</span> {task.oneDeskId}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 bg-surface shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] border border-transparent px-2.5 py-1 rounded text-sm text-text-primary font-medium opacity-60">
                  <span className="text-text-secondary">One Desk #:</span> None
                </div>
              )}

            </div>
            
            <div className="prose prose-sm max-w-none text-text-secondary leading-relaxed">
              <p>{task.description || "No description provided for this task."}</p>
            </div>

            <div className="mt-8 pt-4">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-4">
                <Paperclip className="w-4 h-4" /> File Attachments
              </h3>
              <FileUploader initialFiles={[{ name: "specs_v2.pdf", size: "2.4 MB" }]} />
            </div>

            <div className="mt-8 pt-4">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Checklist</h3>
              <div className="flex flex-col gap-3">
                {checklists.map(cItem => (
                  <label key={cItem.id} className={`flex items-center gap-3 p-3 bg-surface shadow-[0_2px_8px_rgb(0,0,0,0.04)] rounded-md cursor-pointer hover:shadow-md transition-all ${cItem.isDone ? "opacity-60" : ""}`}>
                    <input 
                      type="checkbox" 
                      checked={cItem.isDone}
                      onChange={() => toggleChecklist(cItem.id)}
                      className="w-4 h-4 rounded border-border-color accent-primary duration-200" 
                    />
                    <span className={`text-sm text-text-primary ${cItem.isDone ? "line-through" : "font-medium"}`}>{cItem.title}</span>
                  </label>
                ))}
                
                {isAddingChecklist ? (
                  <div className="flex items-center gap-3 p-2 bg-surface shadow-[0_2px_8px_rgb(0,0,0,0.04)] rounded-md border border-primary/50">
                    <input 
                      autoFocus
                      type="text" 
                      value={newChecklistTitle}
                      onChange={e => setNewChecklistTitle(e.target.value)}
                      onKeyDown={handleAddChecklist}
                      placeholder="Type checklist item and press Enter (Esc to cancel)"
                      className="flex-1 bg-transparent border-none focus:outline-none text-sm px-2 py-1 text-text-primary"
                    />
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsAddingChecklist(true)}
                    className="text-primary text-sm font-medium mt-1 flex items-center gap-1 hover:underline w-fit"
                  >
                    + Add checklist item
                  </button>
                )}
              </div>
            </div>

            <div className="mt-8 pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-text-primary">Subtasks</h3>
                <button 
                  onClick={() => setIsCreateSubtaskModalOpen(true)}
                  className="text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                >
                  + Create Subtask
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {childSubtasks.length === 0 ? (
                  <p className="text-sm text-text-secondary italic">No subtasks yet.</p>
                ) : (
                  childSubtasks.map(subtask => (
                    <Link key={subtask.id} href={`/tasks/${subtask.id}`} className="flex items-center justify-between p-3 bg-surface border border-transparent shadow-[0_1px_3px_rgb(0,0,0,0.02)] hover:border-border-color hover:shadow-md transition-all rounded-md group">
                      <div className="flex items-center gap-3">
                        <StatusBadge status={subtask.status} />
                        <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">{subtask.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-text-secondary font-medium">{subtask.estimateHours}h</span>
                        {subtask.assigneeId ? (
                          <UserAvatar user={users.find(u => u.id === subtask.assigneeId) || users[0]} size="sm" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border border-dashed border-border-color flex items-center justify-center text-text-secondary text-xs">?</div>
                        )}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div className="mt-8 pt-4">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-4">
                <LinkIcon className="w-4 h-4" /> Task Links
              </h3>
              <div className="flex flex-col gap-2">
                {links.map(link => (
                  <div key={link.id} className="text-sm text-text-secondary flex items-center gap-2 bg-surface p-2 rounded-md shadow-[0_1px_3px_rgb(0,0,0,0.02)] border border-transparent hover:border-border-color transition-colors">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      link.type === 'Blocks' ? 'bg-warning/20 text-warning' :
                      link.type === 'Is blocked by' ? 'bg-danger/10 text-danger' :
                      'bg-page-bg text-text-secondary'
                    }`}>
                      {link.type}
                    </span>
                    <Link href={link.url} className="font-medium hover:underline text-text-primary truncate max-w-[200px]">{link.title}</Link>
                    <button onClick={() => setLinks(links.filter(l => l.id !== link.id))} className="text-text-secondary hover:text-danger ml-auto p-1 rounded hover:bg-danger/10 transition-colors">
                      ✕
                    </button>
                  </div>
                ))}
                
                {isAddingLink ? (
                  <div className="relative">
                    <div className="flex items-center gap-2 p-2 bg-surface shadow-[0_2px_8px_rgb(0,0,0,0.04)] rounded-md border border-primary/50 flex-wrap">
                      <select 
                        value={newLinkType}
                        onChange={e => setNewLinkType(e.target.value)}
                        className="bg-page-bg border-none focus:outline-none text-xs px-2 py-1.5 rounded text-text-secondary font-medium outline-none cursor-pointer"
                      >
                        <option value="Relates to">Relates to</option>
                        <option value="Blocks">Blocks</option>
                        <option value="Is blocked by">Is blocked by</option>
                        <option value="Duplicates">Duplicates</option>
                      </select>
                      <input 
                        autoFocus
                        type="text" 
                        value={newLinkTitle}
                        onChange={e => {
                          setNewLinkTitle(e.target.value);
                          setLinkSelectedIndex(0);
                        }}
                        onKeyDown={handleAddLink}
                        placeholder="Search tasks..."
                        className="flex-1 min-w-[150px] bg-transparent border-none focus:outline-none text-sm px-2 text-text-primary"
                      />
                      <button onClick={() => setIsAddingLink(false)} className="text-text-secondary hover:text-danger p-1 rounded hover:bg-page-bg transition-colors">
                        ✕
                      </button>
                    </div>
                    {newLinkTitle && filteredTasks.length > 0 && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-surface border border-border-color rounded-md shadow-[0_4px_20px_rgb(0,0,0,0.1)] z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
                        <div className="flex flex-col max-h-[200px] overflow-y-auto pt-1 pb-1">
                          {filteredTasks.map((t, idx) => (
                            <button
                              key={t.id}
                              type="button"
                              onMouseEnter={() => setLinkSelectedIndex(idx)}
                              onClick={() => {
                                setLinks([...links, { id: Date.now(), type: newLinkType, title: t.title, url: `/tasks/${t.id}` }]);
                                setNewLinkTitle("");
                                setIsAddingLink(false);
                              }}
                              className={`w-full text-left px-3 py-2 transition-colors flex flex-col gap-0.5 ${
                                idx === linkSelectedIndex ? "bg-page-bg" : "hover:bg-page-bg"
                              }`}
                            >
                              <div className="flex justify-between items-center w-full">
                                <span className={`text-sm font-medium ${idx === linkSelectedIndex ? "text-primary" : "text-text-primary"}`}>{t.title}</span>
                                <span className="text-[10px] text-text-secondary shrink-0 font-bold uppercase">{t.id}</span>
                              </div>
                              <span className="text-[10px] text-text-secondary">{projects.find(p => p.id === t.projectId)?.name || "Unknown Project"}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsAddingLink(true)}
                    className="text-primary text-sm font-medium mt-1 flex items-center gap-1 hover:underline w-fit"
                  >
                    + Add link
                  </button>
                )}
              </div>
            </div>
          </Card>

          {/* COMMENTS & LOGS */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-text-primary text-lg">Activity & Comments</h3>
            
            {/* Comment Form */}
            <CommentInput 
              onSubmit={(content) => {
                const currentUser = users.find(u => u.name === "Bui Minh Dung") || users[0];
                const newComment = {
                  id: `c-${Date.now()}`,
                  taskId: task.id,
                  userId: currentUser.id,
                  content,
                  timestamp: "Just now"
                };
                addComment(newComment);
                logActivity(`Commented on ${task.title}`);
                addToast("success", "Comment posted successfully");
              }}
            />

            {/* Activities */}
            <div className="flex flex-col gap-4 mt-4 relative">
              <div className="absolute left-[15px] top-6 bottom-6 w-px bg-border-color" />
              
              {/* Dynamic Comments List */}
              {comments.filter(c => c.taskId === task.id).map(comment => {
                const commentUser = users.find(u => u.id === comment.userId) || users[0];
                return (
                  <div key={comment.id} className="flex gap-4 relative z-10">
                    <UserAvatar user={commentUser} size="md" className="ring-4 ring-page-bg mt-1" />
                    <Card className="flex-1 p-4 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-text-primary text-sm">{commentUser.name}</span>
                        <span className="text-xs text-text-secondary">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-text-secondary whitespace-pre-wrap">{comment.content}</p>
                    </Card>
                  </div>
                );
              })}

              {/* Fake Status Change */}
              <div className="flex gap-4 relative z-10 items-center">
                <div className="w-8 h-8 rounded-full bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all flex items-center justify-center text-xs font-bold text-text-secondary shrink-0 ring-4 ring-page-bg">
                  <Clock3 className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-text-secondary">
                    <span className="font-medium text-text-primary">Admin</span> changed status from <b>To Do</b> to <b>In Progress</b>
                    <span className="text-xs opacity-70 ml-2">• 1 day ago</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - SIDEBAR */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
          <Card className="p-5 flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Assignee</span>
              {assignee ? (
                <Link href={`/team/${assignee.id}`} className="flex items-center gap-2 mt-1 hover:bg-page-bg p-1.5 -ml-1.5 rounded-md transition-colors cursor-pointer">
                  <UserAvatar user={assignee} size="sm" />
                  <span className="text-sm font-medium text-text-primary">{assignee.name}</span>
                </Link>
              ) : (
                <div className="text-sm text-text-secondary italic mt-1 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border border-dashed border-border-color flex items-center justify-center">?</div>
                  Unassigned
                  <button className="text-primary text-xs ml-auto hover:underline font-medium">Assign me</button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Project</span>
              {project ? (
                <Link href={`/projects/${project.id}`} className="text-sm font-medium text-primary hover:underline mt-1 truncate">
                  {project.name}
                </Link>
              ) : (
                <span className="text-sm text-text-secondary mt-1">N/A</span>
              )}
            </div>

            <div className="flex flex-col gap-2 w-full">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Timeline</span>
              <DateProgressBar startDate={task.startDate} dueDate={task.dueDate} showBothDates={true} />
              <div className="mt-2 text-xs font-medium text-text-secondary bg-surface p-2 rounded border border-border-color">
                Total Business Days: <span className="text-text-primary font-bold">{getBusinessDays(task.startDate, task.dueDate)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 flex flex-col gap-4 bg-primary/5">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Time Tracking</h3>
              <button onClick={() => setIsLogModalOpen(true)} className="flex items-center gap-1.5 text-xs font-bold bg-primary text-surface px-2.5 py-1.5 rounded hover:bg-primary/90 transition-colors">
                <Clock className="w-3.5 h-3.5" /> Log Hours
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center justify-center bg-surface py-2 rounded shadow-sm">
                <span className="text-[10px] font-bold text-text-secondary uppercase">Estimate</span>
                <span className="font-bold text-text-primary">{task.estimateHours}h</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-surface py-2 rounded shadow-sm">
                <span className="text-[10px] font-bold text-text-secondary uppercase">Actual</span>
                <span className={`font-bold ${isOverrun ? "text-danger" : "text-primary"}`}>{task.actualHours}h</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-surface py-2 rounded shadow-sm">
                <span className="text-[10px] font-bold text-text-secondary uppercase">Remain</span>
                <span className="font-bold text-text-primary">{Math.max(0, task.estimateHours - task.actualHours)}h</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5 mt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-medium">Progress</span>
                <span className={`font-bold ${isOverrun ? "text-danger" : "text-primary"}`}>{progressPercent.toFixed(1)}%</span>
              </div>
              <ProgressBar percentage={progressPercent} isOverrun={isOverrun} />
              {isOverrun && <span className="text-xs text-danger font-medium mt-1 text-center">Over estimate limits ⚠️</span>}
            </div>

            {/* Time History inside the Card */}
            <div className="pt-4 mt-2 border-t border-primary/10">
              <h4 className="text-xs font-bold text-primary mb-3 flex justify-between items-center uppercase tracking-wider">
                <span>Time History</span>
                <span className="bg-primary/10 px-2 py-0.5 rounded text-[10px]">{task.timeLogs?.length || 0} entries</span>
              </h4>
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                {!task.timeLogs || task.timeLogs.length === 0 ? (
                  <div className="text-center py-4 text-xs text-text-secondary italic">
                    No time has been logged yet.
                  </div>
                ) : (
                  task.timeLogs.map((log) => {
                    const user = users.find(u => u.id === log.userId);
                    return (
                      <div key={log.id} className="bg-surface/50 p-2.5 rounded border border-primary/5 flex flex-col gap-1 hover:bg-surface transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <UserAvatar user={user} size="md" className="ring-2 ring-surface shadow-[0_1px_2px_rgb(0,0,0,0.05)]" />
                            <span className="text-[11px] font-semibold text-text-primary">{formatDate(log.date)}</span>
                          </div>
                          <span className="text-[11px] font-bold text-primary bg-primary/10 px-1 py-0.5 rounded">+{log.hours}h</span>
                        </div>
                        {log.comment && (
                          <p className="text-[11px] text-text-secondary mt-0.5 ml-5 bg-page-bg/50 px-1.5 py-1 rounded truncate" title={log.comment}>
                            "{log.comment}"
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* EDIT TASK MODAL */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Task">
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Task Title *</label>
            <input 
              type="text" required value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})}
              className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Description</label>
            <textarea 
              rows={3} value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})}
              className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Status</label>
              <CustomSelect 
                value={editForm.status} 
                onChange={(v: any) => setEditForm({...editForm, status: v})}
                options={taskStatuses.map(s => ({value: s.name}))}
                renderOption={(v: any) => <div className="flex items-center gap-2"><StatusBadge status={v} /></div>}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Priority</label>
              <CustomSelect 
                value={editForm.priority} 
                onChange={(v: any) => setEditForm({...editForm, priority: v})}
                options={taskPriorities.map(p => ({value: p.name}))}
                renderOption={(v: any) => (
                  <div className="flex items-center gap-1.5 font-medium text-sm">
                    <span className={`text-[10px] ${getPriorityColor(v)}`}>●</span> {v}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Assignee</label>
              <CustomSelect 
                value={editForm.assigneeId} 
                onChange={(v: any) => setEditForm({...editForm, assigneeId: v})}
                options={[{value: ""}, ...users.map(u => ({value: u.id, label: u.name}))]}
                placeholder="Unassigned"
                renderOption={(v: any, label?: string) => {
                  if (!v) return <span className="text-text-secondary italic">Unassigned</span>;
                  const u = users.find(user => user.id === v);
                  return u ? (
                    <div className="flex items-center gap-2">
                      <UserAvatar user={u} size="sm" />
                      <span className="font-medium text-sm">{u.name}</span>
                    </div>
                  ) : <span>Unknown</span>;
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Estimate Hours</label>
              <input 
                type="number" step="0.5" min="0" required value={editForm.estimateHours} onChange={e => setEditForm({...editForm, estimateHours: Number(e.target.value)})}
                className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Start Date</label>
              <input 
                type="date" value={editForm.startDate} onChange={e => setEditForm({...editForm, startDate: e.target.value})}
                className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Due Date</label>
              <input 
                type="date" value={editForm.dueDate} onChange={e => setEditForm({...editForm, dueDate: e.target.value})}
                className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
              />
            </div>
          </div>


          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">One Desk #</label>
            <input 
              type="text" value={editForm.oneDeskId || ""} onChange={e => setEditForm({...editForm, oneDeskId: e.target.value})}
              className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
            />
          </div>

          <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-border-color">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-page-bg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-surface hover:bg-primary/90 transition-colors">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} title="Log Hours">
        <p className="text-sm text-text-secondary mb-4 italic">Task: {task.title}</p>
        <form onSubmit={handleLogSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Actual Hours *</label>
            <input 
              type="number" step="0.5" min="0.5" required value={logHoursInput} onChange={e => setLogHoursInput(e.target.value)}
              className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
              placeholder="e.g. 2.5"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Date *</label>
            <input 
              type="date" required value={logDate} onChange={e => setLogDate(e.target.value)}
              className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Work Description (Optional)</label>
            <textarea 
              rows={3} value={logComment} onChange={e => setLogComment(e.target.value)}
              className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary resize-none"
              placeholder="What did you work on?"
            />
          </div>
          <div className="bg-page-bg p-3 rounded-md border border-border-color text-sm text-text-secondary mt-2">
            <div className="flex justify-between items-center mb-1">
              <span>Estimate:</span>
              <span className="font-bold text-text-primary">{task.estimateHours}h</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Accumulated so far:</span>
              <span className="font-bold text-text-primary">{task.actualHours}h</span>
            </div>
            {logHoursInput && (
              <div className="flex justify-between items-center mt-1 pt-1 border-t border-border-color/50 text-primary">
                <span>After logging:</span>
                <span className="font-bold">{task.actualHours + Number(logHoursInput)}h</span>
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-3 pt-2">
            <button type="button" onClick={() => setIsLogModalOpen(false)} className="px-4 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-page-bg transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-2 rounded-md text-sm font-medium bg-primary text-surface hover:bg-primary/90 transition-colors">
              Save Log
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isCreateSubtaskModalOpen} onClose={() => setIsCreateSubtaskModalOpen(false)} title={`Create Subtask for "${task.title}"`}>
        <form onSubmit={handleCreateSubtaskSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Subtask Title *</label>
            <input 
              type="text" required value={subtaskForm.title} onChange={e => setSubtaskForm({...subtaskForm, title: e.target.value})}
              className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none text-text-primary"
              placeholder="e.g. Test new component"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Description</label>
            <textarea 
              rows={3} value={subtaskForm.description} onChange={e => setSubtaskForm({...subtaskForm, description: e.target.value})}
              className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary resize-none"
              placeholder="Brief overview of the subtask requirements"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Status <span className="text-danger">*</span></label>
              <CustomSelect 
                value={subtaskForm.status} 
                onChange={(val: any) => setSubtaskForm({...subtaskForm, status: val})}
                options={taskStatuses.map(s => ({ value: s.name, label: s.name }))}
                renderOption={(v: any) => <div className="flex items-center gap-2"><StatusBadge status={v} /></div>}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Priority</label>
              <CustomSelect 
                value={subtaskForm.priority} 
                onChange={(val: any) => setSubtaskForm({...subtaskForm, priority: val})}
                options={taskPriorities.map(p => ({ value: p.name, label: p.name }))}
                renderOption={(v: any) => (
                  <div className="flex items-center gap-1.5 font-medium text-sm">
                    <span className={`text-[10px] ${getPriorityColor(v)}`}>●</span> {v}
                  </div>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Start Date *</label>
              <input 
                type="date" required value={subtaskForm.startDate} onChange={e => setSubtaskForm({...subtaskForm, startDate: e.target.value})}
                className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Due Date</label>
              <input 
                type="date" value={subtaskForm.dueDate} onChange={e => setSubtaskForm({...subtaskForm, dueDate: e.target.value})}
                className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Assignee</label>
              <CustomSelect 
                value={subtaskForm.assigneeId} 
                onChange={(v: any) => setSubtaskForm({...subtaskForm, assigneeId: v})}
                options={[{value: ""}, ...users.map(u => ({value: u.id, label: u.name}))]}
                placeholder="Unassigned"
                renderOption={(v: any, label?: string) => {
                  if (!v) return <span className="text-text-secondary italic">Unassigned</span>;
                  const u = users.find(user => user.id === v);
                  return u ? (
                    <div className="flex items-center gap-2">
                      <UserAvatar user={u} size="sm" />
                      <span className="font-medium text-sm">{u.name}</span>
                    </div>
                  ) : <span>Unknown</span>;
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Estimate Hours</label>
              <input 
                type="number" min="0" value={subtaskForm.estimateHours} onChange={e => setSubtaskForm({...subtaskForm, estimateHours: Number(e.target.value)})}
                className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none text-text-primary"
                placeholder="e.g. 4"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-border-color">
            <button type="button" onClick={() => setIsCreateSubtaskModalOpen(false)} className="px-4 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-page-bg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-surface hover:bg-primary/90 transition-colors">
              Create Subtask
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
