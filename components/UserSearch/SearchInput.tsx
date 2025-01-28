"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface SearchInputProps {
  form: UseFormReturn<any>;
  name: "firstName" | "lastName" | "email";
  label: string;
  placeholder: string;
}

export const SearchInput = ({
  form,
  name,
  label,
  placeholder,
}: SearchInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              className="h-9 border-input bg-background px-3 py-1 text-sm transition-colors hover:bg-muted focus-visible:ring-1"
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
