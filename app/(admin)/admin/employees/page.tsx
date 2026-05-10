import { getAllEmployees } from "@/lib/employee-actions";
import EmployeeTable from "@/components/admin/EmployeeTable";
import EmployeeHeader from "@/components/admin/EmployeeHeader";

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; deptId?: string; status?: string }>;
}) {
  const { search, deptId, status } = await searchParams;
  const currentStatus = status || "Active";

  // Use searchParams to filter data on the server
  const result = await getAllEmployees({
    search,
    department: deptId,
    status: currentStatus,
  });
  
  const employees = result.success ? result.data : [];

  return (
    <div className="space-y-8">
      <EmployeeHeader employees={employees} />
      <EmployeeTable employees={employees} />
    </div>
  );
}