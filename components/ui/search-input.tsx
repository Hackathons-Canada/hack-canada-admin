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
  name: string;
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
        <FormItem className="w-full">
          <FormLabel className="text-sm font-medium text-muted-foreground">
            {label}
          </FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              className="h-9 border-input bg-background px-3 py-1 text-sm shadow-sm transition-all duration-200 hover:bg-muted/50 focus:ring-1 focus:ring-primary/20"
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
