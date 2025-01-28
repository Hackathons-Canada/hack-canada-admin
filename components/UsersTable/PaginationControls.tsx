"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { RESULTS_PER_PAGE } from "@/lib/constants";

interface PaginationControlsProps {
  className?: string;
  totalNumOfUsers: number;
  table: string;
  search: string;
}

const PaginationControls = ({
  totalNumOfUsers,
  className,
  table,
  search,
}: PaginationControlsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const lastPage = Math.ceil(Number(totalNumOfUsers) / RESULTS_PER_PAGE);
  const page = searchParams.get("page") ?? "1";
  const perPage = searchParams.get("perPage") ?? RESULTS_PER_PAGE;

  return (
    <div
      className={cn(
        "grid w-full grid-cols-3 items-center bg-background p-4 font-semibold max-md:text-sm",
        className,
      )}
    >
      <button
        className={cn("w-fit transition-colors hover:text-foreground", {
          "text-border hover:text-border": page === "1",
        })}
        disabled={page === "1"}
        onClick={() => {
          router.push(
            `${table}/?page=${Number(page) - 1}&perPage=${perPage}&${search}`,
          );
        }}
      >
        Previous
      </button>

      <div className="text-center font-normal">
        {page} /{" "}
        {Math.max(1, Math.ceil((totalNumOfUsers ?? 0) / Number(perPage)))}
      </div>
      <button
        className={cn("ml-auto w-fit transition-colors hover:text-foreground", {
          "text-border hover:text-border": page === `${lastPage}`,
        })}
        disabled={page === `${lastPage}`}
        onClick={() => {
          router.push(
            `${table}/?page=${Number(page) + 1}&perPage=${perPage}&${search}`,
          );
        }}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
