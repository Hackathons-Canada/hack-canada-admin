import { Metadata } from "next";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LoginForm from "@/components/login-form";
import { getCurrentUser } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login | HC Admin",
  description: "Login to access the Hack Canada admin dashboard",
};

const LoginPage = async () => {
  const currentUser = await getCurrentUser();

  if (currentUser && currentUser.role !== "admin") {
    redirect("https://app.hackcanada.org");
  }

  if (currentUser && currentUser.role === "admin") {
    redirect("/");
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="flex items-center justify-center pb-2">
        <div className="relative h-24 w-40">
          <Image
            src="/logo.webp"
            alt="Hack Canada Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="mt-4 text-center text-2xl font-semibold">
          Admin Dashboard
        </h1>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
};

export default LoginPage;
