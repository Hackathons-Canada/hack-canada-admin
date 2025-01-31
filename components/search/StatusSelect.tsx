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

const statuses = [
  { value: "all", label: "All Statuses" },
  { value: "not_applied", label: "Not Applied" },
  { value: "pending", label: "Pending Review" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "waitlisted", label: "Waitlisted" },
  { value: "cancelled", label: "Cancelled" },
] as const;

interface StatusSelectProps {
  form: UseFormReturn<{
    status?: "all" | ApplicationStatus;
  }>;
}

export const StatusSelect = ({ form }: StatusSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem className="w-full sm:col-span-2 lg:col-span-1">
          <FormLabel className="text-sm font-medium text-muted-foreground">
            Application Status
          </FormLabel>
          <FormControl>
            <Select
              {...field}
              onValueChange={field.onChange}
              defaultValue="all"
            >
              <SelectTrigger className="h-9 border-input bg-background px-3 py-1 text-sm shadow-sm transition-all duration-200 hover:bg-muted/50 focus:ring-1 focus:ring-primary/20">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {statuses.map((status) => (
                  <SelectItem
                    key={status.value}
                    value={status.value}
                    className="cursor-pointer text-sm transition-colors hover:bg-muted focus:bg-muted"
                  >
                    {status.label}
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
