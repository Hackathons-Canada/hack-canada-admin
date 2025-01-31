"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { SearchInput } from "@/components/ui/search-input";
import { RoleSelect } from "./RoleSelect";
import { StatusSelect } from "./StatusSelect";

const schema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
  email: z.string().optional(),
  status: z
    .enum([
      "all",
      "not_applied",
      "waitlisted",
      "cancelled",
      "pending",
      "accepted",
      "rejected",
    ])
    .optional(),
});

type SearchFormValues = z.infer<typeof schema>;

export const UserSearch = () => {
  const router = useRouter();

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      role: "all",
      email: "",
      status: "all",
    },
  });

  const onSubmit = (values: SearchFormValues) => {
    router.push("/users?" + new URLSearchParams(values).toString());
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:shadow-md"
      >
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">Search Users</h2>
          <p className="text-sm text-muted-foreground">
            Filter users by their information and status
          </p>
        </div>

        <div className="space-y-8 p-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SearchInput
              form={form}
              name="name"
              label="Name"
              placeholder="Search by name"
            />
            <SearchInput
              form={form}
              name="email"
              label="Email"
              placeholder="Search by email"
            />
            <RoleSelect form={form} />
            <StatusSelect form={form} />
          </div>

          <div className="flex items-center gap-4 border-t pt-6">
            <Button
              type="button"
              onClick={() => {
                form.reset();
                router.push("/users");
              }}
              variant="outline"
              className="flex-1 bg-background transition-all duration-200 hover:bg-muted"
            >
              Reset Filters
            </Button>
            <Button
              type="submit"
              className="flex-1 transition-all duration-200"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
