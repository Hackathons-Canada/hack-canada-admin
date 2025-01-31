"use client";

import { LoginSchema } from "@/lib/validations/login";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiResponse } from "@/types/api";

export const useAuth = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginSchema) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email.toLowerCase(),
            password: values.password,
          }),
        });

        const data: ApiResponse = await response.json();

        if (!data.success) {
          if (
            data.message === "You are not authorized to access this dashboard."
          ) {
            router.push("/auth-error");
            return;
          }
          toast.error(data.message);
          return;
        }

        toast.success(data.message);
        router.refresh();
        window.location.replace("/");
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Something went wrong");
      }
    });
  };

  return {
    form,
    isPending,
    onSubmit,
  };
};
