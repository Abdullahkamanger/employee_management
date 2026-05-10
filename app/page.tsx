import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  // If not logged in, send to signin
  if (!session) {
    redirect("/signin");
  }

  // Redirect based on role
  const role = session.user?.role?.toLowerCase();

  if (role === "admin") {
    redirect("/admin");
  } else {
    // For Managers and Employees
    redirect("/dashboard");
  }
}
