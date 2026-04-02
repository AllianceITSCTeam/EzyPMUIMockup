"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { SkillInput } from "@/components/ui/SkillInput";
import { CreateTaskModal } from "@/components/ui/CreateTaskModal";
import { SkillTag } from "@/components/ui/SkillTag";
import { UserAvatar } from "@/components/ui/UserAvatar"; // Added this import
import { ChevronRight, ArrowLeft, Pencil, X, Plus } from "lucide-react";

export default function UserDetails() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;
  const { users, projects, tasks, updateUser, addToast, logActivity, addRecentLink } = useStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const user = users.find(u => u.id === userId);

  useEffect(() => {
    if (user) {
      addRecentLink({
        url: `/team/${user.id}`,
        name: user.name,
        iconType: 'member',
        avatarUrl: user.avatarUrl,
        themeColor: user.themeColor
      });
    }
  }, [user?.id]);
  const [editForm, setEditForm] = useState({ name: user?.name || "", phone: user?.phone || "", skills: user?.skills || [], notes: user?.notes || "" });

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-text-secondary">
        <p className="text-lg">User not found</p>
        <button onClick={() => router.push("/team")} className="text-primary hover:underline flex items-center gap-1 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Team
        </button>
      </div>
    );
  }

  // Calculate statistics
  const userTasks = tasks.filter(t => t.assigneeId === user.id);
  const doneTasks = userTasks.filter(t => t.status === "Completed" || t.status === "Closed");
  const activeTasks = userTasks.filter(t => t.status === "In Progress" || t.status === "Pending");
  const userProjects = projects.filter(p => userTasks.some(t => t.projectId === p.id));
  
  const totalEst = userTasks.reduce((acc, t) => acc + t.estimateHours, 0);
  const totalAct = userTasks.reduce((acc, t) => acc + t.actualHours, 0);
  
  // Fake on-time rate for demo
  const onTimeRate = userTasks.length > 0 ? 85 : 0;
  const overdueCount = activeTasks.filter(t => t.actualHours > t.estimateHours).length;

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    updateUser(user.id, editForm);
    addToast("success", "Profile updated successfully");
    logActivity(`Updated profile details for ${user.name}`);
    setIsEditOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full overflow-y-auto pb-10">
      {/* BREADCRUMB & HEADER */}
      <div className="flex flex-col gap-2 shrink-0">
        <div className="flex items-center gap-2 text-sm text-text-secondary font-medium">
          <Link href="/team" className="hover:text-primary transition-colors">Team</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-text-primary">{user.name}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-text-primary">{user.name}</h2>
            <StatusBadge status={user.status} />
          </div>
          <button 
            onClick={() => {
              setEditForm({ name: user.name, phone: user.phone || "", skills: user.skills || [], notes: user.notes || "" });
              setIsEditOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-surface shadow-sm rounded-md text-sm font-medium text-text-primary hover:shadow-md transition-shadow cursor-pointer"
          >
            <Pencil className="w-4 h-4" /> Edit Profile
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* INFO CARD */}
        <Card className="flex-1 p-6 flex flex-col gap-6">
          <div className="flex items-center gap-4 pb-2">
            <UserAvatar user={user} size="2xl" className="ring-4 ring-surface shadow-sm" />
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-text-primary">{user.name}</h3>
              <p className="text-text-secondary text-sm">{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider">Role</span>
              <span className="text-text-primary font-medium">{user.role}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider">Phone</span>
              <span className="text-text-primary font-medium">{user.phone || "—"}</span>
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider">Skills</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {user.skills.map(skill => (
                  <SkillTag key={skill} skill={skill} className="text-[14px]" />
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* STATS CARD */}
        <Card className="flex-[1.5] p-6 flex flex-col gap-5">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider pb-1">
            Performance Statistics
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface p-4 rounded-lg flex flex-col items-center gap-1 shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
              <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">Total Tasks</span>
              <span className="text-2xl font-bold text-text-primary">{userTasks.length}</span>
            </div>
            <div className="bg-surface p-4 rounded-lg flex flex-col items-center gap-1 shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
              <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">Done Tasks</span>
              <span className="text-2xl font-bold text-success">{doneTasks.length}</span>
            </div>
            <div className="bg-surface p-4 rounded-lg flex flex-col items-center gap-1 shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
              <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">On-Time Rate</span>
              <span className="text-2xl font-bold text-primary">{onTimeRate}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div className="bg-page-bg p-3 rounded-md flex flex-col items-center">
              <span className="text-[10px] text-text-secondary font-bold uppercase">Est. Hours</span>
              <span className="text-lg font-bold text-text-primary">{totalEst}h</span>
            </div>
            <div className="bg-page-bg p-3 rounded-md flex flex-col items-center">
              <span className="text-[10px] text-text-secondary font-bold uppercase">Act. Hours</span>
              <span className="text-lg font-bold text-text-primary">{totalAct}h</span>
            </div>
            <div className="bg-page-bg p-3 rounded-md flex flex-col items-center">
              <span className="text-[10px] text-text-secondary font-bold uppercase">Ratio (A/E)</span>
              <span className="text-lg font-bold text-primary">{(totalEst ? (totalAct / totalEst) : 0).toFixed(2)}x</span>
            </div>
            <div className="bg-danger/5 p-3 rounded-md flex flex-col items-center">
              <span className="text-[10px] text-danger font-bold uppercase">Overdue Tasks</span>
              <span className="text-lg font-bold text-danger">{overdueCount}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-6 mt-4">
        {/* PROJECTS */}
        <div>
          <h3 className="font-bold text-lg text-text-primary mb-3">Participating Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userProjects.map(project => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="p-4 flex items-center gap-3 hover:border-primary transition-colors cursor-pointer group">
                  {project.avatarUrl ? (
                    <img src={project.avatarUrl} alt={project.name} className="w-10 h-10 rounded-md object-contain p-1.5 shadow-sm shrink-0" style={{ backgroundColor: project.themeColor || '#1e293b' }} />
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-page-bg flex items-center justify-center text-xl shrink-0 shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] border border-transparent" style={{ borderBottomColor: project.themeColor, borderBottomWidth: "3px" }}>📁</div>
                  )}
                  <div className="flex flex-col truncate">
                    <span className="font-medium text-text-primary truncate group-hover:text-primary transition-colors">{project.name}</span>
                    <span className="text-xs text-text-secondary">{project.status}</span>
                  </div>
                </Card>
              </Link>
            ))}
            {userProjects.length === 0 && (
              <p className="text-sm text-text-secondary italic">Not assigned to any projects yet.</p>
            )}
          </div>
        </div>

        {/* ACTIVE TASKS */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg text-text-primary">Active Tasks</h3>
            <button 
              onClick={() => setIsCreateTaskOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border-color shadow-sm rounded-md text-xs font-medium text-text-primary hover:bg-page-bg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Create Task
            </button>
          </div>
          <Card className="overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-page-bg text-text-secondary text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 font-medium">Task Name</th>
                  <th className="px-6 py-3 font-medium">Project</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Estimate</th>
                  <th className="px-6 py-3 font-medium text-right">Actual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {activeTasks.map(task => {
                  const proj = projects.find(p => p.id === task.projectId);
                  return (
                    <tr key={task.id} className="hover:bg-page-bg/50 transition-colors cursor-pointer group" onClick={() => router.push(`/tasks/${task.id}`)}>
                      <td className="px-6 py-4 font-medium text-text-primary group-hover:text-primary transition-colors">{task.title}</td>
                      <td className="px-6 py-4 text-text-secondary">{proj?.name || "N/A"}</td>
                      <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
                      <td className="px-6 py-4 text-right text-text-secondary">{task.estimateHours}h</td>
                      <td className="px-6 py-4 text-right font-medium text-text-primary">{task.actualHours}h</td>
                    </tr>
                  )
                })}
                {activeTasks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-text-secondary">No active tasks at the moment.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-secondary/20 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-border-color">
            <div className="flex justify-between items-center p-4 border-b border-border-color bg-page-bg">
              <h3 className="font-bold text-lg text-text-primary">Edit Profile</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-text-secondary hover:text-danger transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Full Name</label>
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  required
                  className="w-full px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Phone Number</label>
                <input 
                  type="text" 
                  value={editForm.phone}
                  onChange={e => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5 opacity-60">
                <label className="text-sm font-medium text-text-primary">Role (Read-only)</label>
                <input 
                  type="text" 
                  value={user.role}
                  readOnly
                  className="w-full px-3 py-2 bg-text-secondary/10 border border-border-color rounded-md text-sm cursor-not-allowed text-text-secondary"
                />
                <p className="text-xs text-text-secondary mt-1">To change roles, contact an Administrator.</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Skills (Tags)</label>
                <SkillInput 
                  skills={editForm.skills} 
                  onChange={(newSkills) => setEditForm({...editForm, skills: newSkills})} 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Additional Notes</label>
                <textarea 
                  value={editForm.notes} 
                  onChange={e => setEditForm({...editForm, notes: e.target.value})}
                  className="w-full px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary min-h-[80px] resize-y"
                  placeholder="Any additional information..."
                />
              </div>

              <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-border-color">
                <button 
                  type="button" 
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary text-surface rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      <CreateTaskModal 
        isOpen={isCreateTaskOpen} 
        onClose={() => setIsCreateTaskOpen(false)} 
        defaultAssigneeId={user.id} 
      />
    </div>
  );
}
