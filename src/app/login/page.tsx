"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Boxes } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function Login() {
  const router = useRouter();
  const { users, setCurrentUser } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "123456") {
      // Normalize email/input for fuzzy finding
      const searchStr = email.toLowerCase().replace(/[\.\_@]/g, " ").trim();
      
      const matchedUser = users.find(u => {
        const nameNorm = u.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const emailNorm = u.email.toLowerCase().split('@')[0].replace(/[\.\_]/g, " ");
        // exact email match or name includes exact string
        return u.email.toLowerCase() === email.toLowerCase() || 
               nameNorm.includes(searchStr) || 
               searchStr.includes(emailNorm);
      });

      if (matchedUser) {
        setCurrentUser(matchedUser);
        router.push("/");
      } else if (email === "demo@ezypm.com") {
        setCurrentUser(users[0]);
        router.push("/");
      } else {
        // If password is correct but no user explicitly found, just grab the first user matching anything or random
        const fallbackUser = users.find(u => u.name.toLowerCase().includes(email[0].toLowerCase())) || users[0];
        setCurrentUser(fallbackUser);
        router.push("/");
      }
    } else {
      setError("Incorrect password. Please use 123456");
    }
  };

  return (
    <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-xl border border-border-color flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-primary">
          <Boxes className="w-8 h-8" />
          <span className="text-2xl font-bold tracking-tight">EzyPM</span>
        </div>
        <p className="text-text-secondary text-sm">Sign in to your account</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-primary">Email Address</label>
          <input 
            type="email" required
            value={email} onChange={e => {setEmail(e.target.value); setError("");}}
            className="px-3 py-2 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary w-full shadow-inner"
            placeholder="demo@ezypm.com"
          />
        </div>

        <div className="flex flex-col gap-1.5 relative">
          <label className="text-sm font-medium text-text-primary">Password</label>
          <div className="relative flex items-center">
            <input 
              type={showPassword ? "text" : "password"} required
              value={password} onChange={e => {setPassword(e.target.value); setError("");}}
              className="px-3 py-2 pr-10 bg-surface/50 border border-transparent shadow-[inset_0_1px_3px_rgb(0,0,0,0.02)] hover:bg-page-bg focus:bg-surface focus:ring-2 focus:ring-primary/20 transition-all rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary w-full shadow-inner"
              placeholder="••••••"
            />
            <button 
              type="button" onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute right-3 text-text-secondary hover:text-text-primary focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-danger font-medium text-center bg-danger/10 p-2 rounded-md border border-danger/20">{error}</p>}

        <div className="flex justify-end w-full -mt-2">
          <a href="#" className="text-xs font-medium text-primary hover:underline">Forgot password?</a>
        </div>

        <button 
          type="submit"
          className="mt-2 w-full px-4 py-2.5 bg-primary text-surface font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/30"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
