"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBadge } from "@/components/ui/Badge";
import { useStore } from "@/store/useStore";
import { Calendar, ChevronDown, BarChart3 } from "lucide-react";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ProjectReports() {
  const { projects, users, tasks } = useStore();
  
  const [dateRange, setDateRange] = useState("This Month");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const options = ["Today", "This Week", "This Month", "Last Month", "This Quarter", "This Year"];

  const projectData = projects.map(p => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    Estimate: p.estimateHours,
    Actual: p.actualHours,
  }));

  const getCapacityByRange = (range: string) => {
    switch(range) {
      case "Today": return 8;
      case "This Week": return 40;
      case "This Month": return 160;
      case "Last Month": return 160;
      case "This Quarter": return 480;
      case "This Year": return 1920;
      default: return 160;
    }
  };

  const getLoggedHoursByRange = (userId: string, range: string) => {
    let logs = tasks.flatMap(t => t.timeLogs || []).filter(log => log.userId === userId);
    
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    logs = logs.filter(log => {
       if (!log.date) return false;
       const logDate = new Date(log.date);
       switch(range) {
         case "Today": return log.date.startsWith(todayStr);
         case "This Week": 
            const diffTime = Math.abs(now.getTime() - logDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            return diffDays <= 7;
         case "This Month": return logDate.getFullYear() === currentYear && logDate.getMonth() === currentMonth;
         case "Last Month": 
            let lastM = currentMonth - 1;
            let lastY = currentYear;
            if (lastM < 0) { lastM = 11; lastY--; }
            return logDate.getFullYear() === lastY && logDate.getMonth() === lastM;
         case "This Quarter": 
            const currentQ = Math.floor(currentMonth / 3);
            const logQ = Math.floor(logDate.getMonth() / 3);
            return logDate.getFullYear() === currentYear && currentQ === logQ;
         case "This Year": return logDate.getFullYear() === currentYear;
         default: return true;
       }
    });

    return logs.reduce((sum, log) => sum + log.hours, 0);
  };

  const teamData = users.slice(0, 6).map(u => ({
    name: u.name.split(" ").pop(),
    Logged: getLoggedHoursByRange(u.id, dateRange),
    Capacity: getCapacityByRange(dateRange)
  }));


  return (
    <div className="flex flex-col gap-6 w-full h-full pb-10">
      <div className="flex justify-between items-center shrink-0 mb-4">
        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Project Reports
        </h2>
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            className="flex items-center gap-2 px-3 py-1.5 bg-surface shadow-[0_1px_3px_rgb(0,0,0,0.02)] rounded-md text-sm font-medium text-text-primary hover:shadow-md transition-all border border-transparent hover:border-border-color cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-text-secondary pr-0.5" />
            {dateRange} 
            <ChevronDown className={`w-3.5 h-3.5 text-text-secondary ml-1 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-10 right-0 mt-1 w-44 bg-surface border border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {options.map(opt => (
                <button
                  key={opt}
                  onClick={() => { setDateRange(opt); setIsDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                    dateRange === opt 
                      ? "bg-primary/5 text-primary font-bold" 
                      : "text-text-secondary hover:bg-page-bg/80 hover:text-text-primary font-medium"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: Project Progress */}
        <Card className="p-6 h-[400px] flex flex-col">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-6">
            Estimate vs Actual per Project (Hours)
          </h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#F1F5F9' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                <Bar dataKey="Estimate" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Actual" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* CHART 2: Team Utilization */}
        <Card className="p-6 h-[400px] flex flex-col">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-6">
            Team Utilization (Logged vs Capacity)
          </h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#F1F5F9' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                <Bar dataKey="Capacity" fill="#94A3B8" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Logged" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* DATA TABLE */}
      <Card className="flex flex-col overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-page-bg text-text-secondary text-xs uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">Project Name</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Estimate</th>
                <th className="px-6 py-3 font-medium text-right">Actual</th>
                <th className="px-6 py-3 font-medium text-right">Remaining</th>
                <th className="px-6 py-3 font-medium text-right">Progress %</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {projects.map((project) => {
                const isOverrun = project.progressPercentage > 100;
                return (
                  <tr 
                    key={project.id} 
                    className={`transition-colors ${isOverrun ? "bg-warning/5 hover:bg-warning/10" : "hover:bg-page-bg/50"}`}
                  >
                    <td className="px-6 py-4 font-medium text-text-primary">{project.name}</td>
                    <td className="px-6 py-4"><StatusBadge status={project.status} /></td>
                    <td className="px-6 py-4 text-right text-text-secondary">{project.estimateHours}h</td>
                    <td className={`px-6 py-4 text-right font-medium ${isOverrun ? "text-warning" : "text-text-primary"}`}>
                      {project.actualHours}h {isOverrun && "⚠️"}
                    </td>
                    <td className="px-6 py-4 text-right text-text-secondary">{project.remainingHours}h</td>
                    <td className="px-6 py-4 text-right w-48">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-24">
                          <ProgressBar percentage={project.progressPercentage} isOverrun={isOverrun} />
                        </div>
                        <span className={`font-bold ${isOverrun ? "text-warning" : "text-text-primary"}`}>
                          {project.progressPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
