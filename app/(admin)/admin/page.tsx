import { auth } from "@/lib/auth";
import Link from "next/link";
import { Users, Briefcase, TrendingUp, LayoutGrid, Clock, ShieldCheck } from "lucide-react";
import { getAllEmployees } from "@/lib/employee-actions";
import { getDepartments } from "@/lib/dept-actions";
import { getPayrollHistory } from "@/lib/payroll-actions";

export default async function AdminDashboard() {
  const session = await auth();
  
  // Fetch real data
  const [empRes, deptRes, payRes] = await Promise.all([
    getAllEmployees(),
    getDepartments(),
    getPayrollHistory()
  ]);

  const employees = empRes.success ? empRes.data : [];
  const departments = deptRes.success ? deptRes.data : [];
  const payrolls = payRes.success ? payRes.data : [];

  const totalPayroll = payrolls.reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const firstName = session?.user?.name?.split(" ")[0] || "Admin";

  const stats = [
    { 
      label: "Total Employees", 
      value: employees.length.toString(), 
      icon: Users, 
      color: "text-blue-400", 
      bg: "bg-blue-400/10",
      growth: `+${employees.slice(0, 5).length}` 
    },
    { 
      label: "Active Departments", 
      value: departments.length.toString(), 
      icon: LayoutGrid, 
      color: "text-purple-400", 
      bg: "bg-purple-400/10",
      growth: "Stable" 
    },
    { 
      label: "Monthly Payroll", 
      value: `$${(totalPayroll / 1000).toFixed(1)}k`, 
      icon: TrendingUp, 
      color: "text-emerald-400", 
      bg: "bg-emerald-400/10",
      growth: "+100%" 
    },
    { 
      label: "Security Level", 
      value: "High", 
      icon: ShieldCheck, 
      color: "text-amber-400", 
      bg: "bg-amber-400/10",
      growth: "Encrypted" 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Welcome back, {firstName}!
        </h2>
        <p className="text-slate-400">Here is the latest data from the organization today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:border-white/20 transition-all group shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full uppercase tracking-wider">
                {stat.growth}
              </span>
            </div>
            <h3 className="text-slate-400 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Hires Section */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock size={20} className="text-purple-400" /> Recent Hires
            </h3>
            <Link 
              href="/admin/employees"
              className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-widest"
            >
              View Directory
            </Link>
          </div>
          
          <div className="space-y-4">
            {employees.length === 0 ? (
              <p className="text-slate-500 text-sm italic py-4">No recent activity found.</p>
            ) : (
              employees.slice(0, 5).map((emp: any) => (
                <div key={emp._id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5 group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/10 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                    {emp.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium group-hover:text-purple-300 transition-colors">
                      {emp.name} joined the team
                    </p>
                    <p className="text-[11px] text-slate-500 uppercase tracking-tight">
                      {emp.role} • {emp.department?.name || "Unassigned"}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-600 font-medium">New</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-2">Admin Shortcuts</h3>
            <p className="text-slate-400 text-sm mb-6">Quickly manage system-wide operations.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link 
                href="/admin/payroll"
                className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl text-sm text-white font-semibold text-left transition-all hover:-translate-y-1"
              >
                Generate Payroll
              </Link>
              <Link 
                href="/admin/payroll"
                className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl text-sm text-white font-semibold text-left transition-all hover:-translate-y-1"
              >
                View Reports
              </Link>
              <Link 
                href="/admin/settings"
                className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl text-sm text-white font-semibold text-left transition-all hover:-translate-y-1"
              >
                Company Policies
              </Link>
              <Link 
                href="/admin/settings"
                className="bg-purple-600 hover:bg-purple-500 p-4 rounded-2xl text-sm text-white font-bold text-left transition-all shadow-lg shadow-purple-500/20"
              >
                System Settings
              </Link>
            </div>
          </div>
          {/* Decorative background glow */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 blur-[80px]" />
        </div>

      </div>
    </div>
  );
}