import { auth } from "@/lib/auth";
import { getEmployeeProfile } from "@/lib/employee-actions";
import { getUserPayroll } from "@/lib/payroll-actions";
import { 
  Banknote, Building2, Briefcase, 
  Calendar, ArrowUpRight, MessageCircle 
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const userId = session.user.id;
  if (!userId) return null;

  const [profileRes, payrollRes] = await Promise.all([
    getEmployeeProfile(session.user.email),
    getUserPayroll(userId)
  ]);

  const profile = profileRes.success ? profileRes.data : null;
  const payrolls = payrollRes.success ? payrollRes.data : [];

  const stats = [
    { label: "Department", value: profile?.department?.name || "Unassigned", icon: Building2, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Designation", value: profile?.designation || "Staff", icon: Briefcase, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Salary", value: `$${profile?.salary?.toLocaleString() || "0"}`, icon: Banknote, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Next Pay Day", value: "May 30, 2026", icon: Calendar, color: "text-amber-400", bg: "bg-amber-400/10" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome back, {session.user?.name}</h1>
        <p className="text-slate-400 mt-2">Here's what's happening with your account today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payroll History */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recent Payroll</h2>
            <Link href="/dashboard/payroll" className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Month</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payrolls.length > 0 ? payrolls.map((p: any, i: number) => (
                  <tr key={i} className="text-sm hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{p.month}</td>
                    <td className="px-6 py-4 text-slate-300">${p.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                        p.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                        p.status === 'Processing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-slate-500/10 text-slate-400 border border-white/10'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{p.paymentMethod}</td>
                  </tr>
                )) : (
                   <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-500 italic">No payroll records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Communication */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 rounded-3xl shadow-xl shadow-purple-500/20 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-2">Need Help?</h3>
              <p className="text-purple-100 text-sm mb-6 leading-relaxed">Have questions about your payroll or designation? Contact Admin directly.</p>
              <Link 
                href="/dashboard/messages"
                className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-all shadow-lg active:scale-95"
              >
                <MessageCircle size={18} />
                <span>Message Admin</span>
              </Link>
            </div>
            <MessageCircle className="absolute -bottom-4 -right-4 text-white/10 w-32 h-32 rotate-12 group-hover:scale-110 transition-transform duration-500" />
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
             <h3 className="text-lg font-bold text-white mb-4">Announcements</h3>
             <div className="space-y-4">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Company Event</p>
                  <p className="text-sm font-medium text-white mt-1">Annual Summer Retreat</p>
                  <p className="text-xs text-slate-500 mt-1">June 15, 2026</p>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 opacity-60">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Policy Update</p>
                  <p className="text-sm font-medium text-white mt-1">New Remote Work Guidelines</p>
                  <p className="text-xs text-slate-500 mt-1">May 01, 2026</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
