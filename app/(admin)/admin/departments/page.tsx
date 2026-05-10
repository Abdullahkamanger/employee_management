import { Plus, Search, Users, LayoutGrid, MoreVertical } from "lucide-react";

const departments = [
  { id: 1, name: "Engineering", head: "Alex Rivera", count: 42, color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: 2, name: "Design", head: "Sarah Jenkins", count: 12, color: "text-pink-400", bg: "bg-pink-400/10" },
  { id: 3, name: "Marketing", head: "Michael Chen", count: 18, color: "text-orange-400", bg: "bg-orange-400/10" },
  { id: 4, name: "Human Resources", head: "Emily Blunt", count: 6, color: "text-emerald-400", bg: "bg-emerald-400/10" },
];

export default function DepartmentsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Departments</h2>
          <p className="text-slate-400">Organize your workforce into functional units.</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20">
          <Plus size={18} /> Create Department
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input 
          type="text" 
          placeholder="Filter departments..."
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
        />
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-white/20 transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl ${dept.bg}`}>
                <LayoutGrid className={dept.color} size={24} />
              </div>
              <button className="text-slate-500 hover:text-white transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                {dept.name}
              </h3>
              <p className="text-sm text-slate-400 flex items-center gap-2">
                Head: <span className="text-slate-200">{dept.head}</span>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <Users size={16} />
                <span className="text-sm font-medium">{dept.count} Members</span>
              </div>
              <button className="text-xs font-bold text-purple-400 uppercase tracking-widest hover:text-purple-300">
                Manage
              </button>
            </div>
            
            {/* Subtle background glow on hover */}
            <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-white/5 blur-3xl rounded-full group-hover:bg-purple-500/10 transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
}