import { auth } from "@/lib/auth";
import { Users, Briefcase, TrendingUp, AlertCircle, Clock } from "lucide-react";
import { getAllEmployees } from "@/lib/employee-actions";

export default async function AdminDashboard() {
  const session = await auth();
  const result = await getAllEmployees();
  const employees = result.success ? result.data : [];
  
  const firstName = session?.user?.name?.split(" ")[0] || "Admin";

  // Combine real data with the styled stats array
  const stats = [
    { 
      label: "Total Employees", 
      value: employees.length.toString(), 
      icon: Users, 
      color: "text-blue-400", 
      bg: "bg-blue-400/10",
      growth: "+4%" 
    },
    { 
      label: "Active Projects", 
      value: "12", 
      icon: Briefcase, 
      color: "text-purple-400", 
      bg: "bg-purple-400/10",
      growth: "Stable" 
    },
    { 
      label: "Monthly Payroll", 
      value: "$45,200", 
      icon: TrendingUp, 
      color: "text-emerald-400", 
      bg: "bg-emerald-400/10",
      growth: "+12%" 
    },
    { 
      label: "Pending Tasks", 
      value: "8", 
      icon: AlertCircle, 
      color: "text-amber-400", 
      bg: "bg-amber-400/10",
      growth: "-2" 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Welcome back, {firstName}!
        </h2>
        <p className="text-slate-400">Here is the latest data from the firm today.</p>
      </div>

      {/* Stats Grid - Using the map logic for cleaner code */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:border-white/20 transition-all group">
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
        
        {/* Recent Activity Section */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock size={20} className="text-purple-400" /> Recent Activity
            </h3>
            <button className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-widest">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {/* We can map real employee data here eventually */}
            {employees.slice(0, 4).map((emp: any) => (
              <div key={emp._id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5 group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/10 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                  {emp.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium group-hover:text-purple-300 transition-colors">
                    {emp.name} joined the team
                  </p>
                  <p className="text-[11px] text-slate-500 uppercase tracking-tight">
                    {emp.role} • New Member
                  </p>
                </div>
                <span className="text-[10px] text-slate-600 font-medium">Just now</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-2">Admin Shortcuts</h3>
            <p className="text-slate-400 text-sm mb-6">Quickly manage system-wide operations.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl text-sm text-white font-semibold text-left transition-all hover:-translate-y-1">
                Generate Payroll
              </button>
              <button className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl text-sm text-white font-semibold text-left transition-all hover:-translate-y-1">
                View Reports
              </button>
              <button className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl text-sm text-white font-semibold text-left transition-all hover:-translate-y-1">
                Company Policies
              </button>
              <button className="bg-purple-600 hover:bg-purple-500 p-4 rounded-2xl text-sm text-white font-bold text-left transition-all shadow-lg shadow-purple-500/20">
                System Settings
              </button>
            </div>
          </div>
          {/* Decorative background glow */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 blur-[80px]" />
        </div>

      </div>
    </div>
  );
}