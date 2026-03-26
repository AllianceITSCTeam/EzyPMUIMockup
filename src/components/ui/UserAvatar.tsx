import React from 'react';
import { User } from '@/types';

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User | null | undefined;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  className?: string;
  fallbackName?: string;
}

export function UserAvatar({ user, size = "md", className = "", fallbackName, ...props }: UserAvatarProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
    xl: "w-12 h-12 text-base",
    "2xl": "w-16 h-16 text-2xl",
    "3xl": "w-20 h-20 text-3xl",
  };

  const ringStyles = user?.themeColor
    ? {
        backgroundColor: `${user.themeColor}15`,
        color: user.themeColor,
        borderColor: `${user.themeColor}50`
      }
    : {
        backgroundColor: "rgba(var(--color-primary-rgb), 0.1)",
        color: "var(--color-primary)",
        borderColor: "rgba(0,0,0,0.05)"
      };

  const name = user?.name || fallbackName || "User";
  const initials = name.substring(0, 2).toUpperCase();

  return (
    <div 
      className={`rounded-full flex items-center justify-center font-bold shrink-0 overflow-hidden border shadow-sm transition-colors ${sizeClasses[size]} ${className}`}
      style={ringStyles}
      {...props}
    >
      {user?.avatarUrl ? (
        <img src={user.avatarUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
