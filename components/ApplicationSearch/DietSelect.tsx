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

interface DietSelectProps {
  form: UseFormReturn<any>;
}

export const DietSelect = ({ form }: DietSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="diet"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Dietary Restrictions</FormLabel>
          <FormControl>
            <Select
              {...field}
              onValueChange={field.onChange}
              defaultValue="all"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select diet" />
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
  );
};
