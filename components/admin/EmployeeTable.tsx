import { Mail, ShieldCheck, Calendar } from "lucide-react";

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function EmployeeTable({ employees }: { employees: Employee[] }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/5 border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
            <th className="px-6 py-4 font-semibold">Employee</th>
            <th className="px-6 py-4 font-semibold">Role</th>
            <th className="px-6 py-4 font-semibold">Joined Date</th>
            <th className="px-6 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {employees.map((emp) => (
            <tr key={emp._id} className="hover:bg-white/[0.02] transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/20">
                    {emp.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{emp.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Mail size={12} /> {emp.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  emp.role === "Admin" ? "bg-amber-400/10 text-amber-400 border border-amber-400/20" : "bg-blue-400/10 text-blue-400 border border-blue-400/20"
                }`}>
                  <ShieldCheck size={12} /> {emp.role}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(emp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-xs font-semibold text-purple-400 hover:text-white transition-colors">
                  Edit Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}