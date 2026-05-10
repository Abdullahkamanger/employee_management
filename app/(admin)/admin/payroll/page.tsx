import { getPayrollHistory } from "@/lib/payroll-actions";
import RunPayrollButton from "@/components/admin/RunPayrollButton";
import ExportCSVButton from "@/components/admin/ExportCSVButton";
import { 
  Filter, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  Receipt
} from "lucide-react";
import PayrollStatusAction from "@/components/admin/PayrollStatusAction";

export default async function PayrollPage() {
  const { data: payrollEntries } = await getPayrollHistory();
  
  // Calculate totals
  const totalPayout = payrollEntries.reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const paidAmount = payrollEntries
    .filter((p: any) => p.status === "Paid")
    .reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const pendingAmount = totalPayout - paidAmount;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Payroll</h2>
          <p className="text-slate-400">Track and manage employee compensation.</p>
        </div>
        <RunPayrollButton />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-black border border-white/10 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <p className="text-slate-400 text-sm font-medium mb-1">Total Monthly Liability</p>
            <h3 className="text-4xl font-bold text-white mb-6">
              ${totalPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
            <div className="flex gap-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg">
                <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Disbursed</p>
                <p className="text-white font-bold">${paidAmount.toLocaleString()}</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-lg">
                <p className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Pending</p>
                <p className="text-white font-bold">${pendingAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <ArrowUpRight className="absolute top-8 right-8 text-white/5" size={120} />
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col justify-center items-center backdrop-blur-sm">
          <p className="text-slate-400 text-sm mb-4">Total Disbursements</p>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{payrollEntries.length}</p>
            <p className="text-xs text-purple-400 font-bold uppercase mt-1 tracking-[0.2em]">Records Generated</p>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Receipt size={20} className="text-purple-400" /> Recent Payouts
          </h3>
          <div className="flex gap-2">
            <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
              <Filter size={18} />
            </button>
            <ExportCSVButton data={payrollEntries} filename="payroll_report" />
          </div>
        </div>

        {payrollEntries.length === 0 ? (
          <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-20 text-center">
            <p className="text-slate-500">No payroll records found. Click "Run Payroll" to generate the first batch.</p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase text-slate-500 tracking-widest font-bold bg-white/5">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Month</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payrollEntries.map((item: any) => (
                  <tr key={item._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 text-[11px] font-mono text-slate-500">
                      {item._id.substring(item._id.length - 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">
                        {item.employeeId?.name || "Deleted User"}
                      </p>
                      <p className="text-[11px] text-slate-500">{item.paymentMethod}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-white">
                      ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <PayrollStatusAction id={item._id} currentStatus={item.status} />
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-slate-400 font-medium">
                      {item.month}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}