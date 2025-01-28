import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

type Props = {
  type?: "error" | "success";
  message: string;
  className?: string;
};
const Banner = ({ message, type, className }: Props) => {
  return (
    <div
      className={cn(
        "rounded-md border border-blue-500 bg-blue-500/75 p-2 text-blue-100 dark:border-blue-500 dark:bg-blue-500/25 sm:p-4",
        {
          "border-green-500 bg-green-500/75 text-green-100 dark:border-green-600 dark:bg-green-600/25":
            type === "success",
          "border-red-500 bg-red-500/75 text-red-100 dark:border-red-600 dark:bg-red-600/25":
            type === "error",
        },
        className,
      )}
    >
      <p className={cn("max-sm:text-sm")}>
        <Info className="mr-1.5 inline-block size-4 shrink-0 -translate-y-px" />
        <span>{message}</span>
      </p>
    </div>
  );
};
export default Banner;
