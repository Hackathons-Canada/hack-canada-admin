"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const schema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  age: z.string().optional(),
  diet: z.string().optional(),
  school: z.string().optional(),
  status: z.string().optional(),
});

export const HackerSearch = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      age: "all",
      diet: "all",
      school: "",
      status: "all",
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    router.push("/hackers?" + new URLSearchParams(values).toString());
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid max-w-screen-lg grid-cols-6 gap-4 rounded-lg border p-4 md:p-8"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="col-span-3 sm:col-span-2">
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Elf" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="col-span-3 sm:col-span-2">
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="the Dino" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="school"
          render={({ field }) => (
            <FormItem className="col-span-3 sm:col-span-2">
              <FormLabel>School</FormLabel>
              <FormControl>
                <Input placeholder="CS Hub" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem className="max-sm:col-span-3 sm:col-span-2">
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue="all"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="under">&lt; 18</SelectItem>
                    <SelectItem value="over">&ge; 18</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="diet"
          render={({ field }) => (
            <FormItem className="col-span-3 sm:col-span-2">
              <FormLabel>Diet Restrict</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue="all"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Diet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="halal">Halal</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="kosher">Kosher</SelectItem>
                    <SelectItem value="gluten">Gluten Free</SelectItem>
                    <SelectItem value="dairy">Dairy Free</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="col-span-3 sm:col-span-2">
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue="all"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="waitListed">Waitlisted</SelectItem>
                    <SelectItem value="pending">Under Review</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="col-span-6 mt-4 flex items-center gap-4 max-sm:flex-col-reverse">
          <Button
            type="button"
            onClick={() => {
              form.reset();
              router.push("/hackers");
            }}
            variant="outline"
            className="w-full sm:w-1/3 lg:w-1/4"
          >
            Clear
          </Button>
          <Button type="submit" className="w-full sm:w-1/3 lg:w-1/4">
            Search
          </Button>
        </div>
      </form>
    </Form>
  );
};
