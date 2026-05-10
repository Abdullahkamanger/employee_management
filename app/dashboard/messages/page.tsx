import { auth } from "@/lib/auth";
import { getAdminUsers } from "@/lib/employee-actions";
import MessageCenter from "@/components/dashboard/MessageCenter";
import { redirect } from "next/navigation";

export default async function EmployeeMessagesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const adminRes = await getAdminUsers();
  const admin = adminRes.data?.[0]; // Just pick the first admin for now

  if (!admin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
        <p className="text-slate-400">No administrator found to message.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white">Support Center</h1>
        <p className="text-slate-400 mt-2">Send messages directly to the administration team.</p>
      </div>

      <MessageCenter 
        targetUserId={admin._id} 
        currentUserId={session.user.id} 
        title="System Admin"
      />
    </div>
  );
}
