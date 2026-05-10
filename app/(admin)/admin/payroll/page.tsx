import { 
  DollarSign, 
  Download, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight 
} from "lucide-react";

const payrollData = [
  { id: "PAY-001", name: "abdullah kamanger", amount: "$4,500.00", status: "Paid", date: "May 01, 2026", method: "Bank Transfer" },
  { id: "PAY-002", name: "Sarah Jenkins", amount: "$3,800.00", status: "Processing", date: "May 05, 2026", method: "PayPal" },
  { id: "PAY-003", name: "Michael Chen", amount: "$5,200.00", status: "Pending", date: "May 10, 2026", method: "Bank Transfer" },
];

export default function PayrollPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Payroll</h2>
          <p className="text-slate-400">Track and manage employee compensation.</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all">
          <DollarSign size={18} /> Run Payroll
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-black border border-white/10 p-8 rounded-3xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-slate-400 text-sm font-medium mb-1">Total Monthly Payout</p>
            <h3 className="text-4xl font-bold text-white mb-6">$124,500.00</h3>
            <div className="flex gap-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg">
                <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Paid</p>
                <p className="text-white font-bold">$92,000</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-lg">
                <p className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Pending</p>
                <p className="text-white font-bold">$32,500</p>
              </div>
            </div>
          </div>
          <ArrowUpRight className="absolute top-8 right-8 text-white/5" size={120} />
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col justify-center">
          <p className="text-slate-400 text-sm mb-4 text-center">Next Payday</p>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">May 25</p>
            <p className="text-xs text-purple-400 font-bold uppercase mt-1 tracking-[0.2em]">15 Days Remaining</p>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Recent Payouts</h3>
          <div className="flex gap-2">
            <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-white">
              <Filter size={18} />
            </button>
            <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-white">
              <Download size={18} />
            </button>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase text-slate-500 tracking-widest font-bold">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payrollData.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">{item.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="text-[11px] text-slate-500">{item.method}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-white">{item.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status === "Paid" ? "bg-emerald-400/10 text-emerald-400" : 
                      item.status === "Processing" ? "bg-blue-400/10 text-blue-400" : "bg-amber-400/10 text-amber-400"
                    }`}>
                      {item.status === "Paid" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-slate-400 font-medium">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}