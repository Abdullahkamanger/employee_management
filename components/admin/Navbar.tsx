"use client";

import { Search, Bell, Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getUnreadCount } from "@/lib/message-actions";

interface NavbarProps {
  user: {
    name?: string | null;
    image?: string | null;
    role?: string;
  };
}

export default function Navbar({ user }: NavbarProps) {
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const res = await getUnreadCount();
      if (res.success) setUnreadCount(res.count);
    };
    fetchCount();
    const interval = setInterval(fetchCount, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-20 bg-black/10 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-20">
      
      {/* Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md relative group">
        <Search className="absolute left-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search employees, documents..." 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
        />
      </div>

      {/* Mobile Toggle (Visible only on small screens) */}
      <button className="md:hidden text-white">
        <Menu size={24} />
      </button>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <Link href="/admin/messages" className="relative p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#0a0a0c] px-1">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* User Profile */}
        <div className="flex items-center gap-4 pl-6 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white leading-none mb-1">
              {user.name || "Admin User"}
            </p>
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">
              {user.role}
            </p>
          </div>
          
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/20 bg-slate-800 flex items-center justify-center">
            {user.image ? (
              <Image 
                src={user.image} 
                alt="Profile" 
                fill 
                className="object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-white">
                {getInitials(user.name || "Admin User")}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}