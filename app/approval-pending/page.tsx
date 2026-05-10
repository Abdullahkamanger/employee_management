"use client";

import { motion } from "framer-motion";
import { Clock, ShieldAlert, LogOut, MessageCircle } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function ApprovalPendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg z-10"
      >
        <div className="bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-xl shadow-2xl text-center">
          <div className="w-20 h-20 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-amber-500/30">
            <Clock size={40} className="text-amber-400 animate-pulse" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">Approval Pending</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Thank you for joining <span className="text-purple-400 font-bold tracking-wider">EMS PRO</span>. 
            Your account is currently under review by our administration team.
          </p>

          <div className="space-y-4 mb-10">
            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 text-left">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 mt-1">
                <ShieldAlert size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Security Check</p>
                <p className="text-xs text-slate-500 mt-1">We are verifying your identity and assigning your organization roles.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 text-left">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 mt-1">
                <MessageCircle size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Next Steps</p>
                <p className="text-xs text-slate-500 mt-1">Once approved, you'll receive an email notification and full access to your dashboard.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Sign Out
            </button>
            <Link 
              href="mailto:admin@emspro.com"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
            >
              Contact Admin
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
