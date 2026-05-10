"use client";

import { useState } from "react";
import { updateUserSettings } from "@/lib/settings-actions";
import { 
  Save, Loader2, Camera, User, 
  Lock, Bell, Shield, LayoutGrid, 
  FileText, Activity, Server, Database 
} from "lucide-react";
import { toast } from "sonner";
import ChangePasswordModal from "./ChangePasswordModal";

export default function SettingsClient({ initialUser }: { initialUser: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  
  // State for Profile
  const [name, setName] = useState(initialUser?.name || "");
  
  // State for Security Toggle
  const [twoFactor, setTwoFactor] = useState(initialUser?.twoFactor || false);

  // State for Notifications
  const [notifs, setNotifs] = useState({
    email: initialUser?.notifications?.email ?? true,
    payroll: initialUser?.notifications?.payroll ?? true,
    newJoiners: initialUser?.notifications?.newJoiners ?? true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    const res = await updateUserSettings({ 
      name, 
      notifications: notifs, 
      twoFactor 
    });

    if (res.success) {
      toast.success("Settings saved successfully!");
    } else {
      toast.error("Failed to save: " + res.error);
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      {/* Profile Section */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-purple-400 mb-2">
          <User size={20} />
          <h3 className="text-lg font-semibold text-white">Profile Information</h3>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-slate-800 border-2 border-white/10 flex items-center justify-center overflow-hidden">
              {initialUser?.image ? (
                 <img src={initialUser.image} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <span className="text-2xl font-bold text-slate-500">{name?.[0] || "A"}</span>
              )}
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-purple-600 rounded-lg text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                placeholder="Full Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
              <input 
                type="email" 
                defaultValue={initialUser?.email || ""} 
                disabled
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-amber-400 mb-2">
          <Lock size={20} />
          <h3 className="text-lg font-semibold text-white">Security</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Update your password to keep your account secure.</p>
            <button 
              onClick={() => setIsPassModalOpen(true)}
              className="text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors"
            >
              Change Password →
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div>
              <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
              <p className="text-xs text-slate-500">Add an extra layer of security</p>
            </div>
            <button 
              onClick={() => setTwoFactor(!twoFactor)}
              className={`w-12 h-6 rounded-full transition-all relative ${twoFactor ? 'bg-purple-600' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${twoFactor ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-blue-400 mb-2">
          <Bell size={20} />
          <h3 className="text-lg font-semibold text-white">Notifications</h3>
        </div>
        
        <div className="space-y-4">
          {Object.entries(notifs).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-white capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}</p>
                <p className="text-xs text-slate-500">Receive alerts related to {key.toLowerCase()}</p>
              </div>
              <input 
                type="checkbox" 
                checked={value}
                onChange={(e) => setNotifs({...notifs, [key]: e.target.checked})}
                className="accent-purple-600 h-5 w-5 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Organization Policies */}
      <section id="policies" className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-purple-400 mb-2">
          <FileText size={20} />
          <h3 className="text-lg font-semibold text-white">Organization Policies</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Remote Work Policy", size: "1.2 MB", date: "Jan 2024" },
            { name: "Code of Conduct", size: "850 KB", date: "Dec 2023" },
            { name: "Security Protocols", size: "2.4 MB", date: "Mar 2024" },
            { name: "Leave & Benefits", size: "1.5 MB", date: "Feb 2024" },
          ].map((policy) => (
            <div key={policy.name} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                  <FileText size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{policy.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{policy.size} • Updated {policy.date}</p>
                </div>
              </div>
              <Save size={14} className="text-slate-600 group-hover:text-purple-400" />
            </div>
          ))}
        </div>
      </section>

      {/* System Status */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-emerald-400 mb-2">
          <Activity size={20} />
          <h3 className="text-lg font-semibold text-white">System Status</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Database", status: "Operational", color: "text-emerald-400", icon: Database },
            { label: "Storage", status: "92% Free", color: "text-blue-400", icon: Server },
            { label: "Auth API", status: "Online", color: "text-emerald-400", icon: Shield },
            { label: "SMTP Server", status: "Connected", color: "text-emerald-400", icon: Server },
          ].map((item) => (
            <div key={item.label} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
              <item.icon className={`mx-auto mb-2 ${item.color}`} size={16} />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{item.label}</p>
              <p className={`text-xs font-bold ${item.color}`}>{item.status}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Save Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-2xl shadow-purple-500/40 active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          Save All Settings
        </button>
      </div>

      <ChangePasswordModal 
        isOpen={isPassModalOpen} 
        onClose={() => setIsPassModalOpen(false)} 
      />
    </div>
  );
}
