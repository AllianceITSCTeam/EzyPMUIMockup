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
import { UserAvatar } from "@/components/ui/UserAvatar";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { SkillTag } from "@/components/ui/SkillTag";
import { formatDate } from "@/lib/utils";
import { ChevronRight, ArrowLeft, Pencil, Users, LayoutList, Share2, Plus, FileText, X, Search, Trash2, Building2, Landmark, Crown, Store, Headset, Handshake, Info } from "lucide-react";

export default function ProjectDetails() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;
  const { projects, users, tasks, addToast, logActivity, updateProject, addRecentLink, addStakeholder, removeStakeholder } = useStore();
  const [activeTab, setActiveTab] = useState<"resources" | "tasks" | "stakeholders">("resources");
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [resourceSearchQuery, setResourceSearchQuery] = useState("");
  
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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || "Active",
    estimateSource: project?.estimateSource || "TASK",
    startDate: project?.startDate || "",
    endDate: project?.endDate || "",
    estimateHours: project?.estimateHours || 0,
    themeColor: project?.themeColor || THEME_COLORS[0],
    avatarUrl: project?.avatarUrl || ""
  });

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
  const currentProjectUserIds = project.userIds || users.slice(0, project.resourceCount || 3).map(u => u.id);
  const projectUsers = users.filter(u => currentProjectUserIds.includes(u.id));
  const availableUsers = users.filter(u => !currentProjectUserIds.includes(u.id));

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUsers.length === 0) return;
    
    const addedNames = availableUsers
      .filter(u => selectedUsers.includes(u.id))
      .map(u => u.name)
      .join(", ");
      
    const newUserIds = [...currentProjectUserIds, ...selectedUsers];
    updateProject(project.id, { userIds: newUserIds, resourceCount: newUserIds.length });
      
    addToast("success", `Added ${addedNames} to project`);
    logActivity(`Added ${addedNames} to ${project.name}`);
    
    setIsAddResourceOpen(false);
    setSelectedUsers([]);
    setResourceSearchQuery("");
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
                avatarUrl: project.avatarUrl || ""
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
        {/* LEFT COLUMN - INFO */}
        <div className="flex-1 flex flex-col gap-6">
          <Card className="p-5 flex flex-col gap-4 shadow-sm border-none">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider pb-1">
              Project Information
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {project.description || "No description provided."}
            </p>
            <div className="flex items-center gap-6 mt-2 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-text-secondary font-medium uppercase tracking-widest">Start Date</span>
                <span className="font-semibold text-text-primary">{formatDate(project.startDate)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-text-secondary font-medium uppercase tracking-widest">End Date</span>
                <span className="font-semibold text-text-primary">{formatDate(project.endDate) || "N/A"}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN - STATS */}
        <div className="w-full lg:w-80 shrink-0">
          <Card className="p-5 flex flex-col gap-5 bg-primary-light border-primary/20">
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
      </div>

      {/* BOTTOM TABS */}
      <Card className="flex flex-col flex-1 overflow-hidden min-h-[400px] shadow-sm border-none">
        <div className="flex items-center gap-2 p-2 bg-page-bg shrink-0 rounded-t-xl mb-2">
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
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "tasks" ? "bg-surface shadow-sm text-primary" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <LayoutList className="w-4 h-4" />
            Tasks
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
                      <td className="px-6 py-3 text-text-secondary">{user.role}</td>
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
                            const newUserIds = currentProjectUserIds.filter(id => id !== user.id);
                            updateProject(project.id, { userIds: newUserIds, resourceCount: newUserIds.length });
                            
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
                <button 
                  onClick={() => router.push(`/tasks?project=${project.id}`)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary text-surface rounded-md text-xs font-medium hover:bg-primary/90 transition-colors"
                >
                  Go to Kanban Board <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-page-bg/50 text-text-secondary text-xs uppercase">
                      <th className="px-6 py-3 font-medium">Task Name</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Priority</th>
                      <th className="px-6 py-3 font-medium">Est / Act</th>
                      <th className="px-6 py-3 font-medium">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {projectTasks.map((task) => (
                      <tr key={task.id} className="transition-colors hover:bg-page-bg/50 group cursor-pointer" onClick={() => router.push(`/tasks/${task.id}`)}>
                        <td className="px-6 py-4 font-medium text-text-primary hover:text-primary group-hover:text-primary transition-colors">{task.title}</td>
                        <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
                        <td className="px-6 py-4 text-text-secondary">{task.priority}</td>
                        <td className="px-6 py-4 text-text-secondary">
                          <span className="font-medium text-text-primary">{task.estimateHours}h</span> / {task.actualHours}h
                        </td>
                        <td className="px-6 py-4">
                          <DateProgressBar startDate={task.startDate} dueDate={task.dueDate} />
                        </td>
                      </tr>
                    ))}
                    {projectTasks.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-text-secondary italic">No tasks added to this project yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
                
                <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto bg-transparent py-1.5 -mx-1 px-1">
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
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Project">
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
            </div>
            
            {stakeholderSearchQuery && stakeholderForm.isCustom && (
              <div className="flex flex-col gap-1 max-h-40 overflow-y-auto bg-page-bg/30 p-1 rounded-md border border-border-color/30">
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
                      className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-page-bg text-text-primary transition-colors text-sm"
                    >
                      <UserAvatar user={u} size="sm" />
                      <span>{u.name} <span className="text-xs text-text-secondary ml-1">({u.role})</span></span>
                    </div>
                  ))}
              </div>
            )}
            
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

          {stakeholderForm.isCustom && stakeholderSearchQuery && (
            <div className="bg-primary/5 text-primary text-xs p-3 rounded-md border border-primary/10 flex items-start gap-2">
              <Share2 className="w-4 h-4 shrink-0 mt-0.5" />
              <p>You are adding <b>{stakeholderForm.name}</b> as an <b>External Stakeholder</b>. They will not have login access to the system.</p>
            </div>
          )}

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
    </div>
  );
}
