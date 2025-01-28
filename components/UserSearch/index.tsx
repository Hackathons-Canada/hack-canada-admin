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
  role: z.string().optional(),
});
export const UserSearch = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      role: "all",
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    router.push("/users?" + new URLSearchParams(values).toString());
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid max-w-screen-md grid-cols-2 gap-4 rounded-lg border p-4 md:grid-cols-3 md:p-8"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="max-sm:col-span-2">
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
            <FormItem className="max-sm:col-span-2">
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="the Dino" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="col-span-2 md:col-span-1">
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    <SelectItem value="hacker">Hacker</SelectItem>
                    <SelectItem value="mentor">Mentor</SelectItem>
                    <SelectItem value="sponsor">Sponsor</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="col-span-2 mt-4 flex items-center gap-2 max-sm:flex-col-reverse sm:col-span-2 [&>*]:w-full">
          <Button
            type="button"
            onClick={() => {
              form.reset();
              router.push("/users");
            }}
            variant="outline"
            className=""
          >
            Clear
          </Button>
          <Button type="submit" className="">
            Search
          </Button>
        </div>
      </form>
    </Form>
  );
};
