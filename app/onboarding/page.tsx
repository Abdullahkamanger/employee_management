"use client";

import { Suspense } from "react";
import { Lock, Rocket, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { completeOnboarding } from "@/lib/onboarding-actions";
import { toast } from "sonner";

function OnboardingContent() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    
    try {
      const res = await completeOnboarding(password, token || undefined, email || undefined);
      if (res.success) {
        toast.success("Account setup complete!");
        // Small delay to let user see success state
        setTimeout(() => {
           if (token) {
             router.push("/signin");
           } else {
             router.push("/");
           }
           router.refresh(); // Refresh to update session
        }, 1500);
      } else {
        toast.error(res.error || "Failed to set password");
        setLoading(false);
      }
    } catch (err: any) {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 selection:bg-purple-500/30">
      <div className="max-w-md w-full space-y-8 relative">
        {/* Background Glows */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full animate-pulse delay-700" />
        
        <div className="text-center relative z-10">
          <div className="w-20 h-20 bg-purple-600/10 border border-purple-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-purple-500/10">
            <Rocket className="text-purple-400" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome to the Team!</h1>
          <p className="text-slate-400 mt-2 text-sm leading-relaxed">Let's get your secure account set up so you can access the dashboard.</p>
        </div>

        <form onSubmit={handleComplete} className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl space-y-6 relative z-10 shadow-2xl shadow-black/50">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Create Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-slate-700"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-slate-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all group shadow-xl active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Finalizing Account...</span>
              </>
            ) : (
              <>
                <span>Complete Setup</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="space-y-4">
          <p className="text-center text-slate-600 text-[10px] uppercase tracking-widest font-bold">
            Secure encrypted setup by EMS Pro
          </p>
          <div className="flex justify-center gap-4 text-[10px] text-slate-500 font-medium">
            <span className="flex items-center gap-1"><ShieldCheck size={10} /> 256-bit Encryption</span>
            <span className="flex items-center gap-1"><Lock size={10} /> HIPAA Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="text-purple-500 animate-spin" size={40} />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}