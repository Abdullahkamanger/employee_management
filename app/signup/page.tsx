"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { registerUser } from "@/lib/register";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { signIn } from "next-auth/react";


export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const register = async (formData: FormData) => {
    setLoading(true);
    try {
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
        await registerUser({ name, email, password });
        toast.success("Registration successful!");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Please try again. Error: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
            <p className="text-slate-300 mt-2">Join the Employee Management System</p>
          </div>

          <form action={register} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Full Name</label>
              <input 
                name="name"
                type="text" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Email Address</label>
              <input 
                name="email"
                type="email" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Password</label>
              <input 
                name="password"
                type="password" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 rounded-lg shadow-lg transition-all mt-4"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </motion.button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <span className="w-full border-b border-white/10"></span>
            <span className="px-4 text-xs text-slate-400 uppercase">Or</span>
            <span className="w-full border-b border-white/10"></span>
          </div>

          <button 
            className="w-full mt-6 flex items-center justify-center gap-3 bg-white text-slate-900 font-medium py-2.5 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => signIn("google", { callbackUrl: "/admin" })}
          >
            <Image src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" className="w-5 h-5" alt="google logo"
            width={20} height={20} />
            <span>Continue with Google</span>
          </button>

          <p className="text-center text-slate-400 mt-8 text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="text-purple-400 hover:text-purple-300 font-medium underline underline-offset-4">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}