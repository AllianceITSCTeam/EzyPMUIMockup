"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { THEME_COLORS } from "@/lib/mockData";
import { Card } from "@/components/ui/Card";
import { SkillInput } from "@/components/ui/SkillInput";
import { Camera, X, Plus } from "lucide-react";

export default function Profile() {
  const { users, updateUser, addToast, logActivity } = useStore();
  
  // Fake current user as Tran Thi Hong Nhung
  const currentUser = users.find(u => u.email === "tran.thi.hong.nhung@ezypm.com") || users[0];
  
  const [name, setName] = useState(currentUser.name);
  const [title, setTitle] = useState(currentUser.role);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || "");
  const [bio, setBio] = useState(currentUser.notes || "");
  const [themeColor, setThemeColor] = useState(currentUser.themeColor || THEME_COLORS[0]);
  
  const [skills, setSkills] = useState<string[]>(currentUser.skills || ["React", "NodeJS", "Project Management"]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(currentUser.id, { name, email, phone, notes: bio, skills, themeColor });
    addToast("success", "Profile updated successfully!");
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto h-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-text-primary">My Profile</h2>
      </div>

      <Card className="p-8 flex flex-col md:flex-row gap-10 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-surface">
        {/* Avatar Column */}
        <div className="flex flex-col items-center gap-4 shrink-0">
          <div className="relative">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-[inset_0_1px_4px_rgb(0,0,0,0.05)] ring-4 overflow-hidden cursor-pointer group transition-all"
                 style={{ backgroundColor: `${themeColor}20`, color: themeColor, borderColor: `${themeColor}40`, '--tw-ring-color': `${themeColor}30` } as React.CSSProperties}>
              {currentUser?.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={name} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
              ) : (
                  name.substring(0, 2).toUpperCase()
              )}
              
              <div className="absolute inset-0 bg-secondary/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8" />
              </div>
            </div>
          </div>
          <button className="text-sm font-medium text-primary hover:underline px-3 py-1.5 bg-primary/10 rounded-md">
            Change avatar
          </button>
        </div>

        {/* Form Column */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Full Name</label>
              <input 
                type="text" value={name} onChange={e => setName(e.target.value)} required
                className="px-4 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary shadow-inner"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Email</label>
              <input 
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="px-4 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary shadow-inner"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Phone Number</label>
              <input 
                type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                className="px-4 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary shadow-inner"
              />
            </div>
            <div className="flex flex-col gap-1.5 opacity-70">
              <label className="text-sm font-medium text-text-primary">Role (Read-only)</label>
              <input 
                type="text" value={title} readOnly
                className="px-4 py-2 bg-text-secondary/10 border border-border-color rounded-md text-sm text-text-secondary cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-primary">Skills (Tags)</label>
            <SkillInput skills={skills} onChange={setSkills} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-primary">Theme Color</label>
            <div className="flex flex-wrap gap-2.5 p-3 rounded-lg bg-page-bg/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)]">
              {THEME_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setThemeColor(color)}
                  className={`w-7 h-7 rounded-full shadow-sm transition-all focus:outline-none hover:scale-110 ${
                    themeColor === color ? 'ring-2 ring-offset-2 ring-offset-surface scale-110 shadow-md' : 'ring-1 ring-black/10 hover:ring-black/20'
                  }`}
                  style={{ backgroundColor: color, '--tw-ring-color': color } as React.CSSProperties}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 pt-6 border-t border-border-color flex justify-end">
            <button type="submit" className="px-6 py-2.5 bg-primary text-surface font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/30">
              Save Changes
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
