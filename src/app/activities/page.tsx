"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Card } from "@/components/ui/Card";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Activity, Search, Filter } from "lucide-react";
import { getActionContext } from "@/lib/activityContext";

export default function ActivitiesPage() {
  const { activities, users } = useStore();
  
  const [userFilter, setUserFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredActivities = activities.filter(act => {
    // 1. User filter
    if (userFilter !== "all" && act.userId !== userFilter) return false;
    
    // 2. Type filter
    const ctx = getActionContext(act.action);
    if (typeFilter !== "all" && ctx.type !== typeFilter) return false;
    
    // 3. Search query (Target Object)
    if (searchQuery && !act.action.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden w-full">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Activity Center
          </h1>
          <p className="text-text-secondary mt-1">Track all system events across tasks, projects, and resources.</p>
        </div>
      </div>

      <Card className="flex flex-col h-full overflow-hidden rounded-xl border border-transparent shadow-[0_4px_20px_rgb(0,0,0,0.03)] bg-surface">
        {/* Filters Top Bar */}
        <div className="p-5 bg-page-bg flex flex-wrap gap-4 items-center justify-between shrink-0 mb-2">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search specific object/action..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface border border-transparent rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-primary shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4 text-text-secondary" />
              <span className="text-text-secondary font-medium hidden sm:inline">Filters:</span>
            </div>
            
            <CustomSelect
              value={typeFilter}
              onChange={(val: any) => setTypeFilter(val)}
              options={[
                { value: "all", label: "All Types" },
                { value: "task", label: "Tasks" },
                { value: "project", label: "Projects" },
                { value: "resource", label: "Resources" },
                { value: "system", label: "System" }
              ]}
              className="w-40"
            />
            
            <CustomSelect
              value={userFilter}
              onChange={(val: any) => setUserFilter(val)}
              options={[
                { value: "all", label: "All Users" },
                ...users.map(u => ({ value: u.id, label: u.name }))
              ]}
              className="w-40"
            />
          </div>
        </div>

        {/* Activity List */}
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {filteredActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-text-secondary p-10">
              <Activity className="w-12 h-12 mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-text-primary">No activities found</h3>
              <p className="mt-1">Try adjusting your filters to see more results.</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setTypeFilter("all");
                  setUserFilter("all");
                }}
                className="mt-4 text-primary font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 px-3">
              {filteredActivities.map((act) => {
                const user = users.find(u => u.id === act.userId);
                const ctx = getActionContext(act.action);
                
                return (
                  <div key={act.id} className="px-4 py-3 rounded-xl flex gap-4 hover:bg-page-bg/80 transition-colors items-center group">
                    <UserAvatar user={user} size="lg" />
                    
                    <div className="flex flex-col flex-1 min-w-0 justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-text-primary text-sm">{user?.name || "System Admin"}</span>
                        <span className="text-text-secondary text-sm opacity-50">•</span>
                        <span className="text-text-secondary text-xs font-medium tracking-wide">{act.timestamp}</span>
                      </div>
                      <p className="text-[15px] text-text-primary/90 leading-snug">
                        {act.action}
                      </p>
                    </div>
                    
                    <div className="shrink-0 pl-4 hidden md:flex flex-col items-end justify-center min-w-[100px]">
                      <div className={`p-1.5 rounded-md ${ctx.bg} flex items-center justify-center shadow-[inset_0_1px_2px_rgb(0,0,0,0.01)]`}>
                        {ctx.icon}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary mt-1.5">
                        {ctx.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
