import { auth } from "@/auth";
import DashboardWrapper from "@/components/DashboardWrapper";
import Navbar from "@/components/navigation/Navbar";
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
      <Navbar />
      <DashboardWrapper>{children}</DashboardWrapper>
    </div>
  );
}
