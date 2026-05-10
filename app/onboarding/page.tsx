"use client";

import { useState } from "react";
import { setInitialPassword } from "@/lib/onboarding";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await setInitialPassword(password);
    if (res.success) {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-white/5 p-8 rounded-2xl border border-white/10 max-w-sm w-full">
        <h1 className="text-xl font-bold mb-2">Secure your account</h1>
        <p className="text-slate-400 text-sm mb-6">
          Since you signed in with Google, set a password so you can access your account from anywhere.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="password" 
            placeholder="Choose a password"
            className="w-full bg-black/20 border border-white/10 p-3 rounded-lg"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-purple-600 p-3 rounded-lg font-bold">
            Complete Setup
          </button>
        </form>
      </div>
    </div>
  );
}