"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { SearchInput } from "@/components/ui/search-input";
import { StatusSelect } from "./StatusSelect";
import { LevelSelect } from "./LevelSelect";

const schema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  school: z.string().optional(),
  major: z.string().optional(),
  levelOfStudy: z.string().optional(),
  status: z
    .enum([
      "all",
      "not_applied",
      "pending",
      "accepted",
      "rejected",
      "waitlisted",
      "cancelled",
    ] as const)
    .optional(),
});

type SearchFormValues = z.infer<typeof schema>;

export const ApplicationSearch = () => {
  const router = useRouter();

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      school: "",
      major: "",
      levelOfStudy: "all",
      status: "all",
    },
  });

  const onSubmit = (values: SearchFormValues) => {
    router.push("/applications?" + new URLSearchParams(values).toString());
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:shadow-md"
      >
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">Search Applications</h2>
          <p className="text-sm text-muted-foreground">
            Filter applications by their information and application status
          </p>
        </div>

        <div className="space-y-8 p-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              name="school"
              label="School"
              placeholder="Search by school"
            />
            <SearchInput
              form={form}
              name="major"
              label="Major"
              placeholder="Search by major"
            />
            <LevelSelect form={form} />
            <StatusSelect form={form} />
          </div>

          <div className="flex items-center gap-4 border-t pt-6">
            <Button
              type="button"
              onClick={() => {
                form.reset();
                router.push("/applications");
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
