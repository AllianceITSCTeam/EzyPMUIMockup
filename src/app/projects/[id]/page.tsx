"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { THEME_COLORS } from "@/lib/mockData";
import { Card } from "@/components/ui/Card";
import { DateProgressBar } from "@/components/ui/DateProgressBar";
import { StatusBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Modal } from "@/components/ui/Modal";
import { ApplicationInput } from "@/components/ui/ApplicationInput";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { SkillTag } from "@/components/ui/SkillTag";
import { formatDate, calcBusinessDays } from "@/lib/utils";
import { CreateTaskModal } from "@/components/ui/CreateTaskModal";
import { ChevronRight, ArrowLeft, Pencil, Users, LayoutList, Share2, Plus, FileText, X, Search, Trash2, Building2, Landmark, Crown, Store, Headset, Handshake, Info, CheckCircle2, BarChart2, ChevronDown, PanelLeftClose, PanelLeftOpen, Paperclip } from "lucide-react";

export default function ProjectDetails() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;
  const { projects, users, tasks, companies, addToast, logActivity, updateProject, addRecentLink, addStakeholder, removeStakeholder, addResourceToProject, removeResourceFromProject } = useStore();
  const [activeTab, setActiveTab] = useState<"gantt" | "tasks" | "resources" | "stakeholders">("gantt");
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [resourceSearchQuery, setResourceSearchQuery] = useState("");
  const [selectedResourceRole, setSelectedResourceRole] = useState("Member");
  
  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'Client': return <Building2 className="w-3.5 h-3.5" />;
      case 'Sponsor': return <Landmark className="w-3.5 h-3.5" />;
      case 'Business Owner': return <Crown className="w-3.5 h-3.5" />;
      case 'Vendor': return <Store className="w-3.5 h-3.5" />;
      case 'IT Service': return <Headset className="w-3.5 h-3.5" />;
      case 'Partner': return <Handshake className="w-3.5 h-3.5" />;
      default: return <Info className="w-3.5 h-3.5" />;
    }
  };
  
  const [isAddStakeholderOpen, setIsAddStakeholderOpen] = useState(false);
  const [stakeholderForm, setStakeholderForm] = useState({ name: "", role: "Client", isCustom: true, id: "" });
  const [stakeholderSearchQuery, setStakeholderSearchQuery] = useState("");

  const project = projects.find(p => p.id === projectId);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskEditForm, setTaskEditForm] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    assigneeId: "",
    estimateHours: 0,
    dueDate: "",
    oneDeskId: ""
  });

  useEffect(() => {
    if (project) {
      addRecentLink({
        url: `/projects/${project.id}`,
        name: project.name,
        iconType: 'project',
        avatarUrl: project.avatarUrl,
        themeColor: project.themeColor
      });
    }
  }, [project?.id]);

  // Populate task edit form when editing task changes
  useEffect(() => {
    if (editingTaskId) {
      const task = tasks.find(t => t.id === editingTaskId);
      if (task) {
        setTaskEditForm({
          title: task.title,
          description: task.description || "",
          status: task.status,
          priority: task.priority,
          assigneeId: task.assigneeId ?? "",
          estimateHours: task.estimateHours,
          dueDate: task.dueDate,
          oneDeskId: task.oneDeskId || ""
        });
      }
    }
  }, [editingTaskId]);

  const [ganttExpandedTasks, setGanttExpandedTasks] = useState<Set<string>>(new Set());


  const [editForm, setEditForm] = useState({
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || "Active",
    estimateSource: project?.estimateSource || "TASK",
    startDate: project?.startDate || "",
    endDate: project?.endDate || "",
    estimateHours: project?.estimateHours || 0,
    themeColor: project?.themeColor || THEME_COLORS[0],
    avatarUrl: project?.avatarUrl || "",
    stakeholders: project?.stakeholders || [],
    oneDeskId: project?.oneDeskId || "",
    companyIds: project?.companyIds || [],
    applications: project?.applications || [],
    specFiles: project?.specFiles || []
  });
  const [newEditStakeholderId, setNewEditStakeholderId] = useState("");
  const [newEditStakeholderRole, setNewEditStakeholderRole] = useState("Client");

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-text-secondary">
        <FileText className="w-12 h-12 text-border-color" />
        <p className="text-lg">Project not found</p>
        <button onClick={() => router.push("/projects")} className="text-primary hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </button>
      </div>
    );
  }

  const isOverrun = project.progressPercentage > 100;
  
  // Real data for tabs based on project
  const projectTasks = tasks.filter(t => t.projectId === project.id);
  
  useEffect(() => {
    if (activeTab === "gantt" && ganttExpandedTasks.size === 0) {
      const hasParents = projectTasks.filter(t => projectTasks.some(c => c.parentId === t.id));
      setGanttExpandedTasks(new Set(hasParents.map(t => t.id)));
    }
  }, [activeTab, projectTasks.length]);

  const toggleGanttExpand = (id: string) => {
    const next = new Set(ganttExpandedTasks);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setGanttExpandedTasks(next);
  };
  const projectResources = project.resources || [];
  const currentProjectUserIds = projectResources.length > 0 
    ? projectResources.map(r => r.userId)
    : (project.userIds || users.slice(0, project.resourceCount || 3).map(u => u.id));
    
  const projectUsers = projectResources.length > 0
    ? projectResources.map(r => {
        const u = users.find(user => user.id === r.userId);
        return u ? { ...u, projectRole: r.role } : null;
      }).filter(Boolean) as (import("@/types").User & { projectRole: string })[]
    : users.filter(u => currentProjectUserIds.includes(u.id)).map(u => ({ ...u, projectRole: "Member" }));
    
  const availableUsers = users.filter(u => !currentProjectUserIds.includes(u.id));

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUsers.length === 0) return;
    
    const addedNames = availableUsers
      .filter(u => selectedUsers.includes(u.id))
      .map(u => u.name)
      .join(", ");
      
    addResourceToProject(project.id, selectedUsers, selectedResourceRole);
      
    addToast("success", `Added ${addedNames} to project as ${selectedResourceRole}`);
    logActivity(`Added ${addedNames} to ${project.name} as ${selectedResourceRole}`);
    
    setIsAddResourceOpen(false);
    setSelectedUsers([]);
    setResourceSearchQuery("");
    setSelectedResourceRole("Member");
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    updateProject(project.id, {
      ...editForm,
      estimateHours: Number(editForm.estimateHours)
    });
    addToast("success", "Project updated successfully");
    logActivity(`Updated project details for: ${editForm.name}`);
    setIsEditModalOpen(false);
  };

  const handleAddStakeholder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    if (!stakeholderForm.name.trim()) return;
    addStakeholder(project.id, {
      id: stakeholderForm.isCustom ? `sh-custom-${Date.now()}` : stakeholderForm.id,
      name: stakeholderForm.name,
      role: stakeholderForm.role,
      isCustom: stakeholderForm.isCustom
    });
    addToast("success", `Added stakeholder ${stakeholderForm.name}`);
    logActivity(`Added stakeholder ${stakeholderForm.name} to ${project.name}`);
    setIsAddStakeholderOpen(false);
    setStakeholderForm({ name: "", role: "Client", isCustom: true, id: "" });
    setStakeholderSearchQuery("");
  };

  const availableUsersForStakeholders = users.filter(u => 
    !(project.stakeholders || []).some(s => s.id === u.id)
  );

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* BREADCRUMB & HEADER */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-text-secondary font-medium">
          <Link href="/projects" className="hover:text-primary transition-colors">Projects</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-text-primary">{project.name}</span>
        </div>
        <div className="flex justify-between items-center shrink-0 mb-4">
          <div className="flex items-center gap-3">
            {project.avatarUrl && (
              <img src={project.avatarUrl} alt={project.name} className="w-8 h-8 rounded-md object-contain p-1 shadow-sm" style={{ backgroundColor: project.themeColor || '#1e293b' }} />
            )}
            <h2 className="text-2xl font-bold text-text-primary">{project.name}</h2>
            <StatusBadge status={project.status} />
            <span className="text-[10px] font-bold uppercase tracking-wider bg-page-bg px-2 py-1 rounded text-text-secondary border border-border-color">
              {project.estimateSource}
            </span>
          </div>
          <button 
            onClick={() => {
              setEditForm({
                name: project.name,
                description: project.description,
                status: project.status,
                estimateSource: project.estimateSource,
                startDate: project.startDate,
                endDate: project.endDate,
                estimateHours: project.estimateHours,
                themeColor: project.themeColor || THEME_COLORS[0],
                avatarUrl: project.avatarUrl || "",
                stakeholders: project.stakeholders || [],
                oneDeskId: project.oneDeskId || "",
                companyIds: project.companyIds || [],
                applications: project.applications || [],
                specFiles: project.specFiles || []
              });
              setIsEditModalOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-surface shadow-sm rounded-md text-sm font-medium text-text-primary hover:shadow-md transition-shadow"
          >
            <Pencil className="w-4 h-4" /> Edit
          </button>
        </div>
      </div>

      <div className={`flex flex-1 overflow-hidden relative transition-all duration-300 ${isSidebarOpen ? 'gap-6' : 'gap-0'}`}>
        {/* SIDEBAR */}
        <div className={`flex flex-col gap-6 overflow-y-auto transition-all duration-300 shrink-0 ${isSidebarOpen ? 'w-full lg:w-[320px] xl:w-[350px] opacity-100' : 'w-0 opacity-0 overflow-hidden hidden lg:flex'} pr-1`}>
          <Card className="p-5 flex flex-col gap-4 shadow-sm border-none shrink-0 relative group/sidebar">
            <div className="flex items-center justify-between pb-1 border-b border-transparent">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                Project Information
              </h3>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="text-text-secondary hover:text-primary transition-colors p-1 rounded hover:bg-page-bg opacity-50 hover:opacity-100"
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {project.description || "No description provided."}
            </p>
            
            {(project.oneDeskId || (project.companyIds && project.companyIds.length > 0)) && (
              <div className="flex flex-col gap-3 mt-1 pt-3 border-t border-black/5 dark:border-white/5">
                {project.oneDeskId && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-text-secondary font-medium uppercase tracking-widest">One Desk #</span>
                    <span className="text-sm font-semibold text-text-primary px-2 py-1 bg-page-bg rounded-md w-fit border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]">{project.oneDeskId}</span>
                  </div>
                )}
                {project.companyIds && project.companyIds.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-text-secondary font-medium uppercase tracking-widest">Companies</span>
                    <div className="flex flex-col gap-1">
                      {project.companyIds.map(id => {
                        const comp = companies.find(c => c.id === id);
                        if (!comp) return null;
                        return (
                          <div key={id} className="flex items-center gap-2 text-sm text-text-primary font-medium">
                            <Building2 className="w-3.5 h-3.5 text-text-secondary" />
                            {comp.name}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
                {project.applications && project.applications.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-text-secondary font-medium uppercase tracking-widest">Applications</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.applications.map(app => (
                        <span key={app} className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded shadow-[0_1px_2px_rgb(0,0,0,0.05)]">
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {project.specFiles && project.specFiles.length > 0 && (
              <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-black/5 dark:border-white/5">
                <span className="text-xs text-text-secondary font-medium uppercase tracking-widest flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Spec Files
                </span>
                <div className="flex flex-col gap-1.5">
                  {project.specFiles.map((file, idx) => (
                    <a key={idx} href={file.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-page-bg hover:bg-surface px-2 py-1.5 rounded-md border border-transparent hover:border-border-color transition-all group">
                       <FileText className="w-4 h-4 text-primary group-hover:scale-110 transition-transform shrink-0" />
                       <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors truncate">{file.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-6 mt-2 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-text-secondary font-medium uppercase tracking-widest">Start Date</span>
                <span className="font-semibold text-text-primary">{formatDate(project.startDate)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-text-secondary font-medium uppercase tracking-widest">End Date</span>
                <span className="font-semibold text-text-primary">{formatDate(project.endDate) || "N/A"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-text-secondary font-medium uppercase tracking-widest">Total Business Days</span>
                <span className="font-semibold text-text-primary">
                  {(() => {
                    const days = calcBusinessDays(project.startDate, project.endDate);
                    return days !== null ? `${days} days` : "N/A";
                  })()}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-5 flex flex-col gap-5 bg-primary-light border-primary/20 shrink-0">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
              Time Tracking
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface p-3 rounded-md shadow-[0_2px_8px_rgb(0,0,0,0.04)] flex flex-col gap-1">
                <span className="text-xs text-text-secondary font-medium">Estimate</span>
                <span className="text-lg font-bold text-text-primary">{project.estimateHours}h</span>
              </div>
              <div className="bg-surface p-3 rounded-md shadow-[0_2px_8px_rgb(0,0,0,0.04)] flex flex-col gap-1">
                <span className="text-xs text-text-secondary font-medium">Actual</span>
                <span className={`text-lg font-bold ${isOverrun ? "text-danger" : "text-primary"}`}>
                  {project.actualHours}h {isOverrun && "⚠️"}
                </span>
              </div>
              <div className="bg-surface p-3 rounded-md shadow-[0_2px_8px_rgb(0,0,0,0.04)] flex flex-col gap-1 col-span-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-text-secondary font-medium">Remaining</span>
                  <span className="text-sm font-bold text-text-primary">{project.remainingHours}h</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 mt-1">
                    <ProgressBar percentage={project.progressPercentage} isOverrun={isOverrun} />
                  </div>
                  <span className={`text-xs font-bold ${isOverrun ? "text-danger" : "text-primary"}`}>
                    {project.progressPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* MAIN TABS AREA */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Card className="flex flex-col flex-1 overflow-hidden h-full shadow-sm border-none">
            <div className="flex items-center gap-2 p-2 bg-page-bg shrink-0 rounded-t-xl mb-2 relative">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="hidden lg:flex p-2 mr-2 bg-surface text-text-secondary hover:text-primary rounded-md shadow-sm transition-colors"
                title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
              >
                {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
              </button>
          <button 
            onClick={() => setActiveTab("gantt")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "gantt" ? "bg-surface shadow-sm text-primary" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Tasks - Gantt
          </button>
          <button 
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "tasks" ? "bg-surface shadow-sm text-primary" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <LayoutList className="w-4 h-4" />
            Tasks
          </button>
          <button 
            onClick={() => setActiveTab("resources")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "resources" ? "bg-surface shadow-sm text-primary" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Users className="w-4 h-4" />
            Resources
          </button>
          <button 
            onClick={() => setActiveTab("stakeholders")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "stakeholders" ? "bg-surface shadow-sm text-primary" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Share2 className="w-4 h-4" />
            Stakeholders
          </button>
        </div>

        <div className="flex-1 overflow-auto p-0 relative">
          {activeTab === "resources" && (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4">
                <h4 className="font-semibold text-text-primary">Assigned Resources ({projectUsers.length})</h4>
                <button 
                  onClick={() => setIsAddResourceOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-surface shadow-sm rounded-md text-xs font-medium text-text-primary hover:shadow-md transition-shadow"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Resource
                </button>
              </div>
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-page-bg text-text-secondary text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium">Skills</th>
                    <th className="px-6 py-3 font-medium text-right">Status</th>
                    <th className="px-4 py-3 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {projectUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-page-bg/40 transition-colors group">
                      <td className="p-3 align-middle">
                        <div className="flex items-center gap-3">
                          <UserAvatar user={user} size="md" />
                          <span className="font-semibold text-text-primary text-sm group-hover:text-primary transition-colors cursor-pointer" onClick={() => router.push(`/team/${user.id}`)}>{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-text-secondary">
                        <span className="font-semibold text-text-primary mr-1">{user.projectRole}</span>
                        <span className="text-xs text-text-secondary/70">({user.role})</span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                          {user.skills.map(skill => (
                            <SkillTag key={skill} skill={skill} />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-right"><StatusBadge status={user.status} /></td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          onClick={() => {
                            removeResourceFromProject(project.id, user.id);
                            addToast("success", `Removed ${user.name} from project.`);
                            logActivity(`Removed ${user.name} from project ${project.name}`);
                          }}
                          className="text-text-secondary hover:text-danger hover:bg-danger/10 p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100"
                          title="Remove from project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4">
                <h4 className="font-semibold text-text-primary">Project Tasks ({projectTasks.length})</h4>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsCreateTaskOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] rounded-md text-xs font-medium text-text-primary hover:bg-page-bg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create Task
                  </button>
                  <button 
                    onClick={() => router.push(`/tasks?project=${project.id}`)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary text-surface rounded-md text-xs font-medium hover:bg-primary/90 transition-colors"
                  >
                    Go to Kanban Board <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-page-bg/50 text-text-secondary text-xs uppercase">
                      <th className="px-6 py-3 font-medium">Task Name</th>
                      <th className="px-6 py-3 font-medium">One Desk #</th>
                      <th className="px-6 py-3 font-medium">Resource</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Priority</th>
                      <th className="px-6 py-3 font-medium">Est / Act</th>
                      <th className="px-6 py-3 font-medium min-w-[200px]">Start - Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {projectTasks.map((task) => {
                      const assignee = users.find(u => u.id === task.assigneeId);
                      return (
                      <tr key={task.id} className="transition-colors hover:bg-page-bg/50 group cursor-pointer" onClick={() => router.push(`/tasks/${task.id}`)}>
                        <td className="px-6 py-4 font-medium text-text-primary hover:text-primary group-hover:text-primary transition-colors">{task.title}</td>
                        <td className="px-6 py-4 text-text-secondary font-medium">
                          {task.oneDeskId || <span className="opacity-50">—</span>}
                        </td>
                        <td className="px-6 py-4">
                          {assignee ? (
                            <div className="flex items-center gap-2">
                              <UserAvatar user={assignee} size="sm" />
                              <span className="text-sm text-text-primary font-medium truncate max-w-[120px]">{assignee.name}</span>
                            </div>
                          ) : (
                            <span className="text-text-secondary text-sm italic">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
                        <td className="px-6 py-4 text-text-secondary">{task.priority}</td>
                        <td className="px-6 py-4 text-text-secondary">
                          <span className="font-medium text-text-primary">{task.estimateHours}h</span> / {task.actualHours}h
                        </td>
                        <td className="px-6 py-4">
                          <DateProgressBar startDate={task.startDate} dueDate={task.dueDate} showBothDates={true} />
                        </td>
                      </tr>
                      );
                    })}
                    {projectTasks.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-text-secondary italic">No tasks added to this project yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "gantt" && (() => {
            if (projectTasks.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center p-12 h-[300px] text-text-secondary italic">
                  No tasks available to build Gantt chart.
                </div>
              );
            }

            const flatTasks: (typeof projectTasks[0] & { depth: number, isExpanded: boolean, hasChildren: boolean })[] = [];
            const roots = projectTasks.filter(t => !t.parentId || !projectTasks.find(p => p.id === t.parentId));
            
            const traverse = (tasks: typeof projectTasks, depth: number) => {
              tasks.forEach(task => {
                const children = projectTasks.filter(t => t.parentId === task.id);
                const hasChildren = children.length > 0;
                const isExpanded = ganttExpandedTasks.has(task.id);
                flatTasks.push({ ...task, depth, isExpanded, hasChildren });
                if (isExpanded && hasChildren) {
                  traverse(children, depth + 1);
                }
              });
            };
            traverse(roots, 0);
            
            let minD = new Date(projectTasks[0].startDate).getTime();
            let maxD = new Date(projectTasks[0].dueDate || projectTasks[0].startDate).getTime();
            projectTasks.forEach(t => {
              const start = new Date(t.startDate).getTime();
              const end = new Date(t.dueDate || t.startDate).getTime();
              if (start && !isNaN(start)) minD = Math.min(minD, start);
              if (end && !isNaN(end)) maxD = Math.max(maxD, end);
            });
            // Pad 2 days
            minD -= 2 * 24 * 60 * 60 * 1000;
            maxD += 2 * 24 * 60 * 60 * 1000;
            
            const ganttStart = new Date(minD);
            const days = Math.max(1, Math.ceil((maxD - minD) / (24 * 60 * 60 * 1000)));
            const dayWidth = 22;

            return (
              <div className="flex flex-col bg-surface">
                <div className="flex justify-between items-center p-4 border-b border-border-color shrink-0">
                  <h4 className="font-semibold text-text-primary flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-primary" />
                    Treeview Gantt ({projectTasks.length} Tasks)
                  </h4>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsCreateTaskOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-surface rounded-md text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> Create Task
                    </button>
                    <div className="w-px h-5 bg-border-color/50 mx-1"></div>
                    <button 
                      onClick={() => setGanttExpandedTasks(new Set(projectTasks.map(t => t.id)))}
                      className="px-2.5 py-1 text-[11px] font-medium text-primary bg-primary/10 rounded hover:bg-primary/20 transition-colors"
                    >
                      Expand All
                    </button>
                    <button 
                      onClick={() => setGanttExpandedTasks(new Set())}
                      className="px-2.5 py-1 text-[11px] font-medium text-text-secondary bg-page-bg rounded hover:bg-black/5 transition-colors border border-border-color"
                    >
                      Collapse All
                    </button>
                  </div>
                </div>
                <div className="flex overflow-auto relative items-start">
                  {/* Left Sidebar Table */}
                  <div className="w-[520px] shrink-0 border-r border-border-color bg-surface sticky left-0 z-20 flex flex-col shadow-[2px_0_10px_rgba(0,0,0,0.02)]" style={{ height: 40 + flatTasks.length * 40 }}>
                    <div className="h-10 shrink-0 border-b border-border-color flex items-center px-4 font-bold text-[11px] text-text-secondary bg-page-bg uppercase tracking-wider sticky top-0 z-30">
                      <div className="w-[230px] shrink-0">Task Name</div>
                      <div className="w-[90px] shrink-0">Status</div>
                      <div className="w-[60px] shrink-0">Start</div>
                      <div className="w-[60px] shrink-0">End</div>
                      <div className="w-[40px] shrink-0 text-center">Edit</div>
                    </div>
                    <div className="flex flex-col flex-1">
                      {flatTasks.map(t => (
                        <div key={t.id} className={`h-10 shrink-0 border-b border-border-color flex items-center px-4 hover:bg-page-bg/50 transition-colors ${t.depth === 0 ? 'bg-page-bg/20' : ''}`}>
                          <div className="w-[230px] shrink-0 flex items-center pr-2" style={{ paddingLeft: t.depth * 16 }}>
                            {t.hasChildren ? (
                              <button 
                                onClick={() => toggleGanttExpand(t.id)}
                                className="w-5 h-5 flex items-center justify-center shrink-0 text-text-secondary hover:text-primary transition-colors hover:bg-primary/10 rounded -ml-1 mr-1"
                              >
                                {t.isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                              </button>
                            ) : (
                              <span className="w-5 h-5 shrink-0 -ml-1 mr-1" />
                            )}
                            <span 
                              className={`text-[13px] truncate cursor-pointer hover:text-primary transition-colors hover:underline ${t.depth === 0 ? 'font-bold text-text-primary' : 'font-medium text-text-secondary'}`} 
                              title={t.title}
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/tasks/${t.id}`);
                              }}
                            >
                              {t.title}
                            </span>
                          </div>
                          <div className="w-[90px] shrink-0 pr-2">
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${t.status === 'Completed' ? 'bg-success/10 text-success' : t.status === 'In Progress' ? 'bg-primary/10 text-primary' : t.status === 'Pending' ? 'bg-warning/10 text-warning-dark' : 'bg-page-bg text-text-secondary border border-border-color' }`}>
                              {t.status}
                            </span>
                          </div>
                          <div className="w-[60px] shrink-0 text-[11px] text-text-secondary truncate pr-2">
                            {new Date(t.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                          <div className="w-[60px] shrink-0 text-[11px] text-text-secondary truncate">
                            {t.dueDate ? new Date(t.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A"}
                          </div>
                          <div className="w-[40px] shrink-0 flex justify-end">
                            <button 
                              onClick={() => {
                                setEditingTaskId(t.id);
                                setIsEditTaskModalOpen(true);
                              }}
                              className="text-text-secondary hover:text-primary p-1 rounded hover:bg-primary/10 transition-colors"
                              title="Edit Task"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Timeline */}
                  <div className="relative bg-page-bg/30 shrink-0 z-0 self-start" style={{ width: days * dayWidth }}>
                    <div className="flex h-10 shrink-0 border-b border-border-color bg-page-bg min-w-max sticky top-0 z-10">
                      {Array.from({ length: days }).map((_, i) => {
                         const d = new Date(ganttStart.getTime() + i * 24 * 60 * 60 * 1000);
                         const isFirst = d.getDate() === 1 || i === 0 || d.getDay() === 1; // Show on Mondays
                         const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                         return (
                           <div key={i} className={`flex-shrink-0 flex items-center justify-center border-r border-border-color/40 text-[10px] ${isWeekend ? 'bg-black/5 text-text-secondary font-medium' : 'text-text-secondary/70'}`} style={{ width: dayWidth }}>
                             {isFirst ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : d.getDate()}
                           </div>
                         );
                      })}
                    </div>
                    <div className="relative min-w-max" style={{ height: flatTasks.length * 40, width: days * dayWidth }}>
                      {/* Grid backgrounds */}
                      <div className="absolute inset-0 flex pointer-events-none">
                        {Array.from({ length: days }).map((_, i) => {
                           const d = new Date(ganttStart.getTime() + i * 24 * 60 * 60 * 1000);
                           const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                           return (
                             <div key={i} className={`flex-shrink-0 border-r border-border-color/30 h-full ${isWeekend ? 'bg-black/[0.02]' : ''}`} style={{ width: dayWidth }}></div>
                           );
                        })}
                      </div>
                      
                      {/* Bars */}
                      {flatTasks.map((t, index) => {
                        const startMs = new Date(t.startDate).getTime();
                        let endMs = new Date(t.dueDate || t.startDate).getTime();
                        if (isNaN(startMs)) return null;
                        if (isNaN(endMs)) endMs = startMs;
                        
                        const startOffset = Math.max(0, (startMs - ganttStart.getTime()) / (24 * 60 * 60 * 1000));
                        const duration = Math.max(1, ((endMs - startMs) / (24 * 60 * 60 * 1000)) + 1);
                        
                        let bgColor = "bg-primary";
                        if (t.status === "Completed") bgColor = "bg-success";
                        if (t.status === "Pending" || t.status === "On Hold") bgColor = "bg-warning";
                        if (t.status === "Closed") bgColor = "bg-slate-400";
                        if (t.status === "No Specs") bgColor = "bg-danger";
                        
                        const isPhase = t.hasChildren;
                        
                        return (
                          <div key={t.id} className="absolute h-10 flex items-center hover:bg-black/5 transition-colors" style={{ top: index * 40, left: 0, width: days * dayWidth }}>
                            {isPhase ? (
                              <div 
                                className="absolute h-[6px] bg-text-primary flex items-center opacity-80 rounded-sm"
                                style={{ left: startOffset * dayWidth, width: duration * dayWidth, minWidth: '4px' }}
                                title={`${t.title} (Phase)`}
                              >
                                {/* Triangle pointers for phases */}
                                <div className="absolute -left-[1px] -bottom-[5px] w-0 h-0 border-l-[5px] border-l-transparent border-t-[5px] border-t-text-primary border-r-[5px] border-r-transparent"></div>
                                <div className="absolute -right-[1px] -bottom-[5px] w-0 h-0 border-l-[5px] border-l-transparent border-t-[5px] border-t-text-primary border-r-[5px] border-r-transparent"></div>
                              </div>
                            ) : (
                              <div 
                                className={`absolute h-6 rounded-md shadow-sm ${bgColor} flex items-center justify-center opacity-80 hover:opacity-100 cursor-pointer overflow-hidden group transition-all`}
                                style={{ left: startOffset * dayWidth, width: duration * dayWidth, minWidth: '4px' }}
                                title={`${t.title} (${t.status})`}
                              >
                                {duration * dayWidth > 60 && (
                                  <span className={`text-[10px] font-semibold px-2 truncate opacity-90 ${bgColor === 'bg-warning' ? 'text-amber-950' : 'text-white'}`}>
                                    {t.estimateHours}h
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {activeTab === "stakeholders" && (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4">
                <h4 className="font-semibold text-text-primary">Project Stakeholders ({(project.stakeholders || []).length})</h4>
                <button 
                  onClick={() => setIsAddStakeholderOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-surface shadow-sm rounded-md text-xs font-medium text-text-primary hover:shadow-md transition-shadow"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Stakeholder
                </button>
              </div>
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-page-bg text-text-secondary text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Role / Type</th>
                    <th className="px-4 py-3 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {(!project.stakeholders || project.stakeholders.length === 0) && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-text-secondary italic">No stakeholders added.</td>
                    </tr>
                  )}
                  {(project.stakeholders || []).map((sh) => (
                    <tr key={sh.id} className="hover:bg-page-bg/40 transition-colors group">
                      <td className="p-3 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {sh.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-text-primary text-sm">{sh.name} {sh.isCustom && <span className="text-xs text-text-secondary font-normal italic ml-1">(External)</span>}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-page-bg text-text-secondary border border-border-color text-[11px] font-medium tracking-wide">
                          {getRoleIcon(sh.role)} {sh.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          onClick={() => {
                            removeStakeholder(project.id, sh.id);
                            addToast("success", `Removed ${sh.name} from stakeholders.`);
                            logActivity(`Removed stakeholder ${sh.name} from project ${project.name}`);
                          }}
                          className="text-text-secondary hover:text-danger hover:bg-danger/10 p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100"
                          title="Remove stakeholder"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
      </div>
      </div>

      {/* ADD RESOURCE MODAL */}
      {isAddResourceOpen && (
        <div className="fixed inset-0 bg-secondary/20 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-border-color">
            <div className="flex justify-between items-center p-4 bg-page-bg">
              <h3 className="font-bold text-lg text-text-primary">Add Resource to Project</h3>
              <button 
                onClick={() => {
                  setIsAddResourceOpen(false);
                  setSelectedUsers([]);
                }} 
                className="text-text-secondary hover:text-danger transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddResource} className="p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary mb-1">Select Team Members <span className="text-danger">*</span></label>
                
                <div className="relative mb-2">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary opacity-60" />
                  <input 
                    type="text" 
                    placeholder="Search by name, role or skill..." 
                    value={resourceSearchQuery}
                    onChange={e => setResourceSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-page-bg/50 border border-transparent rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-primary shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]"
                  />
                </div>
                
                <div className="flex flex-col gap-0.5 h-64 overflow-y-auto bg-transparent py-1.5 -mx-1 px-1">
                  {availableUsers.length === 0 && (
                    <p className="text-sm text-text-secondary text-center py-4">No available members to add.</p>
                  )}
                  {availableUsers
                    .filter(u => 
                      u.name.toLowerCase().includes(resourceSearchQuery.toLowerCase()) || 
                      u.role.toLowerCase().includes(resourceSearchQuery.toLowerCase()) || 
                      u.skills.some(s => s.toLowerCase().includes(resourceSearchQuery.toLowerCase()))
                    )
                    .map(u => {
                    const isSelected = selectedUsers.includes(u.id);
                    return (
                      <div 
                        key={u.id}
                        onClick={() => toggleUser(u.id)}
                        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                          isSelected ? "bg-primary/5 text-primary font-medium" : "hover:bg-page-bg/80 text-text-primary"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? "bg-primary border-primary" : "border-border-color/60 bg-surface/80 shadow-[inset_0_1px_2px_rgb(0,0,0,0.03)]"
                        }`}>
                          {isSelected && <svg className="w-3 h-3 text-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <UserAvatar user={u} size="sm" />
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="truncate">{u.name}</span>
                          <span className="text-[11px] font-normal text-text-secondary truncate">{u.role}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <p className="text-xs text-text-secondary mt-1">
                  {selectedUsers.length === 0 
                    ? `Select at least one member to invite to ${project.name}.` 
                    : `${selectedUsers.length} member(s) selected.`}
                </p>
                <div className="flex flex-col gap-1 mt-4 pt-4 border-t border-border-color/30">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Project Role</label>
                  <select 
                    value={selectedResourceRole}
                    onChange={(e) => setSelectedResourceRole(e.target.value)}
                    className="w-full px-3 py-2 bg-surface/50 border border-transparent hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none text-text-primary shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]"
                  >
                    <option value="Member">Member</option>
                    <option value="PM">Project Manager (PM)</option>
                    <option value="BA">Business Analyst (BA)</option>
                    <option value="Frontend">Frontend Developer</option>
                    <option value="Backend">Backend Developer</option>
                    <option value="Fullstack">Fullstack Developer</option>
                    <option value="QC">Quality Control (QC)</option>
                    <option value="QA">Quality Assurance (QA)</option>
                    <option value="DevOps">DevOps Engineer</option>
                    <option value="Design">Designer / UI/UX</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsAddResourceOpen(false);
                    setSelectedUsers([]);
                    setResourceSearchQuery("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={selectedUsers.length === 0}
                  className="px-4 py-2 bg-primary text-surface rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Resources
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROJECT MODAL */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Project" className="max-w-2xl">
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Project Name *</label>
            <input 
              type="text" required value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})}
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
                onChange={(val: any) => setEditForm({...editForm, status: val})}
                options={[
                  { value: "Active", label: "Active" },
                  { value: "On Hold", label: "On Hold" },
                  { value: "Completed", label: "Completed" }
                ]}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Estimate Source</label>
              <CustomSelect 
                value={editForm.estimateSource} 
                onChange={(val: any) => setEditForm({...editForm, estimateSource: val})}
                options={[
                  { value: "TASK", label: "Rollup from Tasks" },
                  { value: "RESOURCE", label: "Assigned Resources" }
                ]}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Estimate Hours (Base)</label>
            <input 
              type="number" step="1" min="0" required value={editForm.estimateHours} onChange={e => setEditForm({...editForm, estimateHours: Number(e.target.value)})}
              className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Avatar URL <span className="text-text-secondary font-normal">(optional)</span></label>
            <input 
              type="url" value={editForm.avatarUrl} onChange={e => setEditForm({...editForm, avatarUrl: e.target.value})} placeholder="https://example.com/logo.png"
              className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-sm font-medium text-text-primary">Stakeholders <span className="text-text-secondary font-normal">(optional)</span></label>
            <div className="flex flex-col gap-2">
              {editForm.stakeholders.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between bg-surface/50 px-3 py-2 rounded-md shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]">
                  <div className="flex items-center gap-2">
                     <Building2 className="w-4 h-4 text-primary/70" />
                     <span className="text-sm font-medium text-text-primary">{s.name}</span>
                     <span className="text-[10px] bg-primary/10 px-1.5 py-0.5 rounded text-primary font-medium uppercase tracking-wider">{s.role}</span>
                  </div>
                  <button type="button" onClick={() => setEditForm({...editForm, stakeholders: editForm.stakeholders.filter((_, i) => i !== idx)})} className="text-text-secondary hover:text-danger hover:bg-danger/10 p-1 rounded transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2 mt-1 relative">
                <div className="flex-1">
                  <CustomSelect 
                    value={newEditStakeholderId} 
                    onChange={setNewEditStakeholderId}
                    options={[
                      { value: "", label: "Select User..." },
                      ...users.filter(u => !editForm.stakeholders.find(s => s.id === u.id)).map(u => ({ value: u.id, label: u.name }))
                    ]}
                  />
                </div>
                <div className="w-[140px]">
                  <CustomSelect 
                    value={newEditStakeholderRole} 
                    onChange={setNewEditStakeholderRole}
                    options={[
                      { value: "Client", label: "Client" },
                      { value: "Sponsor", label: "Sponsor" },
                      { value: "Partner", label: "Partner" },
                      { value: "Business Owner", label: "Business Owner" }
                    ]}
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => {
                     if (!newEditStakeholderId) return;
                     const u = users.find(u => u.id === newEditStakeholderId);
                     if (u) {
                       setEditForm({...editForm, stakeholders: [...editForm.stakeholders, { id: u.id, name: u.name, role: newEditStakeholderRole, isCustom: false }]});
                       setNewEditStakeholderId("");
                     }
                  }}
                  disabled={!newEditStakeholderId}
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-md text-sm font-medium hover:bg-primary/20 transition-colors whitespace-nowrap disabled:opacity-50 h-[38px] flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">One Desk #</label>
            <input 
              type="text" value={editForm.oneDeskId} onChange={e => setEditForm({...editForm, oneDeskId: e.target.value})}
              className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary h-[38px]"
              placeholder="E.g. OND-1234"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Companies</label>
            <div className="relative">
              <CustomSelect 
                value=""
                onChange={(val: any) => {
                  if (val && !editForm.companyIds?.includes(val)) {
                    setEditForm({...editForm, companyIds: [...(editForm.companyIds || []), val]});
                  }
                }}
                options={[
                  { value: "", label: "Select Company..." },
                  ...companies.filter(c => !(editForm.companyIds || []).includes(c.id)).map(c => ({ value: c.id, label: c.name }))
                ]}
              />
            </div>
          </div>
          
          {(editForm.companyIds?.length || 0) > 0 && (
            <div className="flex flex-wrap gap-2 mt-[-8px]">
              {editForm.companyIds?.map(id => {
                const comp = companies.find(c => c.id === id);
                if (!comp) return null;
                return (
                  <div key={id} className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-md text-[13px] font-medium border border-primary/20">
                    <Building2 className="w-3.5 h-3.5" />
                    {comp.name}
                    <button type="button" onClick={() => setEditForm({...editForm, companyIds: editForm.companyIds!.filter(cId => cId !== id)})} className="hover:text-danger ml-1">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-sm font-medium text-text-primary">Applications</label>
            <ApplicationInput 
              applications={editForm.applications || []} 
              onChange={(apps: string[]) => setEditForm({ ...editForm, applications: apps })} 
            />
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-sm font-medium text-text-primary flex items-center justify-between">
              <span>Spec Files <span className="text-text-secondary font-normal">(optional)</span></span>
              <label className="cursor-pointer text-primary hover:text-primary/80 flex items-center gap-1 text-xs font-semibold">
                <Paperclip className="w-3.5 h-3.5" /> Attach Files
                <input 
                  type="file" multiple className="hidden" 
                  onChange={(e) => {
                    if (e.target.files) {
                      const newFiles = Array.from(e.target.files).map(f => ({ name: f.name, url: URL.createObjectURL(f), size: f.size }));
                      setEditForm({...editForm, specFiles: [...(editForm.specFiles || []), ...newFiles]});
                    }
                  }} 
                />
              </label>
            </label>
            {(editForm.specFiles?.length || 0) > 0 && (
              <div className="flex flex-col gap-2 mt-1">
                {editForm.specFiles?.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-surface/50 px-3 py-2.5 rounded-md shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] border border-transparent">
                    <div className="flex items-center gap-3 overflow-hidden">
                       <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                         <FileText className="w-4 h-4 text-primary" />
                       </div>
                       <div className="flex flex-col truncate">
                         <a href={file.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-text-primary hover:text-primary hover:underline truncate">{file.name}</a>
                         <span className="text-[11px] text-text-secondary">{file.size ? (file.size / 1024).toFixed(1) + ' KB' : 'Unknown size'}</span>
                       </div>
                    </div>
                    <button type="button" onClick={() => setEditForm({...editForm, specFiles: editForm.specFiles!.filter((_, i) => i !== idx)})} className="text-text-secondary hover:text-danger hover:bg-danger/10 p-1.5 rounded transition-colors shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {(editForm.specFiles?.length || 0) === 0 && (
              <div className="border border-dashed border-border-color/30 rounded-lg p-6 flex flex-col items-center justify-center text-text-secondary bg-page-bg/30">
                <Paperclip className="w-8 h-8 opacity-40 mb-2" />
                <p className="text-sm text-text-primary font-medium">No files attached</p>
                <p className="text-xs text-text-secondary">Click 'Attach Files' to upload specs</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Theme Color</label>
            <div className="flex flex-wrap gap-2">
              {THEME_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setEditForm({...editForm, themeColor: color})}
                  className={`w-6 h-6 rounded-full transition-all ${editForm.themeColor === color ? 'ring-2 ring-offset-2 ring-primary scale-110 shadow-sm' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Start Date</label>
              <input 
                type="date" required value={editForm.startDate} onChange={e => setEditForm({...editForm, startDate: e.target.value})}
                className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">End Date</label>
              <input 
                type="date" value={editForm.endDate} onChange={e => setEditForm({...editForm, endDate: e.target.value})}
                className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-page-bg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-surface hover:bg-primary/90 transition-colors">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* ADD STAKEHOLDER MODAL */}
      <Modal isOpen={isAddStakeholderOpen} onClose={() => {
        setIsAddStakeholderOpen(false);
        setStakeholderForm({ name: "", role: "Client", isCustom: true, id: "" });
        setStakeholderSearchQuery("");
      }} title="Add Stakeholder" className="max-w-xl" contentClassName="overflow-visible">
        <form onSubmit={handleAddStakeholder} className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-text-primary">Search System Member or type Custom Name *</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary opacity-60" />
              <input 
                type="text" 
                placeholder="Name of Stakeholder..." 
                value={stakeholderSearchQuery}
                required={stakeholderForm.isCustom && !stakeholderForm.name}
                onChange={e => {
                  setStakeholderSearchQuery(e.target.value);
                  setStakeholderForm({...stakeholderForm, name: e.target.value, isCustom: true, id: ""});
                }}
                className="w-full pl-9 pr-3 py-2 bg-surface/50 border border-transparent hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm text-text-primary shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]"
              />
            
              {stakeholderSearchQuery && stakeholderForm.isCustom && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-50 flex flex-col gap-1 max-h-48 overflow-y-auto bg-surface/95 backdrop-blur-xl p-1.5 rounded-xl border border-primary/10 shadow-[0_12px_40px_rgb(0,0,0,0.08)] animate-in fade-in slide-in-from-top-2 duration-200">
                  {availableUsersForStakeholders
                    .filter(u => u.name.toLowerCase().includes(stakeholderSearchQuery.toLowerCase()))
                    .slice(0, 5)
                    .map(u => (
                      <div 
                        key={u.id}
                        onClick={() => {
                          setStakeholderSearchQuery(u.name);
                          setStakeholderForm({...stakeholderForm, name: u.name, isCustom: false, id: u.id});
                        }}
                        className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-page-bg text-text-primary transition-colors text-sm"
                      >
                        <UserAvatar user={u} size="sm" />
                        <span>{u.name} <span className="text-xs text-text-secondary ml-1">({u.role})</span></span>
                      </div>
                    ))}
                </div>
              )}
            </div>
            
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-sm font-medium text-text-primary">Stakeholder Role / Type</label>
            <CustomSelect 
              value={stakeholderForm.role} 
              onChange={(val: any) => setStakeholderForm({...stakeholderForm, role: val})}
              options={[
                { value: "Client", label: "Client" },
                { value: "Sponsor", label: "Sponsor" },
                { value: "Business Owner", label: "Business Owner" },
                { value: "Vendor", label: "Vendor" },
                { value: "IT Service", label: "IT Service" },
                { value: "Partner", label: "Partner" },
                { value: "Other", label: "Other" }
              ]}
            />
          </div>

          {/* Message Area - Always present to prevent layout jumps */}
          <div className="min-h-[58px] flex items-center">
            {stakeholderForm.isCustom && stakeholderSearchQuery ? (
              <div className="bg-primary/5 text-primary text-xs p-3 rounded-md border border-primary/10 flex items-start gap-2 w-full shadow-sm transition-all">
                <Share2 className="w-4 h-4 shrink-0 mt-0.5" />
                <p>You are adding <b>{stakeholderForm.name}</b> as an <b>External Stakeholder</b>. They will not have login access.</p>
              </div>
            ) : !stakeholderForm.isCustom && stakeholderForm.name ? (
              <div className="bg-success/5 text-success text-xs p-3 rounded-md border border-success/20 flex items-start gap-2 w-full shadow-sm transition-all">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <p>You selected <b>{stakeholderForm.name}</b>, an existing system member.</p>
              </div>
            ) : (
              <div className="bg-primary/5 text-primary text-xs p-3 rounded-md border border-primary/10 flex items-start gap-2 w-full shadow-sm transition-all">
                <Info className="w-4 h-4 shrink-0 mt-0.5 opacity-80" />
                <p>Type a name for an external stakeholder, or select from the dropdown.</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button type="button" onClick={() => {
              setIsAddStakeholderOpen(false);
              setStakeholderForm({ name: "", role: "Client", isCustom: true, id: "" });
              setStakeholderSearchQuery("");
            }} className="px-4 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-page-bg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={!stakeholderForm.name.trim()} className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-surface hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50">
              Add Stakeholder
            </button>
          </div>
        </form>
      </Modal>

      {/* CREATE TASK MODAL */}
      <CreateTaskModal 
        isOpen={isCreateTaskOpen} 
        onClose={() => setIsCreateTaskOpen(false)} 
        defaultProjectId={project.id} 
      />

      {/* EDIT TASK MODAL */}
      {editingTaskId && (
        <Modal 
          isOpen={isEditTaskModalOpen} 
          onClose={() => {
            setIsEditTaskModalOpen(false);
            setEditingTaskId(null);
          }} 
          title={`Edit Task: ${taskEditForm.title}`}
          className="max-w-2xl"
        >
          <form onSubmit={(e) => {
            e.preventDefault();
            const { updateTask } = useStore.getState();
            updateTask(editingTaskId, {
              ...tasks.find(t => t.id === editingTaskId),
              ...taskEditForm
            });
            addToast("success", `Task "${taskEditForm.title}" updated`);
            logActivity(`Updated task: ${taskEditForm.title}`);
            setIsEditTaskModalOpen(false);
            setEditingTaskId(null);
          }} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Task Title *</label>
              <input 
                type="text" required value={taskEditForm.title} 
                onChange={e => setTaskEditForm({...taskEditForm, title: e.target.value})}
                className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm text-text-primary"
                placeholder="Task title"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Description</label>
              <textarea 
                rows={3} value={taskEditForm.description} 
                onChange={e => setTaskEditForm({...taskEditForm, description: e.target.value})}
                className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm text-text-primary resize-none"
                placeholder="Task description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Status</label>
                <CustomSelect 
                  value={taskEditForm.status}
                  onChange={(val: any) => setTaskEditForm({...taskEditForm, status: val})}
                  options={[
                    { value: "To Do", label: "To Do" },
                    { value: "In Progress", label: "In Progress" },
                    { value: "Pending", label: "Pending" },
                    { value: "On Hold", label: "On Hold" },
                    { value: "No Specs", label: "No Specs" },
                    { value: "Completed", label: "Completed" },
                    { value: "Closed", label: "Closed" }
                  ]}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Priority</label>
                <CustomSelect 
                  value={taskEditForm.priority}
                  onChange={(val: any) => setTaskEditForm({...taskEditForm, priority: val})}
                  options={[
                    { value: "Critical", label: "Critical" },
                    { value: "High", label: "High" },
                    { value: "Medium", label: "Medium" },
                    { value: "Low", label: "Low" }
                  ]}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Assignee</label>
                <CustomSelect 
                  value={taskEditForm.assigneeId}
                  onChange={(val: any) => setTaskEditForm({...taskEditForm, assigneeId: val})}
                  options={[
                    { value: "", label: "Unassigned" },
                    ...users.map(u => ({ value: u.id, label: u.name }))
                  ]}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Estimate (Hours)</label>
                <input 
                  type="number" min="0" value={taskEditForm.estimateHours}
                  onChange={e => setTaskEditForm({...taskEditForm, estimateHours: Number(e.target.value)})}
                  className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm text-text-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Due Date</label>
                <input 
                  type="date" value={taskEditForm.dueDate}
                  onChange={e => setTaskEditForm({...taskEditForm, dueDate: e.target.value})}
                  className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm text-text-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">One Desk #</label>
                <input 
                  type="text" value={taskEditForm.oneDeskId}
                  onChange={e => setTaskEditForm({...taskEditForm, oneDeskId: e.target.value})}
                  className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm text-text-primary"
                  placeholder="E.g. OND-1234"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border-color">
              <button 
                type="button" 
                onClick={() => {
                  setIsEditTaskModalOpen(false);
                  setEditingTaskId(null);
                }}
                className="px-4 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-page-bg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-surface hover:bg-primary/90 transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
