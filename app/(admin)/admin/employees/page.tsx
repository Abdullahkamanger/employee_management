import { getAllEmployees } from "@/lib/employee-actions";
import EmployeeTable from "@/components/admin/EmployeeTable";
import { Plus, Search } from "lucide-react";

export default async function EmployeesPage() {
  const result = await getAllEmployees();
  const employees = result.success ? result.data : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Employees</h2>
          <p className="text-slate-400">Manage and view all members of the organization.</p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all">
          <Plus size={18} /> Add New Employee
        </button>
      </div>

      {/* Search/Filter Bar */}
      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email, or department..."
            className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
      </div>

      <EmployeeTable employees={employees} />
    </div>
  );
}