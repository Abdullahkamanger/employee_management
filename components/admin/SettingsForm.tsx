"use client";

import { useState } from "react";
import { User, Lock, Bell, Save, Camera, Loader2 } from "lucide-react";
import { updateUserSettings } from "@/lib/settings-actions";
import { toast } from "sonner";

export default function SettingsForm({ initialUser }: { initialUser: any }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initialUser?.name || "");
  const [twoFactor, setTwoFactor] = useState(initialUser?.twoFactor || false);
  const [notifs, setNotifs] = useState({
    email: initialUser?.notifications?.email ?? true,
    payroll: initialUser?.notifications?.payroll ?? true,
    newJoiners: initialUser?.notifications?.newJoiners ?? true,
  });

  const handleSave = async () => {
    setLoading(true);
    const res = await updateUserSettings({
      name,
      notifications: notifs,
      twoFactor
    });

    if (res.success) {
      toast.success("Settings updated successfully!");
    } else {
      toast.error(res.error || "Failed to update settings");
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 gap-8">
      
      {/* Profile Section */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
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
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
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
      <section className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-2 text-amber-400 mb-2">
          <Lock size={20} />
          <h3 className="text-lg font-semibold text-white">Security</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Update your password to keep your account secure.</p>
            <button className="text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors">
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
              className={`w-10 h-5 rounded-full relative transition-colors ${twoFactor ? 'bg-purple-600' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${twoFactor ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </section>

      {/* System Notifications Section */}
      <section className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-2 text-blue-400 mb-2">
          <Bell size={20} />
          <h3 className="text-lg font-semibold text-white">Notifications</h3>
        </div>
        
        <div className="space-y-4">
          {[
            { id: "email", label: "Email Notifications", desc: "Receive daily summary of employee activity" },
            { id: "payroll", label: "Payroll Alerts", desc: "Get notified when payroll is processed" },
            { id: "newJoiners", label: "New Joiners", desc: "Alert when a new employee finishes onboarding" }
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
              <input 
                type="checkbox" 
                className="accent-purple-600 h-4 w-4 cursor-pointer" 
                checked={notifs[item.id as keyof typeof notifs]}
                onChange={(e) => setNotifs({ ...notifs, [item.id]: e.target.checked })}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Footer Actions */}
      <div className="flex justify-end gap-4 pt-4">
        <button 
          onClick={() => {
            setName(initialUser?.name || "");
            setTwoFactor(initialUser?.twoFactor || false);
            setNotifs({
              email: initialUser?.notifications?.email ?? true,
              payroll: initialUser?.notifications?.payroll ?? true,
              newJoiners: initialUser?.notifications?.newJoiners ?? true,
            });
          }}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors"
        >
          Reset
        </button>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-500/20 active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          Save Changes
        </button>
      </div>

    </div>
  );
}
