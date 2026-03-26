import React from 'react';

interface SkillTagProps {
  skill: string;
  className?: string;
  children?: React.ReactNode;
}

export function SkillTag({ skill, className = "", children }: SkillTagProps) {
  const SKILL_COLORS = [
    "text-primary",
    "text-success",
    "text-warning",
    "text-danger",
    "text-blue-500",
    "text-purple-500"
  ];
  
  const charCodeSum = skill.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorClass = SKILL_COLORS[charCodeSum % SKILL_COLORS.length];
  
  return (
    <span className={`inline-flex items-center gap-1 font-semibold tracking-wide ${colorClass} ${className}`}>
      #{skill}
      {children}
    </span>
  );
}
