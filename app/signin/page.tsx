"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
     const toastId = toast.loading("Verifying credentials...");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    toast.dismiss(toastId);
  
    
    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      toast.error("Login failed"+(result.error ? ": " + result.error : ""));
    } else {
      router.push("/"); // Redirect to dashboard on success
        toast.success("Login successful");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 px-4 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, -60, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px]" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Welcome Back
            </h1>
            <p className="text-slate-400 mt-3">Access your employee portal</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6 text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleCredentialsLogin} className="space-y-6">
            <div className="group">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all placeholder:text-slate-600"
                placeholder="developer@firm.com"
              />
            </div>

            <div className="group">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-white text-slate-950 font-bold py-3.5 rounded-xl shadow-xl hover:bg-slate-100 transition-all disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Login to System"}
            </motion.button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-slate-500 font-medium">Or Secure Login</span></div>
          </div>

          <motion.button 
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            onClick={() => signIn("google", { callbackUrl: "/admin/dashboard" })}
            className="w-full flex items-center justify-center gap-3 border border-white/10 text-white font-medium py-3 rounded-xl transition-colors"
          >
            <Image src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" width={20} height={20} />
            <span>Sign in with Google</span>
          </motion.button>

          <p className="text-center text-slate-500 mt-10 text-sm">
            New to the firm?{" "}
            <Link href="/signup" className="text-white hover:text-purple-400 font-semibold transition-colors">
              Request Access
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}