"use client";

import {
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
import { UseFormReturn } from "react-hook-form";

const roles = [
  { value: "all", label: "All Roles" },
  { value: "unassigned", label: "Unassigned" },
  { value: "hacker", label: "Hacker" },
  { value: "mentor", label: "Mentor" },
  { value: "sponsor", label: "Sponsor" },
  { value: "volunteer", label: "Volunteer" },
  { value: "admin", label: "Admin" },
] as const;

interface RoleSelectProps {
  form: UseFormReturn<any>;
}

export const RoleSelect = ({ form }: RoleSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="role"
      render={({ field }) => (
        <FormItem className="sm:col-span-2 md:col-span-1">
          <FormLabel className="text-sm font-medium">Role</FormLabel>
          <FormControl>
            <Select {...field} onValueChange={field.onChange}>
              <SelectTrigger className="h-9 border-input bg-background px-3 py-1 text-sm transition-colors hover:bg-muted">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem
                    key={role.value}
                    value={role.value}
                    className="cursor-pointer"
                  >
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
