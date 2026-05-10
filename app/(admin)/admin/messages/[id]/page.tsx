import { auth } from "@/lib/auth";
import MessageCenter from "@/components/dashboard/MessageCenter";
import { redirect } from "next/navigation";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export default async function AdminMessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  await connectDB();
  const employee = await User.findById(id).select("name").lean();

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl text-white">
        <p>Employee not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Conversation with {employee.name}</h1>
          <p className="text-slate-400 mt-2">Manage this employee's inquiry.</p>
        </div>
      </div>

      <MessageCenter 
        targetUserId={id} 
        currentUserId={session.user.id} 
        title={employee.name}
      />
    </div>
  );
}
