import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Employee Dashboard</h1>
      <p className="text-slate-400">Welcome, {session.user?.name}. Your personalized dashboard is coming soon.</p>
      <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
        <p className="text-sm text-slate-500">You are logged in as an <span className="text-purple-400 font-bold uppercase">{session.user?.role}</span></p>
      </div>
    </div>
  );
}
