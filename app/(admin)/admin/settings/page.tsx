import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import SettingsClient from "@/components/admin/SettingsClient";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.email) return null;

  await connectDB();
  const dbUser = await User.findOne({ email: session.user.email }).lean();

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Settings</h2>
        <p className="text-slate-400">Manage your account settings and system preferences.</p>
      </div>

      <SettingsClient initialUser={JSON.parse(JSON.stringify(dbUser))} />
    </div>
  );
}