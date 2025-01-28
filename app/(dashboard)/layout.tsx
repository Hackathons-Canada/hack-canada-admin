import { auth } from "@/auth";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-full min-h-svh flex-col">
      <div className="flex-1">
        <Navbar />
        <Sidebar />
        <main className="pt-20 lg:pl-72">{children}</main>
      </div>
    </div>
  );
}
