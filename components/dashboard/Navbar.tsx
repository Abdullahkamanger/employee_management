"use client";

import { Bell, Search, User as UserIcon } from "lucide-react";
import Image from "next/image";

export default function Navbar({ user }: { user: any }) {
  return (
    <header className="h-20 border-b border-white/5 bg-black/10 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96 group hidden lg:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search portal..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full border-2 border-slate-900"></span>
        </button>

        <div className="h-8 w-px bg-white/10"></div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white">{user?.name}</p>
            <p className="text-xs text-slate-500 font-medium">{user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 p-0.5 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
              {user?.image ? (
                <Image src={user.image} alt={user.name} width={40} height={40} />
              ) : (
                <UserIcon size={20} className="text-purple-400" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
