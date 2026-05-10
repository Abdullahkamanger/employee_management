import { getDepartments } from "@/lib/dept-actions";
import DeptHeader from "@/components/admin/DeptHeader";
import DeptCard from "@/components/admin/DeptCard";
import { LayoutGrid } from "lucide-react";

export default async function DepartmentsPage() {
  const { data: departments } = await getDepartments();

  return (
    <div className="space-y-8">
      <DeptHeader />

      {!departments || departments.length === 0 ? (
        <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-24 text-center backdrop-blur-sm">
          <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-2xl">
            <LayoutGrid className="text-slate-600" size={40} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No departments yet</h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
            Create your first department to start organizing your organization's staff and structure.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept: any) => (
            <DeptCard key={dept._id} dept={dept} />
          ))}
        </div>
      )}
    </div>
  );
}