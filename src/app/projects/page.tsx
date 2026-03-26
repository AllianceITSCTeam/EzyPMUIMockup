"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useStore } from "@/store/useStore";
import { THEME_COLORS } from "@/lib/mockData";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Search, Filter, Calendar as CalendarIcon, PieChart, Users, Plus, LayoutGrid, List, AlignLeft, FolderKanban, X, Building2 } from "lucide-react";
import { EstimateSource, Project, ProjectStatus } from "@/types";

export default function ProjectsList() {
  const { projects, tasks, users, addProject, logActivity, addToast } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("Active");
  const [estSource, setEstSource] = useState<EstimateSource>("TASK");
  const [estHours, setEstHours] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState("");
  const [themeColor, setThemeColor] = useState(THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)]);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [stakeholders, setStakeholders] = useState<{id: string, name: string, role: string, isCustom: boolean}[]>([]);
  const [newStakeholderId, setNewStakeholderId] = useState("");
  const [newStakeholderRole, setNewStakeholderRole] = useState("Client");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProject: Project = {
      id: `p-${Date.now()}`,
      name,
      description,
      status: status,
      estimateSource: estSource,
      startDate: startDate || new Date().toISOString().split("T")[0],
      endDate: endDate || "2026-12-31", // default if empty
      estimateHours: Number(estHours) || 0,
      actualHours: 0,
      remainingHours: Number(estHours) || 0,
      progressPercentage: 0,
      resourceCount: 0,
      taskCount: 0,
      themeColor,
      avatarUrl: avatarUrl ? avatarUrl : undefined,
      stakeholders: stakeholders,
    };

    addProject(newProject);
    logActivity(`Created new project: ${name}`);
    addToast("success", `Project "${name}" created successfully`);
    
    // Reset and close
    setName(""); setDescription(""); setEstHours(""); setEndDate(""); setAvatarUrl("");
    setStatus("Active");
    setStakeholders([]); setNewStakeholderId("");
    setThemeColor(THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)]);
    setIsModalOpen(false);
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortOption) {
      case "Oldest":
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      case "Name A-Z":
        return a.name.localeCompare(b.name);
      case "Name Z-A":
        return b.name.localeCompare(a.name);
      case "Progress (High-Low)":
        return b.progressPercentage - a.progressPercentage;
      case "Progress (Low-High)":
        return a.progressPercentage - b.progressPercentage;
      case "Newest":
      default:
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    }
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <FolderKanban className="w-6 h-6 text-primary" />
          Projects
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-surface px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface shadow-sm rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow text-text-primary"
          />
        </div>
        <div className="flex items-center gap-3">
          <CustomSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "All", label: "Status: All" },
              { value: "Active", label: "Status: Active" },
              { value: "On Hold", label: "Status: On Hold" },
              { value: "Completed", label: "Status: Completed" }
            ]}
            className="w-[160px]"
          />
          <CustomSelect
            value={sortOption}
            onChange={setSortOption}
            options={[
              { value: "Newest", label: "Sort: Newest", icon: <AlignLeft className="w-4 h-4 text-text-secondary" /> },
              { value: "Oldest", label: "Sort: Oldest", icon: <AlignLeft className="w-4 h-4 text-text-secondary" /> },
              { value: "Name A-Z", label: "Sort: Name A-Z", icon: <AlignLeft className="w-4 h-4 text-text-secondary" /> },
              { value: "Name Z-A", label: "Sort: Name Z-A", icon: <AlignLeft className="w-4 h-4 text-text-secondary" /> },
              { value: "Progress (High-Low)", label: "Sort: Progress (High)", icon: <AlignLeft className="w-4 h-4 text-text-secondary" /> },
              { value: "Progress (Low-High)", label: "Sort: Progress (Low)", icon: <AlignLeft className="w-4 h-4 text-text-secondary" /> }
            ]}
            className="w-[180px]"
          />
        </div>
      </div>

      {/* PROJECT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {sortedProjects.map((project) => {
          const isOverrun = project.progressPercentage > 100;
          const currentProjectUserIds = project.userIds || users.slice(0, project.resourceCount || 3).map(u => u.id);
          const projectUsers = users.filter(u => currentProjectUserIds.includes(u.id));

          return (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card 
                className="p-5 flex flex-col gap-4 transition-colors cursor-pointer group h-full shadow-sm hover:shadow-md"
                style={{ borderTopColor: project.themeColor, borderTopWidth: "4px" }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 font-bold text-text-primary text-lg truncate">
                    {project.avatarUrl ? (
                      <img src={project.avatarUrl} alt={project.name} className="w-6 h-6 rounded object-contain p-0.5 shadow-sm shrink-0" style={{ backgroundColor: project.themeColor || '#1e293b' }} />
                    ) : (
                      <span className="shrink-0 leading-none">📁</span>
                    )}
                    <span className="truncate" title={project.name}>{project.name}</span>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-page-bg shadow-sm px-2 py-1 rounded text-text-secondary">
                      {project.estimateSource}
                    </span>
                    <StatusBadge status={project.status} />
                  </div>
                </div>
                
                <p className="text-sm text-text-secondary line-clamp-2">
                  {project.description}
                </p>

                <div className="text-[13px] font-medium text-text-secondary bg-page-bg px-3 py-1.5 rounded-md flex items-center gap-2 mt-4 inline-flex w-fit">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  {formatDate(project.startDate)} &rarr; {project.endDate ? formatDate(project.endDate) : "Ongoing"}
                </div>

                <div className="flex items-center gap-4 text-sm text-text-primary font-medium mt-2">
                  <div className="flex items-center gap-1">
                    {(() => {
                      const AVATAR_DISPLAY_LIMIT = 8;
                      const AVATAR_OVERLAP = false; // Set to true to stack avatars, false to show them side-by-side
                      
                      return (
                        <div className={`flex flex-wrap ${AVATAR_OVERLAP ? '-space-x-1.5' : 'gap-1'}`}>
                          {projectUsers.slice(0, AVATAR_DISPLAY_LIMIT).map((user, i) => (
                            <div 
                              key={user.id} 
                              title={user.name} 
                              className={`rounded-full bg-surface cursor-help transition-transform hover:scale-110 ${AVATAR_OVERLAP ? 'ring-2 ring-surface' : ''}`} 
                              style={AVATAR_OVERLAP ? { zIndex: AVATAR_DISPLAY_LIMIT - i } : undefined}
                            >
                              <UserAvatar user={user} size="sm" />
                            </div>
                          ))}
                          {projectUsers.length > AVATAR_DISPLAY_LIMIT && (
                            <div 
                              className={`w-7 h-7 rounded-full bg-page-bg border border-border-color flex items-center justify-center text-[10px] font-bold text-text-secondary ${AVATAR_OVERLAP ? 'ring-2 ring-surface z-0' : ''}`} 
                              title={`And ${projectUsers.length - AVATAR_DISPLAY_LIMIT} more`}
                            >
                              +{projectUsers.length - AVATAR_DISPLAY_LIMIT}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  <div className="flex items-center gap-1.5 bg-page-bg px-2.5 py-1 rounded ml-auto">
                    <AlignLeft className="w-4 h-4 text-text-secondary" />
                    <span>{tasks.filter(t => t.projectId === project.id).length} tasks</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <div className="text-xs text-text-secondary">
                      Est: <span className="font-semibold text-text-primary">{project.estimateHours}h</span>
                    </div>
                    <div className={`text-xs ${isOverrun ? "text-warning" : "text-text-secondary"}`}>
                      Act: <span className="font-semibold">{project.actualHours}h</span> {isOverrun && "⚠️"}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 mt-1">
                      <ProgressBar percentage={project.progressPercentage} isOverrun={isOverrun} />
                    </div>
                    <span className={`text-xs font-bold ${isOverrun ? "text-warning" : "text-text-primary"}`}>
                      {project.progressPercentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Project Name <span className="text-danger">*</span></label>
            <input 
              type="text" required value={name} onChange={e => setName(e.target.value)}
              className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary"
              placeholder="E.g. Website Revamp 2026"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Description</label>
            <textarea 
              rows={3} value={description} onChange={e => setDescription(e.target.value)}
              className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary resize-none"
              placeholder="Brief overview of the project"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Status</label>
              <CustomSelect 
                value={status} 
                onChange={(val: any) => setStatus(val as ProjectStatus)}
                options={[
                  { value: "Active", label: "Active" },
                  { value: "On Hold", label: "On Hold" },
                  { value: "Completed", label: "Completed" },
                  { value: "Cancelled", label: "Cancelled" },
                  { value: "Draft", label: "Draft" }
                ]}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Avatar URL <span className="text-text-secondary font-normal">(optional)</span></label>
              <input 
                type="url" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://example.com/logo.png"
                className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary h-[38px]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Estimate Type</label>
              <CustomSelect 
                value={estSource} 
                onChange={(val: any) => setEstSource(val as EstimateSource)}
                options={[
                  { value: "TASK", label: "Total by Tasks" },
                  { value: "RESOURCE", label: "Total by Resource" }
                ]}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Initial Estimate (Hours)</label>
              <input 
                type="number" min="0" value={estHours} onChange={e => setEstHours(e.target.value)}
                className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary"
                placeholder="E.g. 120"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Start Date *</label>
              <input 
                type="date" required value={startDate} onChange={e => setStartDate(e.target.value)}
                className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">End Date</label>
              <input 
                type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-sm font-medium text-text-primary">Stakeholders <span className="text-text-secondary font-normal">(optional)</span></label>
            <div className="flex flex-col gap-2">
              {stakeholders.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between bg-surface/50 px-3 py-2 rounded-md shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]">
                  <div className="flex items-center gap-2">
                     <Building2 className="w-4 h-4 text-primary/70" />
                     <span className="text-sm font-medium text-text-primary">{s.name}</span>
                     <span className="text-[10px] bg-primary/10 px-1.5 py-0.5 rounded text-primary font-medium uppercase tracking-wider">{s.role}</span>
                  </div>
                  <button type="button" onClick={() => setStakeholders(prev => prev.filter((_, i) => i !== idx))} className="text-text-secondary hover:text-danger hover:bg-danger/10 p-1 rounded transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2 mt-1 relative">
                <div className="flex-1">
                  <CustomSelect 
                    value={newStakeholderId} 
                    onChange={setNewStakeholderId}
                    options={[
                      { value: "", label: "Select User..." },
                      ...users.filter(u => !stakeholders.find(s => s.id === u.id)).map(u => ({ value: u.id, label: u.name }))
                    ]}
                  />
                </div>
                <div className="w-[140px]">
                  <CustomSelect 
                    value={newStakeholderRole} 
                    onChange={setNewStakeholderRole}
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
                     if (!newStakeholderId) return;
                     const u = users.find(u => u.id === newStakeholderId);
                     if (u) {
                       setStakeholders(prev => [...prev, { id: u.id, name: u.name, role: newStakeholderRole, isCustom: false }]);
                       setNewStakeholderId("");
                     }
                  }}
                  disabled={!newStakeholderId}
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-md text-sm font-medium hover:bg-primary/20 transition-colors whitespace-nowrap disabled:opacity-50 h-[38px] flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-sm font-medium text-text-primary">Theme Color</label>
            <div className="flex flex-wrap gap-2">
              {THEME_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setThemeColor(color)}
                  className={`w-6 h-6 rounded-full transition-all ${themeColor === color ? 'ring-2 ring-offset-2 ring-primary scale-110 shadow-sm' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-page-bg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-surface hover:bg-primary/90 transition-colors">
              Create Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
