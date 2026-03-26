"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBadge } from "@/components/ui/Badge";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useStore } from "@/store/useStore";
import { getActionContext } from "@/lib/activityContext";
import { ProjectStatus, TaskStatus } from "@/types";
import { DateProgressBar } from "@/components/ui/DateProgressBar";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Activity, Clock, CheckCircle2, LayoutDashboard, BarChart2, History, ClipboardList, AlertCircle, Timer } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { tasks, projects, activities, users, currentUser } = useStore();
  const [activeTab, setActiveTab] = useState("Current Tasks");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === "Current Tasks") return t.status === "In Progress" || t.status === "To Do";
    if (activeTab === "Pending Tasks") return t.status === "Pending" || t.status === "On Hold" || t.status === "No Specs";
    if (activeTab === "Past Tasks") return t.status === "Completed" || t.status === "Closed";
    return true;
  });

  const userTasks = tasks.filter((t) => t.assigneeId === currentUser?.id);
  const totalTasks = userTasks.length;
  const activeProjectsCount = new Set(userTasks.map((t) => t.projectId)).size;
  const inProgressTasks = userTasks.filter((t) => t.status === "In Progress").length;
  const overdueTasks = mounted ? userTasks.filter((t) => t.status !== "Completed" && t.status !== "Closed" && t.dueDate && new Date(t.dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)).length : 0;
  const hoursThisMonth = currentUser?.id === "u1" ? 124 : currentUser?.id === "u2" ? 40 : 16;
  const currentMonth = mounted ? new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }) : '';

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-primary" />
          Dashboard <span className="text-text-secondary font-normal text-lg hidden sm:inline">— Welcome back, {currentUser?.name || "System User"} 👋</span>
        </h2>
      </div>

      {/* QUICK STATS CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        
        {/* Total Tasks */}
        <div className="relative overflow-hidden rounded-2xl p-5 bg-surface border shadow-[0_1px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 group border-border-color">
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-[0.03] group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-500" style={{ background: 'radial-gradient(circle, var(--color-primary), transparent)' }}></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">Total Tasks</p>
              <p className="text-4xl font-black mt-2 tracking-tight text-text-primary">{totalTasks}</p>
              <p className="text-xs mt-1 text-text-secondary">Across {activeProjectsCount} project{activeProjectsCount === 1 ? '' : 's'}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary opacity-80"></div>
        </div>

        {/* In Progress */}
        <div className="relative overflow-hidden rounded-2xl p-5 bg-surface border shadow-[0_1px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 group border-border-color">
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-[0.04] group-hover:scale-110 group-hover:opacity-[0.06] transition-all duration-500" style={{ background: 'radial-gradient(circle, var(--color-warning), transparent)' }}></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">In Progress</p>
              <p className="text-4xl font-black mt-2 tracking-tight text-text-primary">{inProgressTasks}</p>
              <p className="text-xs mt-1 text-text-secondary">Active tasks right now</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-warning/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
              <Clock className="w-5 h-5 text-warning" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-warning opacity-80"></div>
        </div>

        {/* Overdue */}
        <div className="relative overflow-hidden rounded-2xl p-5 bg-surface border shadow-[0_1px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 group border-border-color">
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-[0.04] group-hover:scale-110 group-hover:opacity-[0.06] transition-all duration-500" style={{ background: 'radial-gradient(circle, var(--color-danger), transparent)' }}></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">Overdue</p>
              <p className="text-4xl font-black mt-2 tracking-tight text-danger drop-shadow-sm">{overdueTasks}</p>
              <p className="text-xs mt-1 text-text-secondary">Needs attention</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-danger/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
              <AlertCircle className="w-5 h-5 text-danger" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-danger opacity-80"></div>
        </div>

        {/* Hours This Month */}
        <div className="relative overflow-hidden rounded-2xl p-5 bg-surface border shadow-[0_1px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 group border-border-color">
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-[0.04] group-hover:scale-110 group-hover:opacity-[0.06] transition-all duration-500" style={{ background: 'radial-gradient(circle, var(--color-success), transparent)' }}></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">Total Hours</p>
              <p className="text-4xl font-black mt-2 tracking-tight text-text-primary">{hoursThisMonth}h</p>
              <p className="text-xs mt-1 text-text-secondary">{currentMonth}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-success/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
              <Timer className="w-5 h-5 text-success" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-success opacity-80"></div>
        </div>

      </section>

      {/* PROGRESS THEO PROJECT */}
      <section>
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
          <BarChart2 className="w-4 h-4" />
          Progress Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.slice(0, 3).map((project) => {
            const isOverrun = project.progressPercentage > 100;
            return (
              <Card 
                key={project.id} 
                className="p-4 flex flex-col gap-3 transition-colors shadow-sm hover:shadow-md"
                style={{ borderTopColor: project.themeColor, borderTopWidth: "4px" }}
              >
                <div className="flex items-center gap-2 font-bold text-text-primary">
                  {project.avatarUrl ? (
                    <img src={project.avatarUrl} alt={project.name} className="w-5 h-5 rounded hover:scale-105 transition-transform object-contain p-0.5 shadow-sm shrink-0" style={{ backgroundColor: project.themeColor || '#1e293b' }} />
                  ) : (
                    <span className="shrink-0 leading-none">📁</span>
                  )}
                  <span 
                    className="truncate hover:text-primary hover:underline cursor-pointer transition-colors" 
                    title={project.name}
                    onClick={() => router.push(`/projects/${project.id}`)}
                  >
                    {project.name}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-y-1 text-sm text-text-secondary">
                  <div>Est: <span className="font-medium text-text-primary">{project.estimateHours}h</span></div>
                  <div>
                    Act: <span className={`font-medium ${isOverrun ? "text-warning" : "text-text-primary"}`}>
                      {project.actualHours}h {isOverrun && "⚠️"}
                    </span>
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
              </Card>
            );
          })}
        </div>
      </section>

      {/* TASK LISTS */}
      <section className="mt-2">
        <Card className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-1 bg-surface p-2">
            {["Current Tasks", "Pending Tasks", "Past Tasks"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeTab === tab
                    ? "bg-page-bg shadow-sm text-primary"
                    : "text-text-secondary hover:text-text-primary hover:bg-page-bg/50"
                }`}
              >
                {tab === "Current Tasks" && <Activity className="w-4 h-4" />}
                {tab === "Pending Tasks" && <Clock className="w-4 h-4" />}
                {tab === "Past Tasks" && <CheckCircle2 className="w-4 h-4" />}
                {tab}
              </button>
            ))}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-page-bg text-text-secondary text-xs uppercase">
                  <th className="px-6 py-3 font-medium">Task Name</th>
                  <th className="px-6 py-3 font-medium">Project</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Est</th>
                  <th className="px-6 py-3 font-medium">Act</th>
                  <th className="px-6 py-3 font-medium">Due Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredTasks.map((task) => {
                  const taskProject = projects.find(p => p.id === task.projectId);
                  return (
                    <tr 
                      key={task.id} 
                      className="transition-colors group"
                    >
                      <td className="px-6 py-3 font-medium text-text-primary hover:underline cursor-pointer" onClick={() => router.push(`/tasks/${task.id}`)}>{task.title}</td>
                      <td className="px-6 py-3 text-text-secondary">{taskProject?.name || "N/A"}</td>
                      <td className="px-6 py-3"><StatusBadge status={task.status as TaskStatus} /></td>
                      <td className="px-6 py-3 text-text-secondary">{task.estimateHours}h</td>
                      <td className="px-6 py-3 text-text-secondary">{task.actualHours}h</td>
                      <td className="px-6 py-3">
                        <DateProgressBar startDate={task.startDate} dueDate={task.dueDate} />
                      </td>
                    </tr>
                  );
                })}
                {filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-text-secondary italic">
                      No tasks found in {activeTab}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* ACTIVITIES LOG */}
      <section className="mt-2 mb-8">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
          <History className="w-4 h-4" />
          Activities Log
        </h3>
        <Card className="p-0">
          {activities.slice(0, 5).map((activity) => {
            const user = users.find(u => u.id === activity.userId);
            const ctx = getActionContext(activity.action);
            
            return (
              <div key={activity.id} className="flex items-center p-3 hover:bg-page-bg/50 transition-colors gap-3">
                <UserAvatar user={user} size="md" />
                
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-text-primary text-[13px]">{user?.name || "System Admin"}</span>
                    <span className="text-text-secondary text-[11px] opacity-50 hidden sm:inline">•</span>
                    <span className="text-[11px] font-medium text-text-secondary whitespace-nowrap">
                      {activity.timestamp}
                    </span>
                  </div>
                  <p className="text-[13px] text-text-secondary truncate pr-2">{activity.action}</p>
                </div>
                
                <div className="shrink-0 flex items-center justify-center pr-1">
                  <div className={`p-1.5 rounded bg-surface shadow-sm flex items-center justify-center`}>
                    <div className={`p-0.5 rounded ${ctx.bg}`}>
                      {ctx.icon}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="p-3 bg-page-bg text-center rounded-b-lg border-t border-border-color/30">
            <button onClick={() => router.push('/activities')} className="w-full cursor-pointer text-sm text-primary font-medium hover:underline">
              View all activities
            </button>
          </div>
        </Card>
      </section>
    </div>
  );
}
