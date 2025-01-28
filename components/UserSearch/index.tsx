"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { SearchInput } from "./SearchInput";
import { RoleSelect } from "./RoleSelect";
import { StatusSelect } from "./StatusSelect";

const schema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.string().optional(),
  email: z.string().optional(),
  status: z.string().optional(),
});

type SearchFormValues = z.infer<typeof schema>;

export const UserSearch = () => {
  const router = useRouter();

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
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
        className="max-w-screen-lg space-y-6 rounded-lg border border-input bg-card p-6"
      >
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <SearchInput
            form={form}
            name="firstName"
            label="First Name"
            placeholder="Search by first name"
          />
          <SearchInput
            form={form}
            name="lastName"
            label="Last Name"
            placeholder="Search by last name"
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

        <div className="flex items-center gap-4 pt-2">
          <Button
            type="button"
            onClick={() => {
              form.reset();
              router.push("/users");
            }}
            variant="outline"
            className="w-full bg-background hover:bg-muted"
          >
            Clear
          </Button>
          <Button type="submit" className="w-full">
            Search
          </Button>
        </div>
      </form>
    </Form>
  );
};
