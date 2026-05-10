import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Second layer of security: Ensure only Admins can enter this layout
  if (!session || (session.user.role).toLowerCase() !== "admin") {
    redirect("/signin");
  }

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-slate-200">
      {/* Sidebar - Fixed on desktop, hidden on mobile (hidden for now) */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar user={session.user} />

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-br from-transparent to-purple-900/5">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}