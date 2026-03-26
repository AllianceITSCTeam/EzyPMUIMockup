"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, Users, BarChart3, Menu, ListTodo, Settings } from "lucide-react";

export function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (val: boolean) => void }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Tasks", href: "/tasks", icon: ListTodo },
    { name: "Team", href: "/team", icon: Users },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Config", href: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={`bg-surface/80 backdrop-blur-xl shadow-[1px_0_40px_rgba(0,0,0,0.03)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col z-40 ${
        collapsed ? "w-16" : "w-68"
      }`}
    >
      <div className="h-14 flex items-center px-4 shrink-0 gap-3">
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 hover:bg-page-bg rounded-md text-text-secondary">
          <Menu className="w-5 h-5" />
        </button>
        {!collapsed && <span className="font-bold text-primary truncate">EzyPM</span>}
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-primary-light text-primary font-medium"
                  : "text-text-secondary hover:bg-page-bg hover:text-text-primary"
              }`}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className={`shrink-0 ${isActive ? "text-primary" : "text-text-secondary"}`} size={20} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
