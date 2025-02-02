"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  selectedReviewer?: string;
  reviewers: {
    id: string;
    name: string;
  }[];
};

const ReviewerSelector = ({ selectedReviewer, reviewers }: Props) => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      <p className="text-sm font-medium">Select Reviewer:</p>
      <Select
        defaultValue={selectedReviewer}
        name="reviewer"
        onValueChange={(value) => {
          const url = new URL(window.location.href);
          url.searchParams.set("reviewer", value);
          router.push(url.toString());
        }}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Choose a reviewer" />
        </SelectTrigger>
        <SelectContent>
          {reviewers.map((reviewer) => (
            <SelectItem key={reviewer.id} value={reviewer.id}>
              {reviewer.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ReviewerSelector;
