"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDown, ArrowUp } from "lucide-react";

type SortField = "reviewCount" | "averageRating" | "internalResult";
type SortOrder = "asc" | "desc";

interface SortApplicationsProps {
  onSort: (field: SortField, order: SortOrder) => void;
  currentSort: {
    field: SortField;
    order: SortOrder;
  };
}

export default function SortApplications({
  onSort,
  currentSort,
}: SortApplicationsProps) {
  const handleSortOrderToggle = () => {
    onSort(currentSort.field, currentSort.order === "asc" ? "desc" : "asc");
  };

  const handleFieldChange = (field: SortField) => {
    onSort(field, currentSort.order);
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentSort.field}
        onValueChange={(value: SortField) => handleFieldChange(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="reviewCount">Review Count</SelectItem>
          <SelectItem value="averageRating">Average Rating</SelectItem>
          <SelectItem value="internalResult">Status</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        onClick={handleSortOrderToggle}
        className="h-10 w-10"
      >
        {currentSort.order === "asc" ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
