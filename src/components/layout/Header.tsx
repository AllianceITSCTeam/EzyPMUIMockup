"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Search as SearchIcon, LogOut, User as UserIcon, Settings, Moon, Sun, FolderKanban, CheckSquare, LayoutDashboard, ListTodo, Users as UsersIcon, BarChart2, Activity } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/lib/themeContext";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { getActionContext } from "@/lib/activityContext";
import { UserAvatar } from "@/components/ui/UserAvatar";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { activities, currentUser, recentLinks, projects, tasks, users } = useStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const SCREENS = [
    { name: "Dashboard", url: "/", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Projects", url: "/projects", icon: <FolderKanban className="w-4 h-4" /> },
    { name: "Tasks", url: "/tasks", icon: <ListTodo className="w-4 h-4" /> },
    { name: "Team Directory", url: "/team", icon: <UsersIcon className="w-4 h-4" /> },
    { name: "Reports", url: "/reports", icon: <BarChart2 className="w-4 h-4" /> },
    { name: "Activity Center", url: "/activities", icon: <Activity className="w-4 h-4" /> },
  ];

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  return (
    <header className="h-16 bg-surface/70 backdrop-blur-xl shadow-[0_1px_30px_rgba(0,0,0,0.02)] flex items-center justify-between px-6 shrink-0 sticky top-0 z-30 transition-all duration-300">
      
      <div className="flex-1 flex items-center gap-3 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mr-1 hidden md:block">Recent:</span>
        {recentLinks.length === 0 && <span className="text-xs text-text-secondary italic">No recent pages</span>}
        {recentLinks.map(link => {
           let iconElem = null;
           if (link.iconType === 'member') {
             iconElem = <UserAvatar user={{ name: link.name, avatarUrl: link.avatarUrl, themeColor: link.themeColor } as any} size="sm" className="w-4 h-4 text-[8px]" />;
           } else if (link.iconType === 'task') {
             iconElem = <CheckSquare className="w-3.5 h-3.5" style={{ color: link.themeColor || "var(--color-primary)" }} />;
           } else {
             // Project
             iconElem = link.avatarUrl ? (
               <img src={link.avatarUrl} alt={link.name} className="w-4 h-4 rounded-[4px] object-cover bg-surface" style={{ backgroundColor: link.themeColor || '#1e293b' }} />
             ) : (
               <FolderKanban className="w-3.5 h-3.5" style={{ color: link.themeColor || "var(--color-primary)" }} />
             );
           }

           return (
             <Link 
               key={link.url} 
               href={link.url} 
               className="flex items-center gap-2 px-3 py-1.5 bg-page-bg/50 hover:bg-page-bg text-text-primary text-xs font-medium rounded-full border shadow-[inset_0_1px_2px_rgb(0,0,0,0.02)] transition-colors whitespace-nowrap"
               style={{ borderColor: link.themeColor ? `${link.themeColor}50` : 'var(--border-color)' }}
             >
               {iconElem}
               <span className="truncate max-w-[120px]">{link.name}</span>
             </Link>
           );
        })}
      </div>

      <div className="flex items-center gap-4 w-auto justify-end shrink-0 pl-4">
        <div className="relative hidden md:block" ref={searchRef}>
          <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="pl-9 pr-4 py-1.5 bg-page-bg/50 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-text-primary w-64 focus:bg-surface focus:shadow-sm"
          />
          
          {isSearchOpen && searchQuery.length > 0 && (
            <div className="absolute top-full mt-2 w-80 right-0 bg-surface rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-primary/10 overflow-hidden z-50 flex flex-col max-h-[70vh]">
              <div className="overflow-y-auto p-2 no-scrollbar">
                {/* Screens */}
                {(() => {
                  const filteredScreens = SCREENS.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
                  if (filteredScreens.length === 0) return null;
                  return (
                    <div className="mb-3">
                      <div className="px-3 py-1 text-[10px] font-bold text-text-secondary uppercase tracking-wider">Screens</div>
                      {filteredScreens.map(s => (
                        <Link key={s.name} href={s.url} onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="flex items-center gap-2 px-3 py-2 hover:bg-page-bg rounded-md transition-colors text-sm text-text-primary font-medium">
                          <span className="text-primary">{s.icon}</span>
                          {s.name}
                        </Link>
                      ))}
                    </div>
                  );
                })()}

                {/* Projects */}
                {(() => {
                  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
                  if (filteredProjects.length === 0) return null;
                  return (
                    <div className="mb-3">
                      <div className="px-3 py-1 text-[10px] font-bold text-text-secondary uppercase tracking-wider">Projects</div>
                      {filteredProjects.map(p => (
                        <Link key={p.id} href={`/projects/${p.id}`} onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="flex items-center gap-2 px-3 py-2 hover:bg-page-bg rounded-md transition-colors text-sm text-text-primary font-medium">
                          {p.avatarUrl ? (
                            <img src={p.avatarUrl} alt={p.name} className="w-6 h-6 rounded-md object-cover bg-surface shadow-sm border" style={{ borderColor: `${p.themeColor || 'var(--color-primary)'}80` }} />
                          ) : (
                            <div className="w-6 h-6 rounded-md flex items-center justify-center border shadow-sm" style={{ borderColor: `${p.themeColor || 'var(--color-primary)'}80`, backgroundColor: `${p.themeColor || 'var(--color-primary)'}15` }}>
                              <FolderKanban className="w-3.5 h-3.5" style={{ color: p.themeColor || 'var(--color-primary)' }} />
                            </div>
                          )}
                          <span className="truncate">{p.name}</span>
                        </Link>
                      ))}
                    </div>
                  );
                })()}

                {/* Tasks */}
                {(() => {
                  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
                  if (filteredTasks.length === 0) return null;
                  return (
                    <div className="mb-3">
                      <div className="px-3 py-1 text-[10px] font-bold text-text-secondary uppercase tracking-wider">Tasks</div>
                      {filteredTasks.slice(0, 5).map(t => {
                        const proj = projects.find(p => p.id === t.projectId);
                        return (
                          <Link key={t.id} href={`/tasks/${t.id}`} onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="flex flex-col gap-0.5 px-3 py-2 hover:bg-page-bg rounded-md transition-colors text-sm">
                            <div className="flex items-center gap-2 text-text-primary font-medium">
                              <CheckSquare className="w-4 h-4" style={{ color: proj?.themeColor || "var(--color-primary)" }} />
                              <span className="truncate">{t.title}</span>
                            </div>
                            <span className="text-[10px] text-text-secondary ml-6">{proj?.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Members */}
                {(() => {
                  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()));
                  if (filteredUsers.length === 0) return null;
                  return (
                    <div className="mb-1">
                      <div className="px-3 py-1 text-[10px] font-bold text-text-secondary uppercase tracking-wider">Members</div>
                      {filteredUsers.slice(0, 5).map(u => (
                        <Link key={u.id} href={`/team/${u.id}`} onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="flex items-center gap-2 px-3 py-2 hover:bg-page-bg rounded-md transition-colors text-sm text-text-primary font-medium">
                          <UserAvatar user={u as any} size="sm" />
                          <span className="truncate">{u.name}</span>
                        </Link>
                      ))}
                    </div>
                  );
                })()}

                {/* Empty State */}
                {['Screens', 'Projects', 'Tasks', 'Members'].every(type => {
                  if (type === 'Screens') return SCREENS.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0;
                  if (type === 'Projects') return projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0;
                  if (type === 'Tasks') return tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0;
                  if (type === 'Members') return users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0;
                  return true;
                }) && (
                  <div className="p-4 text-center text-sm text-text-secondary italic">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="relative" ref={notifRef}>
          {mounted && (
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative p-2 text-text-secondary hover:text-text-primary transition-colors focus:outline-none mr-1"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}

          <button  
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
          >
            <Bell className="w-5 h-5" />
            {activities.length > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 min-w-[16px] h-[16px] bg-danger text-white text-[9px] font-bold flex items-center justify-center rounded-full px-1 shadow-sm ring-[1.5px] ring-surface leading-none pb-[0.5px]">
                {activities.length > 99 ? '99+' : activities.length}
              </span>
            )}
          </button>
          
          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 bg-surface rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-transparent overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="p-4 pb-2 flex justify-between items-center">
                <span className="font-bold text-sm text-text-primary tracking-tight">Notifications</span>
              </div>
              <div className="max-h-96 overflow-y-auto flex flex-col p-2 gap-1">
                {activities.slice(0, 5).map((act, i) => {
                  const user = users.find(u => u.id === act.userId);
                  const ctx = getActionContext(act.action);
                  return (
                    <div key={act.id || i} className="px-3 py-3 rounded-lg hover:bg-page-bg/80 transition-colors flex gap-3 cursor-pointer items-start">
                      <UserAvatar user={user} size="md" className="self-start" />
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm text-text-primary font-medium leading-snug">
                          {act.action}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1.5 align-middle">
                          <div className={`p-1 rounded flex items-center justify-center ${ctx.bg}`}>
                            {ctx.icon}
                          </div>
                          <span className="text-[11px] text-text-secondary font-medium tracking-wide">
                            {act.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {activities.length === 0 && (
                  <div className="p-4 text-center text-sm text-text-secondary">No recent activities</div>
                )}
              </div>
              <div className="border-t border-border-color/30 mt-1 mx-2">
                <Link href="/activities" className="block py-3 text-center text-sm text-primary font-bold hover:bg-page-bg/50 transition-colors rounded-b-lg">
                  View All Activity
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-page-bg rounded-md focus:outline-none transition-all group"
          >
            <UserAvatar user={currentUser} size="md" className="group-hover:ring-2 ring-primary/30 transition-shadow" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-surface rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-transparent overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="p-4 pb-2 flex flex-col">
                <span className="font-bold text-sm text-text-primary tracking-tight">{currentUser?.name || "System User"}</span>
                <span className="text-xs text-text-secondary font-medium">{currentUser?.email || "No Email"}</span>
              </div>
              <div className="flex flex-col p-2 gap-1">
                <Link href="/profile" onClick={() => setShowProfile(false)} className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary font-medium hover:bg-page-bg/80 rounded-md transition-colors flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-primary" /> My Profile
                </Link>
                <Link href="#" className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary font-medium hover:bg-page-bg/80 rounded-md transition-colors flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Settings
                </Link>
              </div>
              <div className="border-t border-border-color/30 mt-1 mx-2 mb-2 pt-2">
                <button 
                  onClick={() => router.push('/login')}
                  className="w-full text-left px-3 py-2 text-sm text-danger hover:bg-danger/10 hover:text-danger rounded-md transition-colors flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
