"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { SkillInput } from "@/components/ui/SkillInput";
import { SkillTag } from "@/components/ui/SkillTag";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useStore } from "@/store/useStore";
import { THEME_COLORS } from "@/lib/mockData";
import { Search, Plus, Users as UsersIcon, LayoutList, LayoutGrid, Briefcase, CheckCircle2 } from "lucide-react";
import { User, UserRole } from "@/types";

export default function TeamList() {
  const router = useRouter();
  const { users, projects, tasks, addUser, logActivity, addToast } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "card">("card");

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("Normal User");
  const [skills, setSkills] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [skillFilter, setSkillFilter] = useState("All");

  const allSkills = Array.from(new Set(users.flatMap(u => u.skills))).sort();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newUser: User = {
      id: `u-${Date.now()}`,
      name,
      email,
      role,
      skills: skills.length > 0 ? skills : ["Newbie"],
      status: "Available",
      notes: notes.trim(),
      themeColor: THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)],
    };

    addUser(newUser);
    logActivity(`Added new team member: ${name}`);
    addToast("success", `User "${name}" added successfully`);
    
    // Reset and close
    setName(""); setEmail(""); setRole("Normal User"); setSkills([]); setNotes("");
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    const matchesStatus = statusFilter === "All" || u.status === statusFilter;
    const matchesSkill = skillFilter === "All" || u.skills.includes(skillFilter);
    return matchesSearch && matchesRole && matchesStatus && matchesSkill;
  });

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <div className="flex justify-between items-center shrink-0 mb-2">
        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <UsersIcon className="w-6 h-6 text-primary" />
          Team (Admin Access)
        </h2>
        <button 
          data-testid="btn-open-create-user-modal"
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-surface px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create User
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col gap-3 shrink-0 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-surface shadow-sm rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow text-text-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <CustomSelect 
              value={roleFilter}
              onChange={(val: any) => setRoleFilter(val)}
              options={[
                { value: "All", label: "Role: All" },
                { value: "Admin", label: "Admin" },
                { value: "PM", label: "PM" },
                { value: "Normal User", label: "Normal User" }
              ]}
              className="w-32"
            />
            <CustomSelect 
              value={skillFilter}
              onChange={(val: any) => setSkillFilter(val)}
              options={[
                { value: "All", label: "Skill: All" },
                ...allSkills.map(skill => ({ value: skill, label: skill }))
              ]}
              className="w-32"
            />
          </div>
        </div>

        {/* FAST FILTER & VIEW TOGGLE ROW */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-text-secondary uppercase mr-2 shrink-0">Quick Filters:</span>
            <button 
              onClick={() => setStatusFilter("All")}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer ${statusFilter === "All" ? "bg-primary-light text-primary" : "text-text-secondary hover:bg-page-bg"}`}
            >All</button>
            <button 
              onClick={() => setStatusFilter("Available")}
              className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 transition-colors cursor-pointer ${statusFilter === "Available" ? "bg-success/20 text-success" : "text-text-secondary hover:bg-success/10 hover:text-success"}`}
            >
              <span className="w-2 h-2 rounded-full bg-success"></span> Available
            </button>
            <button 
              onClick={() => setStatusFilter("Busy")}
              className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 transition-colors cursor-pointer ${statusFilter === "Busy" ? "bg-warning/30 text-warning" : "text-text-secondary hover:bg-warning/20 hover:text-warning"}`}
            >
              <span className="w-2 h-2 rounded-full bg-warning"></span> Busy
            </button>
            <button 
              onClick={() => setStatusFilter("Overloaded")}
              className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 transition-colors cursor-pointer ${statusFilter === "Overloaded" ? "bg-danger/20 text-danger" : "text-text-secondary hover:bg-danger/10 hover:text-danger"}`}
            >
              <span className="w-2 h-2 rounded-full bg-danger"></span> Overloaded
            </button>
          </div>
          
          <div className="flex items-center bg-page-bg rounded-md p-1 shrink-0 ml-4 hidden sm:flex">
            <button 
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === "table" ? "bg-surface shadow-[0_1px_3px_rgb(0,0,0,0.02)] text-primary" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <LayoutList className="w-4 h-4" /> Table
            </button>
            <button 
              onClick={() => setViewMode("card")}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === "card" ? "bg-surface shadow-[0_1px_3px_rgb(0,0,0,0.02)] text-primary" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Cards
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      {viewMode === "table" ? (
        <Card className="flex flex-col flex-1 overflow-hidden min-h-[400px]">
          <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10 bg-page-bg text-text-secondary text-xs uppercase shadow-sm">
                <tr>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Skills</th>
                  <th className="px-6 py-3 font-medium text-center">Projects</th>
                  <th className="px-6 py-3 font-medium text-center">Active Tasks</th>
                  <th className="px-6 py-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id}
                    onClick={() => router.push(`/team/${user.id}`)}
                    className="hover:bg-page-bg/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 relative">
                        <UserAvatar user={user} size="md" />  <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-surface ${user.status === 'Available' ? 'bg-success' : user.status === 'Busy' ? 'bg-warning' : 'bg-danger'}`}></span>
                        <div className="flex flex-col">
                          <span className="font-medium text-text-primary">{user.name}</span>
                          <span className="text-xs text-text-secondary">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary font-medium">{user.role}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map(skill => (
                          <SkillTag key={skill} skill={skill} className="text-[13px]" />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-text-primary font-medium">
                      {projects.filter(p => p.userIds?.includes(user.id)).length}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[24px] px-1 h-6 rounded bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all text-text-primary font-medium text-sm">
                        {tasks.filter(t => t.assigneeId === user.id && t.status !== "Completed" && t.status !== "Closed").length}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <StatusBadge status={user.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 pb-6 w-full">
          {filteredUsers.map(user => {
            const Initials = user.name.substring(0, 2).toUpperCase();
            const activeTasksCount = tasks.filter(t => t.assigneeId === user.id && t.status !== "Completed" && t.status !== "Closed").length;
            const projectCount = projects.filter(p => p.userIds?.includes(user.id)).length;

            return (
              <div 
                key={user.id} 
                className="group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl cursor-pointer bg-surface/90 backdrop-blur-md flex flex-col w-full h-full isolate"
                style={{
                  boxShadow: `0 4px 20px -2px ${user.themeColor}15`,
                  borderColor: `${user.themeColor}30`,
                }}
                onClick={() => router.push(`/team/${user.id}`)}
              >
                {/* Top Theme Strip */}
                <div className="h-1 w-full shrink-0" style={{ background: `linear-gradient(90deg, ${user.themeColor}, ${user.themeColor}66)` }} />
                
                {/* Image Section */}
                <div className="relative overflow-hidden flex items-end justify-center w-full shrink-0" style={{ height: '13rem', background: `linear-gradient(to bottom, ${user.themeColor}10, transparent)` }}>
                  <div className="absolute inset-0 opacity-30 z-0 mix-blend-overlay" style={{ background: `radial-gradient(at 50% 0%, ${user.themeColor} 0%, transparent 70%)` }} />
                  
                  <div className="absolute inset-0 w-full h-full z-0 overflow-hidden" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)' }}>
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 will-change-transform" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center font-bold text-5xl group-hover:scale-110 transition-transform duration-300" style={{ color: user.themeColor }}>
                        {Initials}
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute top-2 right-2 scale-75 origin-top-right z-20 drop-shadow-md">
                    <StatusBadge status={user.status} />
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="relative z-10 px-4 pb-4 -mt-4 flex flex-col items-center flex-1 h-full w-full">
                  {user.role !== "Normal User" && (
                    <div className="flex items-center justify-center mb-1.5 w-full">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block backdrop-blur-md shadow-sm" 
                            style={{ backgroundColor: `${user.themeColor}15`, border: `1px solid ${user.themeColor}40`, color: user.themeColor }}>
                        {user.role}
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-[15px] font-bold leading-tight mb-0.5 truncate w-full text-center group-hover:text-primary transition-colors text-text-primary px-1">{user.name}</h3>
                  <p className="text-[11px] mb-3 truncate w-full text-center text-text-secondary px-1">{user.email}</p>
                  
                  <div className="flex flex-wrap justify-center gap-1 w-full px-1 mb-4 mt-auto">
                    {user.skills.slice(0, 2).map(skill => (
                      <SkillTag key={skill} skill={skill} className="text-[9px] px-1.5 py-0.5" />
                    ))}
                    {user.skills.length > 2 && (
                      <span className="text-[9px] px-1 py-0.5 bg-page-bg text-text-secondary rounded font-medium border border-border-color/50">
                        +{user.skills.length - 2}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center gap-5 pt-3 w-full border-t transition-colors" style={{ borderTopColor: `${user.themeColor}20` }}>
                    <div className="flex items-center gap-1.5 text-text-secondary hover:text-primary transition-colors" title="Projects">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold text-text-primary">{projectCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-text-secondary hover:text-primary transition-colors" title="Active Tasks">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold text-text-primary">{activeTasksCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New User">
        <form data-testid="create-user-form" onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Full Name <span className="text-danger">*</span></label>
            <input 
              type="text" required value={name} onChange={e => setName(e.target.value)}
              className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary"
              placeholder="E.g. Le Van D"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Email Address <span className="text-danger">*</span></label>
            <input 
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary"
              placeholder="vand@ezypm.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">System Role</label>
            <CustomSelect 
              value={role} 
              testId="user-role-select"
              onChange={(val: any) => setRole(val as UserRole)}
              options={[
                { value: "Admin", label: "Admin" },
                { value: "PM", label: "Project Manager (PM)" },
                { value: "Normal User", label: "Normal User" }
              ]}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Skills (Tags)</label>
            <SkillInput skills={skills} onChange={setSkills} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Additional Notes</label>
            <textarea 
              value={notes} onChange={e => setNotes(e.target.value)}
              className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:border-primary/30 text-text-primary min-h-[80px] resize-y"
              placeholder="Any additional information..."
            />
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-page-bg transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" data-testid="btn-submit-user" className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-surface hover:bg-primary/90 transition-colors cursor-pointer">
              Add User
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
